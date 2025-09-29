'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateTask } from '@/hooks/use-tasks'
import { Task } from '@/types'

interface AddTaskInputProps {
    status: Task['status']
    onClose: () => void
}

export function AddTaskInput({ status, onClose }: AddTaskInputProps) {
    const [title, setTitle] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const createTask = useCreateTask()

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (title.trim()) {
            createTask.mutate(
                { title: title.trim(), status },
                {
                    onSuccess: () => {
                        setTitle('')
                        onClose()
                    },
                }
            )
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
                ref={inputRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nombre de la tarea..."
                className="flex-1"
                disabled={createTask.isPending}
            />
            <Button
                type="submit"
                size="icon"
                variant="ghost"
                disabled={!title.trim() || createTask.isPending}
                className="h-9 w-9"
            >
                <Check className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onClose}
                className="h-9 w-9"
            >
                <X className="h-4 w-4" />
            </Button>
        </form>
    )
}