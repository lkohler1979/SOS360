import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const API_ROOT = (process.env.SOS360_API_URL || 'https://sos360-beta-api-production.up.railway.app').replace(/\/$/, '');
const COOKIE_NAME = 'sos360_session';
const SESSION_SECONDS = 7 * 24 * 60 * 60;
const routes = new Map([
  ['GET:me', true],
  ['GET:state', true],
  ['PUT:state', true],
  ['POST:auth/register', true],
  ['POST:auth/login', true],
  ['POST:auth/logout', true]
]);
type Params = { params: Promise<{ path: string[] }> };

function secureCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/cloud',
    maxAge: SESSION_SECONDS
  });
}

async function proxy(req: NextRequest, params: Params['params'], method: 'GET' | 'POST' | 'PUT') {
  const pathParts = (await params).path;
  const path = pathParts.join('/');
  if (!routes.has(method + ':' + path)) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (method !== 'GET') {
    const origin = req.headers.get('origin');
    const expectedOrigin = req.nextUrl.origin;
    // Reject cross-site writes and credential attempts. The origin can be absent
    // in server-only requests, so rely on same-site cookies as a second barrier.
    if (origin && origin !== expectedOrigin) {
      return NextResponse.json({ error: 'forbidden_origin' }, { status: 403 });
    }
    const fetchSite = req.headers.get('sec-fetch-site');
    if (fetchSite === 'cross-site') {
      return NextResponse.json({ error: 'forbidden_site' }, { status: 403 });
    }
  }

  let body: string | undefined;
  if (method !== 'GET') {
    body = await req.text();
    if (Buffer.byteLength(body, 'utf8') > 128 * 1024) {
      return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
    }
  }
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = 'Bearer ' + token;

  try {
    const upstream = await fetch(API_ROOT + '/api/v1/' + path, {
      method, headers, body, cache: 'no-store', signal: AbortSignal.timeout(12000)
    });
    const payload: unknown = await upstream.json().catch(() => ({ error: 'invalid_api_response' }));
    const isLogin = (path === 'auth/login' || path === 'auth/register') && upstream.ok;
    const isLogout = path === 'auth/logout' && upstream.ok;
    let tokenFromApi: string | null = null;
    if (isLogin && payload && typeof payload === 'object' && 'token' in payload && typeof payload.token === 'string') {
      tokenFromApi = payload.token;
    }
    const safePayload = payload && typeof payload === 'object'
      ? { ...payload as Record<string, unknown> }
      : { error: 'invalid_api_response' };
    delete safePayload.token;
    const response = NextResponse.json(safePayload, { status: upstream.status });
    response.headers.set('Cache-Control', 'no-store');
    if (tokenFromApi) secureCookie(response, tokenFromApi);
    if (isLogout) response.cookies.set(COOKIE_NAME, '', { path: '/api/cloud', httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 0 });
    return response;
  } catch {
    return NextResponse.json(
      { error: 'api_unavailable', message: 'Servidor de sincronização indisponível. Seus dados locais permanecem neste dispositivo.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
export async function GET(req: NextRequest, { params }: Params) { return proxy(req, params, 'GET'); }
export async function POST(req: NextRequest, { params }: Params) { return proxy(req, params, 'POST'); }
export async function PUT(req: NextRequest, { params }: Params) { return proxy(req, params, 'PUT'); }
