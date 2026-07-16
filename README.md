# TaskFlow Manager

TaskFlow Manager adalah aplikasi **offline-first Task & Project Management** yang mensimulasikan backend sungguhan menggunakan **Axios Mock Adapter**, lengkap dengan autentikasi, latency, validasi, serta manajemen state modern menggunakan **React Query**, **Zustand**, dan **LocalStorage**.

---

# Tech Stack

- React
- TypeScript
- Vite
- React Query (TanStack Query)
- Zustand
- Axios
- Axios Mock Adapter
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- LocalStorage

---

# Menjalankan Project

```bash
npm install
npm run dev
```

## Demo Account

| Username | Password |
|----------|----------|
| admin | password123 |

---

# Struktur Folder

```text
src/
├── api/
│   ├── mock/
│   │   └── authApi.ts          # Mock authentication endpoint
│   ├── axiosClient.ts          # Axios instance + interceptor
│   ├── authApi.ts              # Authentication API
│   ├── projectsApi.ts          # Project CRUD API
│   └── tasksApi.ts             # Task CRUD API
│
├── assets/
│
├── components/
│   ├── layout/
│   │   └── Header.tsx
│   │
│   ├── projects/
│   │   ├── ProjectForm.tsx
│   │   └── ProjectSidebar.tsx
│   │
│   ├── tasks/
│   │   ├── BulkActionsBar.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskList.tsx
│   │
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── sonner.tsx
│       └── textarea.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   └── useTasks.ts
│
├── lib/
│   ├── localDb.ts
│   ├── taskMeta.ts
│   └── utils.ts
│
├── pages/
│   ├── DashboardPage.tsx
│   └── LoginPage.tsx
│
├── routes/
│   └── PrivateRoute.tsx
│
├── store/
│   ├── activeProjectStore.ts
│   ├── authStore.ts
│   ├── filterStore.ts
│   └── selectionStore.ts
│
├── types/
│   ├── auth.ts
│   ├── projects.ts
│   └── tasks.ts
│
├── App.tsx
└── index.css
```

---

# Arsitektur

Aplikasi menggunakan **Layered Architecture** agar setiap bagian memiliki tanggung jawab yang jelas.

```
UI Components
      │
      ▼
Custom Hooks
      │
      ▼
API Service
      │
      ▼
Axios Client
      │
      ▼
Mock Backend
      │
      ▼
LocalStorage Database
```

## 1. Components

Folder:

```
src/components
```

Bertanggung jawab terhadap:

- UI
- Event handling
- Rendering data

Komponen tidak pernah berinteraksi langsung dengan Axios maupun LocalStorage.

---

## 2. Hooks

Folder:

```
src/hooks
```

Menggunakan React Query untuk:

- Query
- Mutation
- Optimistic Update
- Cache Management
- Error Handling

Contoh alur:

```
TaskList
    ↓
useTasks()
    ↓
tasksApi.ts
```

---

## 3. API Layer

Folder:

```
src/api
```

Semua request HTTP dipusatkan di sini.

Keuntungan:

- Mudah mengganti backend
- Tidak ada logic networking di komponen
- Mudah di-maintain

---

## 4. Mock Backend

Menggunakan **Axios Mock Adapter** untuk mensimulasikan REST API.

Fitur yang disimulasikan:

- Authentication
- Authorization
- CRUD Task
- CRUD Project
- HTTP Status Code
- Artificial Delay
- Error Response

Ketika backend asli tersedia, layer ini cukup diganti tanpa mengubah komponen.

---

## 5. Local Database

```
src/lib/localDb.ts
```

Berfungsi sebagai database sederhana berbasis LocalStorage.

Menyimpan:

- Projects
- Tasks

Sekaligus menangani:

- Seed data awal
- Migrasi data lama
- Update data

---

# State Management

Menggunakan **Zustand**.

## authStore

Menyimpan:

- Login session
- User
- Access token

Menggunakan persistence sehingga login tetap tersimpan setelah refresh.

---

## activeProjectStore

Menyimpan project yang sedang aktif.

State akan tetap tersimpan setelah browser direfresh.

---

## filterStore

Mengelola:

- Search keyword
- Status filter

---

## selectionStore

Digunakan untuk:

- Multi Select
- Select All
- Bulk Delete
- Bulk Complete

---

# Data Flow

```
User Action

      │

      ▼

Component

      │

      ▼

Custom Hook

      │

      ▼

API Service

      │

      ▼

Axios Client

      │

      ▼

Mock Backend

      │

      ▼

LocalStorage
```

---

# Fitur

## Authentication

- Login
- Logout
- Protected Route
- Session Persistence

---

## Project Management

- Create Project
- Update Project
- Delete Project
- Project Sidebar
- Active Project Switching
- Client Information
- Project Color

---

## Task Management

- Create Task
- Update Task
- Delete Task
- Mark Complete
- Description
- Priority
- Difficulty
- Due Date
- Project Assignment

---

## Filtering

- Search Task
- Filter by Status
- Filter by Active Project

---

## Bulk Actions

- Multi Select
- Select All
- Bulk Complete
- Bulk Delete

---

## Offline First

Seluruh data disimpan menggunakan LocalStorage sehingga aplikasi tetap berjalan tanpa backend.

---

## Optimistic Update

Seluruh operasi CRUD menggunakan React Query Optimistic Update sehingga perubahan langsung tampil pada UI sebelum response server diterima.

---

# Keunggulan Arsitektur

- Layered Architecture
- Separation of Concerns
- Offline First
- React Query Caching
- Zustand Global State
- Axios Mock Backend
- Reusable Components
- Strong TypeScript Typing
- Mudah diintegrasikan dengan Backend REST API

---

# Pengembangan Selanjutnya

Beberapa fitur yang dapat ditambahkan pada versi berikutnya:

- Dark Mode
- Drag & Drop Task
- Task Labels
- Task Attachment
- Activity History
- Reminder Notification
- Calendar View
- Kanban Board
- Team Collaboration
- Role & Permission
- Real Backend Integration
- Unit Testing
- Integration Testing
- CI/CD Pipeline

---

# Asumsi & Tantangan

Selama proses pengembangan dan deployment, ada beberapa asumsi dan tantangan yang dihadapi:

- **Tidak terbiasa menggunakan Vite**  
  Selama ini lebih sering menggunakan **Next.js**, sehingga perlu waktu untuk beradaptasi dengan struktur project, alur build, dan pola konfigurasi yang berbeda di Vite.

- **Keterbatasan waktu pengerjaan**  
  Hasil yang diinginkan sebenarnya masih bisa dikembangkan lebih lanjut, namun karena waktu yang tersedia terbatas, beberapa peningkatan belum sempat diselesaikan.  
  Masih ada beberapa bagian yang ingin dioptimalkan, baik dari sisi UI, alur interaksi, maupun penyempurnaan fitur.

- **Fokus pada fungsi inti terlebih dahulu**  
  Karena keterbatasan waktu, prioritas utama diberikan pada stabilitas fitur utama seperti autentikasi, manajemen task, manajemen project, dan sinkronisasi state.

- **Ruang pengembangan lanjutan masih terbuka**  
  Beberapa improvement seperti penyempurnaan desain, penambahan validasi lanjutan, dan peningkatan experience pengguna masih dapat dilakukan pada iterasi berikutnya.