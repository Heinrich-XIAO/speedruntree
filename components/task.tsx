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

export const Task = ({ task } : { task: Doc<"tasks"> }) => {
  const { _id, title, startTime, completedTime } = task;
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
