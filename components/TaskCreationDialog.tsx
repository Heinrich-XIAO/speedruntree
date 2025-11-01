import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { api } from "../convex/_generated/api"
import { Checkbox } from "@/components/ui/checkbox"

export function TaskCreationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState("Start using speedrun tree");
  const [completionHours, setCompletionHours] = useState(0);
  const [completionMinutes, setCompletionMinutes] = useState(0);
  const [startNow, setStartNow] = useState(true);

  const taskCreationMutation = useMutation(api.tasks.createTask);

  const taskCreation = () => {
    const now = Date.now();
    const offsetMs = (completionHours * 60 + completionMinutes) * 60 * 1000;

    const completionTime = now + offsetMs;

    taskCreationMutation({ 
      name: taskName, 
      scheduledCompletionTime: completionTime, 
      startTime: startNow ? Date.now() : undefined
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="m-3 flex items-end flex-col">
        <DialogTrigger asChild>
          <Plus size={48} className="border-2 rounded-2xl p-1" />
        </DialogTrigger>
      </div>
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
            <div className="flex gap-3 items-center">
              <Label htmlFor="start_now">Start Now?</Label>
              <Checkbox 
                id="start_now" 
                checked={startNow} 
                onCheckedChange={setStartNow} 
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="completion-time" className={`text-base ${!startNow ? "text-muted-foreground" : ""}`}>Completion Time Goal</Label>
              <div className="flex gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="completion-hours" className={`text-sm font-normal ${!startNow ? "text-muted-foreground" : ""}`}>Hours</Label>
                  <Input 
                    id="completion-hours" 
                    name="completion-hours" 
                    type="number" 
                    onChange={(e) => setCompletionHours(Number(e.target.value))} 
                    value={completionHours} 
                    disabled={!startNow} 
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="completion-minutes" className={`text-sm font-normal ${!startNow ? "text-muted-foreground" : ""}`}>Minutes</Label>
                  <Input 
                    id="completion-minutes" 
                    name="completion-minutes" 
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
            <Button type="submit" className="bg-foreground text-background" onClick={taskCreation}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
