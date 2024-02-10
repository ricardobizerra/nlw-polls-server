import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function voteOnPoll(app: FastifyInstance) {
    app.post('/polls/:pollId/votes', async (request, reply) => {
        const voteOnPollParams = z.object({
            pollId: z.string().uuid(),
        });

        const { pollId } = voteOnPollParams.parse(request.params);

        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid(),
        });

        const { pollOptionId } = voteOnPollBody.parse(request.body);

        let { sessionId } = request.cookies;

        if (sessionId) {
            const userPreviousVotedOnPoll = await prisma.vote.findUnique({
                where: {
                    sessionId_pollId: {
                        sessionId,
                        pollId,
                    }
                }
            });

            if (userPreviousVotedOnPoll && userPreviousVotedOnPoll.pollOptionId !== pollOptionId) {
                await prisma.vote.delete({
                    where: {
                        id: userPreviousVotedOnPoll.id,
                    }
                });
            }
            else if (userPreviousVotedOnPoll) return reply.status(400).send({ message: 'You have already voted on this poll' });
        }

        else {
            sessionId = randomUUID();

            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 30,
                signed: true,
                httpOnly: true,
            });
        }

        await prisma.vote.create({
            data: {
                sessionId,
                pollId,
                pollOptionId,
            }
        })
        
        return reply.status(201).send();
    })
}