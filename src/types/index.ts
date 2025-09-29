export interface User {
    id: number
    email: string
}

export interface Task {
    id: number
    title: string
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
    userId: number
}

export interface AuthResponse {
    token: string
    user: User
}