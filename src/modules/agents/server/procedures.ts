import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { agentsInsertSchema } from "../schema";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";


export const agentsRouter = createTRPCRouter({

    getMany: protectedProcedure
        .input(
            z.object({
                page: z.number().min(1).default(DEFAULT_PAGE),
                pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
                search: z.string().nullish()
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search } = input;
            const data = await db
                .select({
                    ...getTableColumns(agents),
                    meetingCount: sql<number>`58`
                })
                .from(agents)
                .where(
                    and(

                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined,
                    )
                )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db
                .select({ count: count() })
                .from(agents)
                .where(
                    and(

                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined,
                    )
                )


            const totalPage = Math.ceil(total.count / pageSize);

            return {
                items: data,
                totalCount: total.count,
                totalPage: totalPage,
            }


        }),

    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const { id } = input;

            const [existingAgent] = await db
                .select({
                    ...getTableColumns(agents),
                    meetingCount: sql<number>`5`
                })
                .from(agents)
                .where(
                    and(
                        eq(agents.id, id),
                        eq(agents.userId, ctx.auth.user.id)

                    )
                );

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