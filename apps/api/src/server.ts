import Fastify from 'fastify';
const app = Fastify({ logger: true });
app.get('/health', async () => ({ status: 'ok', service: 'sos360-api' }));
app.get('/api/v1/modules', async () => ({ modules: ['family','kits','academy','advanced'] }));
const port = Number(process.env.PORT ?? 3001);
app.listen({ port, host: '0.0.0.0' }).catch((error) => { app.log.error(error); process.exit(1); });
