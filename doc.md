# Documentación Técnica - Kanban Board

## Descripción General

tablero Kanban con autenticación JWT, drag & drop de tareas, y persistencia en PostgreSQL. El sistema permite gestionar tareas en tres estados: Pendiente, En Curso, y Finalizado.

### Características Principales
- Autenticación y autorización con JWT
- Drag & Drop
- Persistencia
- Validación de datos

## Arquitectura del Sistema

```mermaid
flowchart TB
  subgraph Cliente["Cliente"]
        B["React Components"]
        A["Next.js App"]
        C["Zustand Store"]
        D["React Query"]
        E["dnd-kit"]
  end
  subgraph Servidor["Servidor"]
        F["Express Server"]
        G["JWT Middleware"]
        H["Controllers"]
        I["Prisma ORM"]
  end
  subgraph subGraph2["Base de Datos"]
        J[("PostgreSQL")]
  end
    A --> B
    B --> C & D & E
    F --> G & H
    H --> I
    A -- HTTP/REST --> F
    I -- SQL --> J
    style A fill:#61dafb
    style F fill:#68a063
    style J fill:#336791
```

## Stack Tecnológico

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Prisma
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT
- **Validación:** Zod
- **Seguridad:** bcrypt, cors

### Frontend
- **Framework:** Next.js
- **UI Library:** React
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Drag & Drop:** @dnd-kit
- **Forms:** React Hook Form
- **HTTP Client:** Axios

## Instalación y Configuración

### Prerrequisitos
- Node.js 
- PostgreSQL
- npm o pnpm

## Estructura del Proyecto

### Backend

```
backend/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   └── utils/
│       └── jwt.js
├── server.js
├── .env
└── package.json
```

### Frontend

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── login/
│   ├── signup/
│   └── dashboard/
├── components/
│   ├── ui/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   └── kanban/
│       ├── kanban-board.tsx
│       ├── task-column.tsx
│       ├── task-card.tsx
│       └── add-task-input.tsx
├── hooks/
│   ├── use-auth.ts
│   └── use-tasks.ts
├── lib/
│   ├── api.ts
│   └── auth.ts
├── store/
│   └── auth-store.ts
├── types/
│   └── index.ts
└── middleware.ts
```

## API Documentation

### Endpoints

#### Autenticación

```mermaid
sequenceDiagram
participant C as Cliente
participant S as Servidor
participant DB as Database

    C->>S: POST /auth/register
    S->>DB: Crear usuario
    DB-->>S: Usuario creado
    S-->>C: JWT Token + User
    
    C->>S: POST /auth/login
    S->>DB: Verificar credenciales
    DB-->>S: Usuario válido
    S-->>C: JWT Token + User
```

#### Endpoints Disponibles

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | \`/auth/register\` | Registrar usuario | No |
| POST | \`/auth/login\` | Iniciar sesión | No |
| GET | \`/tasks\` | Obtener tareas del usuario | Sí |
| POST | \`/tasks\` | Crear nueva tarea | Sí |
| PUT | \`/tasks/:id\` | Actualizar tarea | Sí |
| DELETE | \`/tasks/:id\` | Eliminar tarea | Sí |

### Request/Response Examples

#### POST /auth/register
```json
// Request
{
"email": "usuario@example.com",
"password": "123456"
}

// Response (201)
{
"token": "eyJhbGciOiJIUzI1NiIs...",
"user": {
"id": 1,
"email": "usuario@example.com"
}
}
```

#### GET /tasks
```json
// Headers
{
"Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}

// Response (200)
[
{
"id": 1,
"title": "Implementar login",
"status": "IN_PROGRESS",
"userId": 1
}
]
```

## Base de Datos

### Esquema

```mermaid
erDiagram
User ||--o{ Task : has

    User {
        int id PK
        string email UK
        string password
    }
    
    Task {
        int id PK
        string title
        TaskStatus status
        int userId FK
    }
```

### Migraciones

```sql
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
"id" SERIAL PRIMARY KEY,
"email" TEXT UNIQUE NOT NULL,
"password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
"id" SERIAL PRIMARY KEY,
"title" TEXT NOT NULL,
"status" "TaskStatus" DEFAULT 'PENDING',
"userId" INTEGER NOT NULL,
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Task_title_userId_key" ON "Task"("title", "userId");
```

## Autenticación y Seguridad

### Flujo de Autenticación

```mermaid
flowchart LR
A[Usuario] -->|Email/Password| B[Login]
B --> C{Validar}
C -->|Válido| D[Generar JWT]
C -->|Inválido| E[Error 401]
D --> F[Guardar en Cookie]
F --> G[Acceso a Dashboard]
G -->|Request| H[Middleware JWT]
H --> I{Token Válido?}
I -->|Sí| J[Procesar Request]
I -->|No| K[Redirect Login]
```

### Seguridad Implementada
- Passwords hasheados con bcrypt (10 rounds)
- JWT con expiración de 30 días
- Middleware de autenticación en todas las rutas protegidas
- Validación de ownership en operaciones CRUD
- CORS configurado
- Cookies httpOnly para tokens
- Sanitización de inputs

## Flujos de Trabajo

### Drag & Drop

```mermaid
stateDiagram-v2
[*] --> Idle
Idle --> Dragging: onDragStart
Dragging --> Hovering: onDragOver
Hovering --> Dropped: onDragEnd
Dropped --> Updating: Cambio de estado
Updating --> [*]: Actualización DB

    Dragging --> Cancelled: ESC/Cancel
    Cancelled --> [*]
```

### Ciclo de Vida de una Tarea

```mermaid
graph LR
A[Crear Tarea] --> B[PENDING]
B --> C[IN_PROGRESS]
C --> D[COMPLETED]
B --> E[Eliminar]
C --> E
D --> E
C --> B
D --> C
```

## Componentes Frontend

### Jerarquía de Componentes

```mermaid
graph TD
A[App] --> B[Layout]
B --> C[Dashboard]
C --> D[KanbanBoard]
D --> E[TaskColumn]
E --> F[TaskCard]
E --> G[AddTaskInput]

    D --> H[DndContext]
    H --> I[DragOverlay]
    
    style D fill:#f9f,stroke:#333,stroke-width:2px
    style H fill:#bbf,stroke:#333,stroke-width:2px
```

### Estado Global

```typescript
// Zustand Store Structure
interface AuthState {
user: User | null
token: string | null
setAuth: (user: User, token: string) => void
logout: () => void
}

// React Query Keys
queryKeys = {
tasks: ['tasks'],
user: ['user']
}
```

## Deployment

### Variables de Entorno

#### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/kanban"
JWT_SECRET="secret-key"
PORT=3001
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```