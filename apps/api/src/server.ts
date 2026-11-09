import Fastify from 'fastify';
import { Pool } from 'pg';
import { randomBytes, randomUUID, createHash, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const app = Fastify({ logger: true, bodyLimit: 128 * 1024, trustProxy: true });
const databaseUrl = process.env.DATABASE_URL;
const pool = databaseUrl ? new Pool({ connectionString: databaseUrl, max: 5, connectionTimeoutMillis: 5000 }) : null;
const allowedOrigins = new Set((process.env.CORS_ORIGINS || 'https://sos360.up.railway.app,http://localhost:3000').split(',').map(x => x.trim()));
const makeHash = (token: string) => createHash('sha256').update(token).digest('hex');
const isRecord = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const text = (x: unknown, max: number): x is string => typeof x === 'string' && x.length <= max;
const validState = (x: unknown): boolean => {
  if (!isRecord(x) || !Array.isArray(x.kit) || !Array.isArray(x.contacts) || !isRecord(x.plan) || !isRecord(x.supplies)) return false;
  if (x.kit.length > 300 || x.contacts.length > 100) return false;
  if (!x.kit.every((i: unknown) => isRecord(i) && text(i.id, 100) && text(i.label, 120) && typeof i.checked === 'boolean')) return false;
  if (!x.contacts.every((c: unknown) => isRecord(c) && text(c.id, 100) && text(c.name, 100) && text(c.phone, 40) && text(c.role, 100))) return false;
  if (!['meetingPoint','outsideContact','notes'].every(k => text(x.plan[k], 2000))) return false;
  const s = x.supplies;
  if (!['people','days','waterLiters','meals'].every(k => typeof s[k] === 'number' && Number.isFinite(s[k]) && s[k] >= 0)) return false;
  if (s.people < 1 || s.people > 30 || s.days < 1 || s.days > 14 || s.waterLiters > 100000 || s.meals > 100000 || !isRecord(s.tasks)) return false;
  return Object.keys(s.tasks).length <= 50 && Object.values(s.tasks).every(x => typeof x === 'boolean');
};
const sql = [
  'CREATE TABLE IF NOT EXISTS sos_users (id UUID PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())',
  'CREATE TABLE IF NOT EXISTS sos_sessions (token_hash TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES sos_users(id) ON DELETE CASCADE, expires_at TIMESTAMPTZ NOT NULL)',
  'CREATE INDEX IF NOT EXISTS idx_sos_sessions_user_id ON sos_sessions(user_id)',
  'CREATE TABLE IF NOT EXISTS sos_state (user_id UUID PRIMARY KEY REFERENCES sos_users(id) ON DELETE CASCADE, payload JSONB NOT NULL, version INTEGER NOT NULL DEFAULT 1, updated_at TIMESTAMPTZ NOT NULL DEFAULT now())'
];
async function migrate() {
  if (!pool) return;
  const client = await pool.connect();
  try { await client.query('BEGIN'); for (const statement of sql) await client.query(statement); await client.query('COMMIT'); }
  catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
}
async function passwordHash(password: string) {
  const salt = randomBytes(16).toString('hex');
  const digest = (await scrypt(password, salt, 64)) as Buffer;
  return salt + ':' + digest.toString('hex');
}
async function verifyPassword(password: string, stored: string) {
  const [salt, hex] = stored.split(':');
  if (!salt || !hex || hex.length !== 128) return false;
  const calculated = (await scrypt(password, salt, 64)) as Buffer;
  return timingSafeEqual(calculated, Buffer.from(hex, 'hex'));
}
const attempts = new Map<string,{count:number;until:number}>();
function rateLimited(key:string) {
  const now = Date.now();
  if (attempts.size > 10000) attempts.clear();
  const old = attempts.get(key);
  const entry = old && old.until > now ? old : {count:0,until:now+15*60*1000};
  entry.count++;
  attempts.set(key,entry);
  return entry.count > 12;
}
async function issueSession(userId:string) {
  const token = randomBytes(32).toString('base64url');
  await pool!.query('INSERT INTO sos_sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval \'7 days\')',[makeHash(token),userId]);
  return token;
}
async function whoami(auth:unknown):Promise<string|null> {
  if (!pool || typeof auth !== 'string' || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  if (token.length < 32 || token.length > 200) return null;
  const r = await pool.query('SELECT user_id FROM sos_sessions WHERE token_hash=$1 AND expires_at > now()',[makeHash(token)]);
  return r.rows[0]?.user_id ?? null;
}
app.addHook('onRequest', async (req, reply) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    reply.header('Access-Control-Allow-Origin',origin);
    reply.header('Vary','Origin');
    reply.header('Access-Control-Allow-Headers','Content-Type,Authorization');
    reply.header('Access-Control-Allow-Methods','GET,POST,PUT,OPTIONS');
  }
  if (req.method === 'OPTIONS') { reply.code(204).send(); }
});
app.get('/health', async (_req, reply) => {
  if (!pool) return {status:'ok',service:'sos360-api',database:'not-configured'};
  try { await pool.query('SELECT 1'); return {status:'ok',service:'sos360-api',database:'online'}; }
  catch { return reply.code(503).send({status:'degraded',service:'sos360-api',database:'unavailable'}); }
});
app.get('/api/v1/modules', async () => ({modules:['family','kits','academy','advanced','supplies']}));
app.post('/api/v1/auth/register', async (req, reply) => {
  if (!pool) return reply.code(503).send({error:'database_unavailable'});
  const body = isRecord(req.body) ? req.body : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = body.password;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || typeof password !== 'string' || password.length < 12 || password.length > 128)
    return reply.code(400).send({error:'invalid_input',message:'Use e-mail válido e senha com 12 a 128 caracteres.'});
  if (rateLimited(req.ip+':'+email)) return reply.code(429).send({error:'rate_limited'});
  try {
    const userId = randomUUID();
    const hash = await passwordHash(password);
    await pool.query('INSERT INTO sos_users(id,email,password_hash) VALUES($1,$2,$3)',[userId,email,hash]);
    return reply.code(201).send({token:await issueSession(userId),email});
  } catch (e) {
    if (isRecord(e) && e.code === '23505') return reply.code(409).send({error:'account_exists'});
    req.log.error(e); return reply.code(500).send({error:'internal_error'});
  }
});
app.post('/api/v1/auth/login', async (req, reply) => {
  if (!pool) return reply.code(503).send({error:'database_unavailable'});
  const body = isRecord(req.body) ? req.body : {};
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = body.password;
  if (email.length > 254 || typeof password !== 'string' || password.length > 128) return reply.code(400).send({error:'invalid_input'});
  if (rateLimited(req.ip+':'+email)) return reply.code(429).send({error:'rate_limited'});
  const result = await pool.query('SELECT id,password_hash FROM sos_users WHERE email=$1',[email]);
  const user = result.rows[0];
  if (!user || !(await verifyPassword(password,user.password_hash))) return reply.code(401).send({error:'invalid_credentials'});
  return {token:await issueSession(user.id),email};
});
app.post('/api/v1/auth/logout', async (req) => {
  const auth = req.headers.authorization;
  if (typeof auth === 'string' && auth.startsWith('Bearer ') && pool) await pool.query('DELETE FROM sos_sessions WHERE token_hash=$1',[makeHash(auth.slice(7))]);
  return {ok:true};
});
app.get('/api/v1/me', async (req,reply) => {
  const id = await whoami(req.headers.authorization);
  if (!id) return reply.code(401).send({error:'unauthorized'});
  const r = await pool!.query('SELECT email FROM sos_users WHERE id=$1',[id]);
  return {email:r.rows[0]?.email};
});
app.get('/api/v1/state', async (req,reply) => {
  const id = await whoami(req.headers.authorization);
  if (!id) return reply.code(401).send({error:'unauthorized'});
  const r = await pool!.query('SELECT payload,version,updated_at FROM sos_state WHERE user_id=$1',[id]);
  return r.rowCount ? {data:r.rows[0].payload,version:r.rows[0].version,updatedAt:r.rows[0].updated_at} : {data:null,version:0};
});
app.put('/api/v1/state', async (req,reply) => {
  const id = await whoami(req.headers.authorization);
  if (!id) return reply.code(401).send({error:'unauthorized'});
  const b = isRecord(req.body) ? req.body : {};
  if (!Number.isSafeInteger(b.version) || (b.version as number) < 0 || !validState(b.data)) return reply.code(400).send({error:'invalid_state'});
  const version = b.version as number;
  const result = await pool!.query(
    'INSERT INTO sos_state(user_id,payload,version) SELECT $1,$2::jsonb,1 WHERE $3=0 ON CONFLICT(user_id) DO UPDATE SET payload=EXCLUDED.payload,version=sos_state.version+1,updated_at=now() WHERE sos_state.version=$3 RETURNING version',
    [id,JSON.stringify(b.data),version]
  );
  if (!result.rowCount) {
    const current = await pool!.query('SELECT version FROM sos_state WHERE user_id=$1',[id]);
    return reply.code(409).send({error:'version_conflict',version:current.rows[0]?.version ?? 0});
  }
  return {ok:true,version:result.rows[0].version};
});
app.setErrorHandler((error,req,reply)=>{req.log.error(error);reply.code(error.statusCode && error.statusCode<500?error.statusCode:500).send({error:'request_failed'});});
async function main() {
  if (pool) await migrate();
  const port = Number(process.env.PORT ?? 3001);
  await app.listen({port,host:'0.0.0.0'});
}
main().catch(e=>{app.log.error(e);process.exit(1)});
