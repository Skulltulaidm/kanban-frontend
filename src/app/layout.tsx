import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Kanban Board",
    description: "Tablero Kanban estilo Jira",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
        <body className={inter.className}>
        <Providers>
            {children}
            <Toaster position="top-right" />
        </Providers>
        </body>
        </html>
    )
}