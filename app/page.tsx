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

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<string[]>(["ongoing"]);

  const tasks = useQuery(api.tasks.get);

  const filteredTasks = tasks?.filter((task: Doc<"tasks">) => {
    // if neither or both are selected → show all
    if (filter.length === 0 || filter.length === 2) return true;

    // ongoing selected only
    if (filter.includes("ongoing")) return !task.completedTime;

    // completed selected only
    if (filter.includes("completed")) return !!task.completedTime;

    return true;
  });

  return (
    <main className="p-24 pt-0">
      <div className="m-3 flex justify-between items-center">
        <div className="flex items-start gap-3">
          <ToggleGroup
            variant="outline"
            type="multiple"
            value={filter}
            onValueChange={(val) => setFilter(val)}
          >
            <ToggleGroupItem value="ongoing" aria-label="Toggle ongoing">
              Ongoing
            </ToggleGroupItem>
            <ToggleGroupItem value="completed" aria-label="Toggle completed">
              Completed
            </ToggleGroupItem>
          </ToggleGroup>
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

