import z from "zod";
import { authProcedure } from "../trpc";

export const listTodos = authProcedure
  .output(
    z.object({
      success: z.boolean(),
      data: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
        })
      ),
    })
  )
  .query(async ({ ctx }) => {
    const todos = await ctx.db.todo.findMany({});

    return {
      success: true,
      data: todos,
    };
  });

export const createTodos = authProcedure
  .input(
    z.object({
      title: z.string().min(1).max(255),
      completed: z.boolean().optional().default(false),
    })
  )
  .output(
    z.object({
      success: z.boolean(),
      data: z.object({
        id: z.string(),
        title: z.string(),
      }),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const newTodo = await ctx.db.todo.create({
      data: {
        title: input.title,
      },
    });

    return {
      success: true,
      data: newTodo,
    };
  });
