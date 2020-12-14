import create from "zustand";

type WC = { [word: string]: number };
export type FetchData = { [newsName: string]: WC };
export type Data = { [url: string]: FetchData };
export type SummaryData = [string, [string, number][]][];

const formatData = (
  data: Data,
  activeUrls: string[],
  topk: number,
  filters: string[]
): SummaryData => {
  const res = new Map<string, Map<string, number>>();

  activeUrls.forEach((url) => {
    const dayData = data[url];
    if (dayData !== undefined) {
      Object.entries(dayData).forEach(([name, wc]) => {
        const nameData = res.get(name) ?? new Map<string, number>();
        Object.entries(wc).forEach(([word, count]) => {
          if (filters.indexOf(word) === -1)
            nameData.set(word, (nameData.get(word) ?? 0) + count);
        });
        res.set(name, nameData);
      });
    }
  });

  return Array.from(res).map(([name, data]) => [
    name,
    Array.from(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topk),
  ]);
};

export type StoreProps = {
  data: Data;
  topk: number;
  activeUrls: string[];
  activeData: SummaryData;
  selectedWord: string;
  filters: string[];
  add: (data: Data) => void;
  addActiveUrl: (url: string) => void;
  rmActiveUrl: (url: string) => void;
  isActive: (url: string) => boolean;
  setSelectedWord: (word: string) => void;
  setTopK: (topk: number) => void;
  addFilter: (word: string) => void;
  rmFilter: (word: string) => void;
};

export const useStore = create<StoreProps>((set, get) => ({
  data: {},
  topk: 0,
  activeUrls: [],
  activeData: [],
  selectedWord: "",
  filters: localStorage.getItem('filters')?.split(',') ?? [],
  add: (wc) => {
    set(({ data }) => ({ data: Object.assign(data, wc) }));
  },
  addActiveUrl: (url) => {
    set(({ data, activeUrls, topk, filters }) => {
      if (activeUrls.indexOf(url) > -1) return {};
      else {
        const _activeUrls = activeUrls.concat(url);
        if (topk === 0) return { activeUrls: _activeUrls };
        const _activeData = formatData(data, _activeUrls, topk, filters);
        return { activeUrls: _activeUrls, activeData: _activeData };
      }
    });
  },
  rmActiveUrl: (url) => {
    set(({ data, activeUrls, topk, filters }) => {
      if (activeUrls.indexOf(url) > -1) {
        const _activeUrls = activeUrls.filter((o) => o !== url);
        if (topk === 0) return { activeUrls: _activeUrls };
        const _activeData = formatData(data, _activeUrls, topk, filters);
        return { activeUrls: _activeUrls, activeData: _activeData };
      } else return {};
    });
  },
  isActive: (url) => get().activeUrls.indexOf(url) > -1,
  setSelectedWord: (word) => set({ selectedWord: word }),
  setTopK: (topk) => {
    set(() => ({ topk }));
  },
  addFilter: (word) => {
    set(({ data, activeUrls, topk, filters }) => {
      if (filters.indexOf(word) > -1) return {};
      else {
        const _filters = filters.concat(word);
        localStorage.setItem('filters', _filters.join());
        const _activeData = formatData(data, activeUrls, topk, _filters);
        return { activeData: _activeData, filters: _filters };
      }
    });
  },
  rmFilter: (word) => {
    set(( {data, activeUrls, topk, filters} ) => {
      if (filters.indexOf(word) > -1) {
        const _filters = filters.filter((o) => o !== word);
        localStorage.setItem('filters', _filters.join());
        const _activeData = formatData(data, activeUrls, topk, _filters);
        return { activeData: _activeData, filters: _filters };
      }else return {};
    });
  },
}));
