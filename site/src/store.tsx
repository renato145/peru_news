import create from "zustand";

export type StoreProps = {
  data: string[];
  selectedWord: string;
  add: (date: string) => void;
  remove: (date: string) => void;
  isActive: (date: string) => boolean;
  setSelectedWord: (word: string) => void;
};

export const useStore = create<StoreProps>((set, get) => ({
  data: [],
  selectedWord: "",
  add: (date) =>
    set((state) => {
      if (state.data.indexOf(date) > -1) {
        return {};
      } else {
        const data = state.data.concat(date);
        return { data };
      }
    }),
  remove: (date) =>
    set((state) => {
      const idx = state.data.indexOf(date);
      if (idx > -1) {
        const data = state.data.filter((o) => o !== date);
        return { data };
      } else {
        return {};
      }
    }),
  isActive: (date) => get().data.indexOf(date) > -1,
  setSelectedWord: (word) => set({ selectedWord: word }),
}));
