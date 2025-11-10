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
import { Button } from "./ui/button"

import { Badge } from "./ui/badge";

export const Task = ({ task, me } : { task: Doc<"tasks">, me: Doc<"users"> | undefined }) => {
  const { _id, title, startTime, completedTime, priority, creator } = task;
  const archiveMutation = useMutation(api.tasks.setArchive);
  const completedMutation = useMutation(api.tasks.setCompleted);
  const startSpeedrunMutation = useMutation(api.tasks.startSpeedrun);

  const archive = (id: Id<"tasks">) => {
    archiveMutation({ id, archive: true })
  }
  const completed = (id: Id<"tasks">) => {
    completedMutation({ id, completed: true })
  }
  const temporarilyQuit = () => {
    startSpeedrunMutation({ id: _id, startTime: undefined })
  }
  const startSpeedrun = () => {
    startSpeedrunMutation({ id: _id, startTime: Date.now() })
  }

  return (
    <div key={_id} className="w-full p-5 border-2 rounded-2xl m-3 flex justify-between items-start">
      <div>
        <div className="flex gap-2 items-center">
          {title}
          {priority ? <Badge variant={priority === "low" ? "low" : priority === "medium" ? "medium" : "high"}>{priority.toUpperCase()}</Badge> : null}
        </div>
        <div>
          {startTime ? (
            <TaskStopwatch startTime={startTime} completedTime={completedTime} />
          ) : (
            me && creator === me._id ? (
              <Button className="border-2 bg-background text-foreground mt-2 hover:bg-background" onClick={startSpeedrun}>
                Start
              </Button>
            ) : (
              <p className="text-muted-foreground mt-2">Not started yet</p>
            )
          )}
        </div>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger><Ellipsis/></DropdownMenuTrigger>
          <DropdownMenuContent className="w-4">
            <DropdownMenuItem onClick={() => {archive(_id)}}><Archive/>Archive</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {completed(_id)}}><CircleCheck/>Completed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {temporarilyQuit()}}><CircleCheck/>Temporarily Quit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
