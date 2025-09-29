import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import api from '@/lib/api'
import { setToken, removeToken } from '@/lib/auth'
import { useAuthStore } from '@/store/auth-store'
import { AuthResponse } from '@/types'

export const useLogin = () => {
    const router = useRouter()
    const setAuth = useAuthStore((state) => state.setAuth)

    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const response = await api.post<AuthResponse>('/auth/login', data)
            return response.data
        },
        onSuccess: (data) => {
            setToken(data.token)
            setAuth(data.user, data.token)
            toast.success('Inicio de sesión exitoso')
            router.push('/dashboard')
            router.refresh()
        },
        onError: () => {
            toast.error('Credenciales inválidas')
        },
    })
}

export const useRegister = () => {
    const router = useRouter()
    const setAuth = useAuthStore((state) => state.setAuth)

    return useMutation({
        mutationFn: async (data: { email: string; password: string }) => {
            const response = await api.post<AuthResponse>('/auth/register', data)
            return response.data
        },
        onSuccess: (data) => {
            setToken(data.token)
            setAuth(data.user, data.token)
            toast.success('Registro exitoso')
            router.push('/dashboard')
            router.refresh()
        },
        onError: () => {
            toast.error('Error al registrar usuario')
        },
    })
}

export const useLogout = () => {
    const router = useRouter()
    const logout = useAuthStore((state) => state.logout)

    return () => {
        removeToken()
        logout()
        router.push('/login')
        router.refresh()
    }
}