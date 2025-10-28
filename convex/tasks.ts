import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
export const get = query({
  args: {},
  handler: async (ctx) => {
    const tasks =  await ctx.db.query("tasks").filter(q => q.eq(q.field("archivedTime"),undefined)).collect();
    return tasks.sort((a, b) => (a.completedTime ? a.completedTime : 0) - (b.completedTime ? b.completedTime : 0));
  },
});

export const createTask = mutation({
  args: { name: v.string(), scheduledCompletionTime: v.number(), startTime: v.number() },
  handler: async (ctx, args) => {
    const { name, scheduledCompletionTime, startTime } = args;

    await ctx.db.insert("tasks", { title: name, startTime: startTime, children: [], scheduledCompletionTime: scheduledCompletionTime })
  }
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
