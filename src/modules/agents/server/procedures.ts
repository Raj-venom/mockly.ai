import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schema";
import { z } from "zod";
import { eq } from "drizzle-orm";


export const agentsRouter = createTRPCRouter({

    // This procedure retrieves all agents from the loged-in user's account.
    // It uses the protectedProcedure to ensure that only authenticated users can access it.
    getMany: protectedProcedure
        .query(async ({ ctx }) => {
            const data = await db
                .select()
                .from(agents)
                .where(eq(agents.userId, ctx.auth.user.id))

            return data;
        }),

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const { id } = input;

            const [existingAgent] = await db
                .select()
                .from(agents)
                .where(eq(agents.id, id));

            if (!existingAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Agent with id ${id} not found`,
                });
            }

            return existingAgent;
        }),

    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {

            const { instructions, name } = input;
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    name: name,
                    instructions: instructions,
                    userId: ctx.auth.user.id,
                })
                .returning();

            return createdAgent;
        })
});