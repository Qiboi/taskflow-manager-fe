import { create } from 'zustand';
import type { TaskFilterStatus } from '../types/task';

interface FilterState {
  status: TaskFilterStatus;
  keyword: string;
  setStatus: (status: TaskFilterStatus) => void;
  setKeyword: (keyword: string) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  status: 'all',
  keyword: '',
  setStatus: (status) => set({ status }),
  setKeyword: (keyword) => set({ keyword }),
  reset: () => set({ status: 'all', keyword: '' }),
}));
