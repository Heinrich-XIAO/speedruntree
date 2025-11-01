import { mutation } from "./_generated/server";

export const seed = mutation(async (ctx) => {
  console.log("🌱 Seeding tasks...");

  const rawTasks = [
    { title: "Project Alpha", start_time: 1730059200000, tokenIdentifier: "task_1", children: ["task_2", "task_3"] },
    { title: "Design Phase", start_time: 1730062800000, tokenIdentifier: "task_2", children: ["task_4"] },
    { title: "Implementation Phase", start_time: 1730066400000, tokenIdentifier: "task_3", children: ["task_5", "task_6"] },
    { title: "UI Mockups", start_time: 1730070000000, tokenIdentifier: "task_4", children: [] },
    { title: "Backend API", start_time: 1730073600000, tokenIdentifier: "task_5", children: ["task_7"] },
    { title: "Frontend App", start_time: 1730077200000, tokenIdentifier: "task_6", children: [] },
    { title: "Database Setup", start_time: 1730080800000, tokenIdentifier: "task_7", children: [] },
  ];

  const idMap = new Map<string, any>();
  for (const task of rawTasks) {
    const id = await ctx.db.insert("tasks", {
      title: task.title,
      startTime: task.start_time,
      tokenIdentifier: task.tokenIdentifier,
      children: [],
    });
    idMap.set(task.tokenIdentifier, id);
  }

  for (const task of rawTasks) {
    const taskId = idMap.get(task.tokenIdentifier);
    const childIds = task.children
      .map((childToken) => idMap.get(childToken))
      .filter(Boolean);
    await ctx.db.patch(taskId, { children: childIds });
  }

  console.log("✅ Seeding complete!");
});

