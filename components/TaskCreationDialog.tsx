import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useMutation } from "convex/react"
import { useState } from "react"
import { api } from "../convex/_generated/api";

export function TaskCreationDialog() {
  const [taskName, setTaskName] = useState("Start using speedrun tree");
  const [completionHours, setCompletionHours] = useState(0);
  const [completionMinutes, setCompletionMinutes] = useState(0);

  const taskCreationMutation = useMutation(api.tasks.createTask);

  const taskCreation = () => {
    const now = Date.now(); // current time in ms
    const offsetMs = (completionHours * 60 + completionMinutes) * 60 * 1000;

    const completionTime = now + offsetMs;

    taskCreationMutation({ name: taskName, scheduledCompletionTime: completionTime, startTime: Date.now() })
  }
  return (
    <form>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Task</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="task-name" className="text-base">Task Name</Label>
            <Input id="task-name" name="name" onChange={(e) => setTaskName(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="completion-time" className="text-base">Completion Time Goal</Label>
            <div className="flex gap-2">
              <div className="grid gap-1">
                <Label htmlFor="completion-hours" className="text-sm font-normal">Hours</Label>
                <Input id="completion-hours" name="completion-hours" type="number" onChange={(e) => setCompletionHours(e.target.value)} value={completionHours} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="completion-minutes" className="text-sm font-normal">Minutes</Label>
                <Input id="completion-minutes" name="completion-minutes" type="number" onChange={(e) => setCompletionMinutes(e.target.value)} value={completionMinutes} />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" className="bg-foreground text-background" onClick={taskCreation}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </form>
  )
}

