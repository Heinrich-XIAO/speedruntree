import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identityToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    const identity = identityToken
      ? (await ctx.db
          .query("users")
          .withIndex("by_token", (q) => q.eq("tokenIdentifier", identityToken))
          .unique()
        )?._id || ""
      : "";

    const tasks = await ctx.db
      .query("tasks")
      .filter((q) =>
        q.or(
          q.eq(q.field("creator"), identity),
          q.eq(q.field("visibility"), "public"),
          q.eq(q.field("visibility"), undefined),
        )
      )
      .collect();
    return tasks.sort((a, b) => (b._creationTime - a._creationTime)).sort((a, b) => (a.completedTime ? a.completedTime : 0) - (b.completedTime ? b.completedTime : 0));
  },
});

export const startSpeedrun = mutation({
  args: { id: v.id("tasks"), startTime: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const { id, startTime } = args;

    await ctx.db.patch(id, { startTime: startTime })
  }
})

export const createTask = mutation({
  args: { name: v.string(), scheduledCompletionTime: v.number(), startTime: v.optional(v.number()), visibility: v.union(v.literal("public"), v.literal("private")), priority: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { name, scheduledCompletionTime, startTime, visibility, priority } = args;
    const identityToken = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!identityToken) {
      return
    }

    const identity = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identityToken))
      .unique();
    if (!identity) {
      return
    }
    await ctx.db.insert("tasks", {
      title: name,
      startTime,
      children: [],
      scheduledCompletionTime,
      creator: identity._id,
      visibility: visibility,
      priority,
    });
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
