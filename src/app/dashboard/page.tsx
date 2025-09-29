'use client'

import { KanbanBoard } from '@/components/kanban/kanban-board'
import { useLogout } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
    const logout = useLogout()

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Tablero Kanban</h1>
                    <Button
                        variant="outline"
                        onClick={logout}
                    >
                        Cerrar sesión
                    </Button>
                </div>
            </header>
            <main className="container mx-auto p-4 md:p-8">
                <KanbanBoard />
            </main>
        </div>
    )
}