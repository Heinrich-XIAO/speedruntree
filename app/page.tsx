"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCreationDialog } from "@/components/TaskCreationDialog";
import { Task } from "../components/task";
import { type Doc } from "../convex/_generated/dataModel";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input"

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string>("is:ongoing");

  const tasks = useQuery(api.tasks.get);

  const filteredTasks = tasks?.filter((task: Doc<"tasks">) => {
    console.log(filter)
    const parts = filter.trim().split(/\s+/);

    const statusParts = parts.filter((p) => p.startsWith("is:"));
    const textParts = parts.filter((p) => !p.startsWith("is:"));
    const searchText = textParts.join(" ").toLowerCase();

    for (const statusPart of statusParts) {
      const status = statusPart.split(":")[1];
      if (status === "ongoing" && task.completedTime) return false;
      if (status === "completed" && !task.completedTime) return false;
    }

    if (searchText) {
      const inTitle = task.title?.toLowerCase().includes(searchText);
      if (!inTitle) return false;
    }

    return true;
  }) || [];

  return (
    <main className="p-24 pt-0">
      <div className="m-3 flex justify-between items-center gap-3">
        <div className="flex items-start gap-3 w-full">
          <Input type="text" placeholder="is:ongoing" value={filter} onChange={e => setFilter(e.target.value)} />
        </div>

        <Plus
          onClick={() => setIsDialogOpen(true)}
          size={48}
          className="border-2 rounded-2xl p-1 cursor-pointer"
        />
      </div>

      <TaskCreationDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="mt-6">
        {tasks === undefined ? (
          null
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task: Doc<"tasks">) => (
            <Task key={task._id} task={task} />
          ))
        ) : (
          <p className="text-center text-muted-foreground mt-12">
            No tasks found.
          </p>
        )}
      </div>
    </main>
  );
}

