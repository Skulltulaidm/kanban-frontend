'use client'

import { Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDeleteTask } from '@/hooks/use-tasks'
import { Task } from '@/types'
import { cn } from '@/lib/utils'

interface TaskCardProps {
    task: Task
    isDragging?: boolean
}

export function TaskCard({ task, isDragging }: TaskCardProps) {
    const deleteTask = useDeleteTask()

    return (
        <div
            className={cn(
                "bg-card border rounded-lg p-3 cursor-grab hover:shadow-md transition-all",
                isDragging && "opacity-50 shadow-lg cursor-grabbing"
            )}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 flex-1">
                    <div className="mt-1 text-muted-foreground hover:text-foreground cursor-grab">
                        <GripVertical className="h-4 w-4" />
                    </div>
                    <p className="text-sm flex-1 select-none">{task.title}</p>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                        e.stopPropagation()
                        deleteTask.mutate(task.id)
                    }}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        </div>
    )
}