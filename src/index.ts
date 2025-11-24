import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { aiRoutes } from './routes/ai';

dotenv.config({ path: '.env.local' });

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: true,
    });

    await fastify.register(aiRoutes, { prefix: '/api' });

    fastify.get('/health', async () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    });

    const port = parseInt(process.env.PORT || '3000', 10);
    await fastify.listen({ port, host: '0.0.0.0' });

    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
