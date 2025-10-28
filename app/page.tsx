"use client";

import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { TaskStopwatch } from "../components/TaskStopwatch.tsx"
import { Archive, Ellipsis, CircleCheck, Plus } from 'lucide-react';
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
import { TaskCreationDialog } from "@/components/TaskCreationDialog.tsx"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const archiveMutation = useMutation(api.tasks.setArchive);
  const completedMutation = useMutation(api.tasks.setCompleted);

  const archive = (id: string) => {
    archiveMutation({ id, archive: true })
  }
  const completed = (id: string) => {
    completedMutation({ id, completed: true })
  }

  return (
    <main className="p-24 pt-0">
      <Dialog>
        <TaskCreationDialog/>
        <DialogTrigger asChild>
          <div className="m-3 flex items-end flex-col">
            <Plus size={48} className="border-2 rounded-2xl p-1" />
          </div>
        </DialogTrigger>
      </Dialog>
      <div>
        {tasks?.map(({ _id, title, startTime, completedTime }) => {
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
        })}
      </div>
    </main>
  );
}
