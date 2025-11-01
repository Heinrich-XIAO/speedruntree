"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { CircleCheck, Plus } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { TaskCreationDialog } from "@/components/TaskCreationDialog"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { type Id, type Doc } from "../convex/_generated/dataModel.js"
import { Task } from "../components/task"

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const archiveMutation = useMutation(api.tasks.setArchive);
  const completedMutation = useMutation(api.tasks.setCompleted);

  const archive = (id: Id<"tasks">) => {
    archiveMutation({ id, archive: true })
  }
  const completed = (id: Id<"tasks">) => {
    completedMutation({ id, completed: true })
  }

  return (
    <main className="p-24 pt-0">
      <TaskCreationDialog/>
      <div>
        {tasks?.map((task: Doc<"tasks">) => {
          return (
            <Task key={task._id} task={task}/>
          );
        })}
      </div>
    </main>
  );
}
