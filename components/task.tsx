"use client"

import { type Doc } from "../convex/_generated/dataModel"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Archive, Ellipsis, CircleCheck, Plus } from 'lucide-react';
import { TaskStopwatch } from "../components/TaskStopwatch"
import { useMutation } from "convex/react"
import { api } from "../convex/_generated/api"
import { type Id } from "../convex/_generated/dataModel"

export const Task = ({ task } : { task: Doc<"tasks"> }) => {
  const { _id, title, startTime, completedTime } = task;
  const archiveMutation = useMutation(api.tasks.setArchive);
  const completedMutation = useMutation(api.tasks.setCompleted);

  const archive = (id: Id<"tasks">) => {
    archiveMutation({ id, archive: true })
  }
  const completed = (id: Id<"tasks">) => {
    completedMutation({ id, completed: true })
  }

  return (
    <div key={_id} className="w-full p-5 border-2 rounded-2xl m-3 flex justify-between items-start">
      <div>
        {title}
        <div>
          <TaskStopwatch startTime={startTime} completedTime={completedTime} />
        </div>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger><Ellipsis/></DropdownMenuTrigger>
          <DropdownMenuContent className="w-4">
            <DropdownMenuItem onClick={() => {archive(_id)}}><Archive/>Archive</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {completed(_id)}}><CircleCheck/>Completed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
