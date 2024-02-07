import fastify from 'fastify';
import { createPoll } from './routes/create-poll';

const app = fastify();

app.register(createPoll);

app.get('/health', () => {
    return 'ok!';
})

app.listen({ port: 3333 }).then(() => {
    console.log('🚀 HTTP Server is on!');
})