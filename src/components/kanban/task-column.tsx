'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SortableTaskCard } from './sortable-task-card'
import { AddTaskInput } from './add-task-input'
import { Task } from '@/types'
import { cn } from '@/lib/utils'

interface TaskColumnProps {
    id: Task['status']
    title: string
    tasks: Task[]
}

export function TaskColumn({ id, title, tasks }: TaskColumnProps) {
    const [isAdding, setIsAdding] = useState(false)

    const { setNodeRef, isOver } = useDroppable({
        id: id,
    })

    const taskIds = tasks.map(task => task.id)

    return (
        <Card
            className={cn(
                "h-full min-h-[600px] transition-colors",
                isOver && "ring-2 ring-primary ring-offset-2"
            )}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">
                        {title}
                        <span className="ml-2 text-sm text-muted-foreground">
              ({tasks.length})
            </span>
                    </CardTitle>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsAdding(true)}
                        className="h-8 w-8"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent ref={setNodeRef} className="space-y-2">
                {isAdding && (
                    <AddTaskInput
                        status={id}
                        onClose={() => setIsAdding(false)}
                    />
                )}

                <SortableContext
                    items={taskIds}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-2">
                        {tasks.map((task) => (
                            <SortableTaskCard key={task.id} task={task} />
                        ))}

                        {tasks.length === 0 && !isAdding && (
                            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 h-24 flex items-center justify-center">
                                <p className="text-sm text-muted-foreground">
                                    Arrastra tareas aquí
                                </p>
                            </div>
                        )}
                    </div>
                </SortableContext>
            </CardContent>
        </Card>
    )
}