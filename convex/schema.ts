import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    startTime: v.number(),
    tokenIdentifier: v.optional(v.string()),
    children: v.array(v.id("tasks")),
    archivedTime: v.optional(v.number()),
    completedTime: v.optional(v.number()),
    scheduledCompletionTime: v.optional(v.number()),
  }).index("by_token", ["tokenIdentifier"]),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});
