import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** `null` berarti "All Projects" (lihat tugas lintas semua project). */
interface ActiveProjectState {
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
}

export const useActiveProjectStore = create<ActiveProjectState>()(
  persist(
    (set) => ({
      activeProjectId: null,
      setActiveProjectId: (id) => set({ activeProjectId: id }),
    }),
    {
      name: 'taskflow_active_project',
    }
  )
);
