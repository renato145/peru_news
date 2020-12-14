import create from "zustand";

export type StoreProps = {
  data: string[];
  selectedWord: string;
  add: (url: string) => void;
  remove: (url: string) => void;
  isActive: (url: string) => boolean;
  setSelectedWord: (word: string) => void;
};

export const useStore = create<StoreProps>((set, get) => ({
  data: [],
  selectedWord: "",
  add: (url) =>
    set((state) => {
      if (state.data.indexOf(url) > -1) {
        return {};
      } else {
        const data = state.data.concat(url);
        return { data };
      }
    }),
  remove: (url) =>
    set((state) => {
      const idx = state.data.indexOf(url);
      if (idx > -1) {
        const data = state.data.filter((o) => o !== url);
        return { data };
      } else {
        return {};
      }
    }),
  isActive: (url) => get().data.indexOf(url) > -1,
  setSelectedWord: (word) => set({ selectedWord: word }),
}));
