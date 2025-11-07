import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    startTime: v.optional(v.number()),
    tokenIdentifier: v.optional(v.string()),
    children: v.array(v.id("tasks")),
    archivedTime: v.optional(v.number()),
    completedTime: v.optional(v.number()),
    scheduledCompletionTime: v.optional(v.number()),
    creator: v.optional(v.id("users")),
    visibility: v.optional(v.union(
      v.literal("public"),
      v.literal("private"),
    )),
    priority: v.optional(v.string()),
  }).index("by_token", ["tokenIdentifier"]).index("by_author", ["creator"]),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});
