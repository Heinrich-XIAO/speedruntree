import { mutation } from "./_generated/server";

export const seed = mutation(async (ctx) => {
  console.log("🌱 Seeding tasks...");

  // Your original JSONL data, converted into a JS array
  const rawTasks = [
    { title: "Project Alpha", startTime: 1730059200000, tokenIdentifier: "task_1", children: ["task_2", "task_3"] },
    { title: "Design Phase", startTime: 1730062800000, tokenIdentifier: "task_2", children: ["task_4"] },
    { title: "Implementation Phase", startTime: 1730066400000, tokenIdentifier: "task_3", children: ["task_5", "task_6"] },
    { title: "UI Mockups", startTime: 1730070000000, tokenIdentifier: "task_4", children: [] },
    { title: "Backend API", startTime: 1730073600000, tokenIdentifier: "task_5", children: ["task_7"] },
    { title: "Frontend App", startTime: 1730077200000, tokenIdentifier: "task_6", children: [] },
    { title: "Database Setup", startTime: 1730080800000, tokenIdentifier: "task_7", children: [] },
  ];

  // Step 1: insert all tasks without children first
  const idMap = new Map<string, any>();
  for (const task of rawTasks) {
    const id = await ctx.db.insert("tasks", {
      title: task.title,
      startTime: task.startTime,
      tokenIdentifier: task.tokenIdentifier,
      children: [], // empty for now
    });
    idMap.set(task.tokenIdentifier, id);
  }

  // Step 2: patch each with correct child Convex IDs
  for (const task of rawTasks) {
    const taskId = idMap.get(task.tokenIdentifier);
    const childIds = task.children
      .map((childToken) => idMap.get(childToken))
      .filter(Boolean);
    await ctx.db.patch(taskId, { children: childIds });
  }

  console.log("✅ Seeding complete!");
});

