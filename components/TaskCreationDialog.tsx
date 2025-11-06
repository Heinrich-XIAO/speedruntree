import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMutation } from "convex/react"
import { useState } from "react"
import { api } from "../convex/_generated/api"
import { Checkbox } from "@/components/ui/checkbox"

export function TaskCreationDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (value: boolean) => void }) {
  const [taskName, setTaskName] = useState("Start using speedrun tree");
  const [completionHours, setCompletionHours] = useState(0);
  const [completionMinutes, setCompletionMinutes] = useState(0);
  const [startNow, setStartNow] = useState(true);
  const [visibility, setVisibility] = useState(true);

  const taskCreationMutation = useMutation(api.tasks.createTask);

  const taskCreation = () => {
    const now = Date.now();
    const offsetMs = (completionHours * 60 + completionMinutes) * 60 * 1000;
    const completionTime = now + offsetMs;

    taskCreationMutation({
      name: taskName,
      scheduledCompletionTime: completionTime,
      startTime: startNow ? Date.now() : undefined,
      visibility: visibility ? "public" : "private",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Task</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="task-name" className="text-base">
              Task Name
            </Label>
            <Input
              id="task-name"
              name="name"
              onChange={(e) => setTaskName(e.target.value)}
              value={taskName}
            />
          </div>

          <div className="flex gap-3 items-center">
            <Label htmlFor="start_now">Start Now?</Label>
            <Checkbox
              id="start_now"
              checked={startNow}
              onCheckedChange={checked => setStartNow(checked === true)}
            />
          </div>

          <div className="flex gap-3 items-center">
            <Label htmlFor="visibility">Public?</Label>
            <Checkbox
              id="visibility"
              checked={visibility}
              onCheckedChange={visibility => setVisibility(visibility === true)}
            />
          </div>

          <div className="grid gap-3">
            <Label
              htmlFor="completion-time"
              className={`text-base ${!startNow ? "text-muted-foreground" : ""}`}
            >
              Completion Time Goal
            </Label>
            <div className="flex gap-2">
              <div className="grid gap-1">
                <Label
                  htmlFor="completion-hours"
                  className={`text-sm font-normal ${!startNow ? "text-muted-foreground" : ""}`}
                >
                  Hours
                </Label>
                <Input
                  id="completion-hours"
                  type="number"
                  onChange={(e) => setCompletionHours(Number(e.target.value))}
                  value={completionHours}
                  disabled={!startNow}
                />
              </div>
              <div className="grid gap-1">
                <Label
                  htmlFor="completion-minutes"
                  className={`text-sm font-normal ${!startNow ? "text-muted-foreground" : ""}`}
                >
                  Minutes
                </Label>
                <Input
                  id="completion-minutes"
                  type="number"
                  onChange={(e) => setCompletionMinutes(Number(e.target.value))}
                  value={completionMinutes}
                  disabled={!startNow}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-foreground text-background"
            onClick={taskCreation}
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

