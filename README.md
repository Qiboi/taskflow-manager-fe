# TaskFlow Manager — Scaffold

Aplikasi To-Do List offline-first dengan simulasi backend sungguhan (latensi, auth, error).

## Menjalankan

```bash
npm install
npm run dev
```

Login demo: **admin / password123**

## Struktur Folder

```
src/
├─ api/
│  ├─ axiosClient.ts       # instance axios + interceptor auth (request & response)
│  ├─ authApi.ts           # service function login
│  ├─ tasksApi.ts          # service function CRUD tugas
│  ├─ projectsApi.ts       # service function CRUD project
│  └─ mock/
│     └─ mockAdapter.ts    # axios-mock-adapter: endpoint, latensi, simulasi error, cek token
├─ lib/
│  └─ localDb.ts           # "database" palsu di atas LocalStorage (tasks + projects, dgn migrasi data lama)
├─ store/
│  ├─ authStore.ts         # Zustand + persist: sesi user
│  ├─ filterStore.ts       # Zustand: filter status & keyword pencarian
│  ├─ selectionStore.ts    # Zustand: state multi-select untuk bulk actions
│  └─ activeProjectStore.ts # Zustand + persist: project yang sedang aktif (context switch)
├─ hooks/
│  ├─ useAuth.ts           # React Query mutation untuk login/logout
│  ├─ useTasks.ts          # React Query: query + mutation CRUD dengan optimistic update
│  └─ useProjects.ts       # React Query: query + mutation CRUD project dengan optimistic update
├─ routes/
│  └─ PrivateRoute.tsx     # guard untuk halaman yang butuh login
├─ components/
│  ├─ ui/ToastProvider.tsx      # notifikasi sukses/error global
│  ├─ layout/Header.tsx         # header dashboard (tombol tambah tugas & keluar)
│  ├─ tasks/
│  │  ├─ TaskForm.tsx           # form create/edit (modal, RHF + Zod), termasuk pilih project
│  │  ├─ TaskItem.tsx           # baris tugas: checkbox pilih, toggle selesai, edit/hapus
│  │  ├─ TaskList.tsx           # daftar + logika "select all" berbasis filter aktif
│  │  └─ BulkActionsBar.tsx     # toolbar aksi massal, muncul kondisional
│  ├─ projects/
│  │  ├─ ProjectForm.tsx        # form create/edit project (nama, client, warna)
│  │  └─ ProjectSidebar.tsx     # sidebar daftar project + switch context + jumlah tugas
│  └─ auth/                     # (kosong — form login ada langsung di pages/LoginPage.tsx)
├─ pages/
│  ├─ LoginPage.tsx        # form login (React Hook Form + Zod)
│  └─ DashboardPage.tsx    # orkestrasi: sidebar project + daftar tugas + filter + bulk actions
└─ types/
   ├─ auth.ts
   ├─ task.ts
   └─ project.ts
```

## Prinsip Arsitektur

- **Pemisahan logika UI vs data fetching**: komponen tidak pernah memanggil `apiClient`
  langsung — semua lewat hooks di `src/hooks`, yang memanggil service functions di `src/api`.
- **Mock Adapter = satu-satunya tempat yang tahu bahwa ini bukan server sungguhan.**
  Ganti ke API asli nanti tinggal hapus `setupMockAdapter()` di `App.tsx`.
- **`localDb.ts`** memisahkan "penyimpanan data" dari "logika endpoint", supaya
  mockAdapter fokus pada simulasi HTTP (status code, delay, auth), bukan manipulasi data.
- **Optimistic updates** di `useTasks.ts` mengikuti pola `onMutate` (update dulu) →
  `onError` (rollback ke snapshot sebelumnya) → `onSettled` (invalidate & refetch).

## Belum Diimplementasikan

Semua fitur di requirement (`Requirement_Fitur`) sudah diimplementasikan:
- ✅ Auth mock (login, persistence, private route)
- ✅ CRUD tugas dengan latensi simulasi & optimistic update
- ✅ Global search & filter status
- ✅ Multi-select & bulk actions (dengan select-all berbasis hasil filter aktif)

**v2 — Project/Client Grouping:**
- ✅ Data model `Project` (nama, client, warna) + `Task.projectId`
- ✅ Migrasi otomatis: data tugas v1 (tanpa `projectId`) ditambal jadi "Tanpa Project", tidak hilang
- ✅ Sidebar project dengan context switch, tersimpan & persist (refresh tetap di project yang sama)
- ✅ Filter tugas (status + keyword) sekarang juga terikat ke project aktif; kombinasi filter tetap konsisten
- ✅ Hapus project tidak menghapus tugas di dalamnya — tugas dilepas ke "Tanpa Project"
- ✅ **Bug fix**: urutan endpoint mock `/tasks/bulk` dan `/projects/:id` diperbaiki supaya tidak salah tertangkap oleh pattern regex `/tasks/:id` yang lebih umum (axios-mock-adapter mencocokkan handler sesuai urutan registrasi)

Yang bisa jadi pengembangan lanjutan (di luar scope requirement awal):
- Toggle untuk simulasi kegagalan acak (saat ini endpoint tidak random-fail secara default,
  tapi mekanismenya sudah ada di `mockAdapter.ts` lewat `shouldSimulateRandomFailure`)
- Pagination / infinite scroll jika data tugas sangat banyak
- Dark mode
