import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSignedUrls, BUCKET_NAME } from "@/lib/supabase/storage";

export const todosRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, ctx.user.id))
      .orderBy(desc(todos.createdAt));

    const imagePaths = userTodos
      .map((t) => t.imagePath)
      .filter((p): p is string => p !== null);

    const signedUrls = await getSignedUrls(ctx.supabase, imagePaths);

    return userTodos.map((todo) => ({
      ...todo,
      imageUrl: todo.imagePath ? signedUrls.get(todo.imagePath) ?? null : null,
    }));
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required").trim(),
        imagePath: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.imagePath && !input.imagePath.startsWith(ctx.user.id + "/")) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Invalid image" });
      }

      const [newTodo] = await db
        .insert(todos)
        .values({
          title: input.title,
          imagePath: input.imagePath ?? null,
          userId: ctx.user.id,
        })
        .returning();

      return newTodo;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1, "Title is required").trim(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db
        .update(todos)
        .set({ title: input.title, updatedAt: new Date() })
        .where(and(eq(todos.id, input.id), eq(todos.userId, ctx.user.id)))
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
      }

      return updated;
    }),

  toggle: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [current] = await db
        .select()
        .from(todos)
        .where(and(eq(todos.id, input.id), eq(todos.userId, ctx.user.id)));

      if (!current) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
      }

      const [updated] = await db
        .update(todos)
        .set({ completed: !current.completed, updatedAt: new Date() })
        .where(and(eq(todos.id, input.id), eq(todos.userId, ctx.user.id)))
        .returning();

      return updated;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await db
        .delete(todos)
        .where(and(eq(todos.id, input.id), eq(todos.userId, ctx.user.id)))
        .returning();

      if (!deleted) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Todo not found" });
      }

      if (deleted.imagePath) {
        await ctx.supabase.storage
          .from(BUCKET_NAME)
          .remove([deleted.imagePath]);
      }

      return { success: true };
    }),
});
