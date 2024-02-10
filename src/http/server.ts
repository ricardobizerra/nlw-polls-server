import fastify from 'fastify';
import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';
import { voteOnPoll } from './routes/vote-on-poll';
import fastifyCookie from '@fastify/cookie';

const app = fastify();

app.register(fastifyCookie, {
    secret: process.env.FASTIFY_COOKIE_SECRET,
    hook: 'onRequest',
});

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);

app.get('/health', () => {
    return 'ok!';
})

app.listen({ port: 3333 }).then(() => {
    console.log('🚀 HTTP Server is on!');
})