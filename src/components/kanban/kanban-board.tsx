'use client'

import { useState } from 'react'
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { useTasks, useUpdateTask } from '@/hooks/use-tasks'
import { TaskColumn } from './task-column'
import { TaskCard } from './task-card'
import { Task } from '@/types'

const COLUMNS = [
    { id: 'PENDING', title: 'Pendiente' },
    { id: 'IN_PROGRESS', title: 'En curso' },
    { id: 'COMPLETED', title: 'Finalizado' },
] as const

export function KanbanBoard() {
    const { data: tasks = [], isLoading } = useTasks()
    const updateTask = useUpdateTask()
    const [activeTask, setActiveTask] = useState<Task | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    // Agrupar tareas por columna desde servidor
    const tasksByColumn = {
        PENDING: tasks.filter(t => t.status === 'PENDING'),
        IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
        COMPLETED: tasks.filter(t => t.status === 'COMPLETED'),
    }

    const handleDragStart = (event: DragStartEvent) => {
        const task = tasks.find(t => t.id === event.active.id)
        setActiveTask(task || null)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) {
            setActiveTask(null)
            return
        }

        const activeId = active.id as number
        const activeTask = tasks.find(t => t.id === activeId)

        if (!activeTask) {
            setActiveTask(null)
            return
        }

        // Determinar el nuevo estado basado en donde se soltó
        let newStatus: Task['status'] | null = null

        // Si se soltó en una columna directamente
        if (typeof over.id === 'string' && COLUMNS.some(c => c.id === over.id)) {
            newStatus = over.id as Task['status']
        }
        // Si se soltó sobre otra tarea, usar el estado de esa tarea
        else if (typeof over.id === 'number') {
            const overTask = tasks.find(t => t.id === over.id)
            if (overTask) {
                newStatus = overTask.status
            }
        }

        // Si cambió el estado, actualizar en el backend
        if (newStatus && activeTask.status !== newStatus) {
            console.log('Actualizando tarea:', activeId, 'de', activeTask.status, 'a', newStatus)
            updateTask.mutate({
                id: activeId,
                status: newStatus
            })
        }

        setActiveTask(null)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-muted-foreground">Cargando tareas...</div>
            </div>
        )
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COLUMNS.map((column) => (
                    <TaskColumn
                        key={column.id}
                        id={column.id}
                        title={column.title}
                        tasks={tasksByColumn[column.id]}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? (
                    <div className="opacity-80">
                        <TaskCard task={activeTask} isDragging />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}