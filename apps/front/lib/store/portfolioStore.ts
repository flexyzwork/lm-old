import { create } from 'zustand';

interface PortfolioState {
  title: string;
  description: string;
  file: File | null;
  tags: string[];
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setFile: (file: File | null) => void;
  setTags: (tech: string[]) => void;
  reset: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  title: '',
  description: '',
  file: null,
  tags: [],
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  setFile: (file) => set({ file }),
  setTags: (tech) => set({ tags: tech }),
  reset: () => set({ title: '', description: '', file: null, tags: [] }),
}));
