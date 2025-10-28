import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const setCompleted = mutation({
  args: { id: v.id("tasks"), completed: v.boolean() },
  handler: async (ctx, args) => {
    const { id, completed } = args;

    if (completed) {
      await ctx.db.patch(id, { completedTime: Date.now() });
      return
    }
    await ctx.db.patch(id, { completedTime: undefined });
  }
});

export const setArchive = mutation({
  args: { id: v.id("tasks"), archive: v.boolean() },
  handler: async (ctx, args) => {
    const { id, archive } = args;

    if (archive) {
      await ctx.db.patch(id, { archivedTime: Date.now() });
      return
    }
    await ctx.db.patch(id, { archivedTime: undefined });
  }
});
