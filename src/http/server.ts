import fastify from 'fastify';

const app = fastify();

app.get('/health', () => {
    return 'ok!';
})

app.listen({ port: 3333 }).then(() => {
    console.log('🚀 HTTP Server is on!');
})