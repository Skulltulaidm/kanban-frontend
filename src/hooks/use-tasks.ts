import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import { Task } from '@/types'

export const useTasks = () => {
    return useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const response = await api.get<Task[]>('/tasks')
            return response.data
        },
        staleTime: 10000,
    })
}

export const useCreateTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: { title: string; status: Task['status'] }) => {
            const response = await api.post<Task>('/tasks', data)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            toast.success('Tarea creada')
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || 'Error al crear tarea')
        },
    })
}

export const useUpdateTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: Task['status'] }) => {
            console.log('Enviando actualización al servidor:', { id, status })
            const response = await api.put<Task>(`/tasks/${id}`, { status })
            return response.data
        },
        onMutate: async ({ id, status }) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] })

            // Obtener el snapshot de las tareas actuales
            const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

            queryClient.setQueryData<Task[]>(['tasks'], (old) => {
                if (!old) return []
                return old.map((task) =>
                    task.id === id ? { ...task, status } : task
                )
            })

            return { previousTasks }
        },
        onError: (err, variables, context) => {
            console.error('Error actualizando tarea:', err)
            // Revertir cambios si hay error
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks'], context.previousTasks)
            }
            toast.error('Error al actualizar tarea')
        },
        onSuccess: () => {
            console.log('Tarea actualizada exitosamente')
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
    })
}

export const useDeleteTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/tasks/${id}`)
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] })

            // Obtener snapshot
            const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])

            queryClient.setQueryData<Task[]>(['tasks'], (old) => {
                if (!old) return []
                return old.filter(task => task.id !== id)
            })

            return { previousTasks }
        },
        onError: (err, variables, context) => {
            // Revertir si hay error
            if (context?.previousTasks) {
                queryClient.setQueryData(['tasks'], context.previousTasks)
            }
            toast.error('Error al eliminar tarea')
        },
        onSuccess: () => {
            toast.success('Tarea eliminada')
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
    })
}