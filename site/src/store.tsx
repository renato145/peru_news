import create from "zustand";

type WC = { [word: string]: number };
export type FetchData = { [newsName: string]: WC };
export type Data = { [date: string]: FetchData };
export type SummaryData = [name: string, wc: [word: string, count: number][]][];
export type WordData = [date: string, count: number][];

const formatData = (
  data: Data,
  activeDates: string[],
  topk: number,
  filters: string[]
): SummaryData => {
  const res = new Map<string, Map<string, number>>();

  activeDates.forEach((date) => {
    const dayData = data[date];
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

const getWordData = (data: Data, word: string, dates: string[]) => {
  const wordData = new Map<string, WordData>();
  if (word !== "") {
    Object.entries(data)
      .filter(([date]) => dates.indexOf(date) > -1)
      .forEach(([date, dayData]) => {
        Object.entries(dayData).forEach(([name, wc]) => {
          if (!wordData.has(name)) wordData.set(name, []);
          wordData.get(name)?.push([date, wc[word] ?? 0]);
        });
      });
  }
  return wordData;
};

export type StoreProps = {
  data: Data;
  topk: number;
  activeDates: string[];
  activeData: SummaryData;
  selectedWord: string;
  filters: string[];
  wordData: Map<string, WordData> | null;
  add: (data: Data) => void;
  addActiveDate: (date: string) => void;
  rmActiveDate: (date: string) => void;
  isActiveDate: (date: string) => boolean;
  setSelectedWord: (word: string) => void;
  setTopK: (topk: number) => void;
  addFilter: (word: string) => void;
  rmFilter: (word: string) => void;
  getTimelineData: (name: string) => WordData | undefined;
};

export const useStore = create<StoreProps>((set, get) => ({
  data: {},
  topk: 0, // top words to show
  activeDates: [],
  activeData: [],
  selectedWord: "", // selected word to show timeline chart
  wordData: null, // data for the timeline chart
  filters: localStorage.getItem("filters")?.split(",") ?? [], // words to ignore
  add: (wc) => {
    set(({ data }) => ({ data: Object.assign(data, wc) }));
  },
  addActiveDate: (date) => {
    set(({ data, activeDates, topk, filters, selectedWord }) => {
      if (activeDates.indexOf(date) > -1) return {};
      else {
        const _activeDates = activeDates.concat(date);
        if (topk === 0) return { activeDates: _activeDates };
        const _activeData = formatData(data, _activeDates, topk, filters);
        const wordData = getWordData(data, selectedWord, _activeDates);
        return { activeDates: _activeDates, activeData: _activeData, wordData };
      }
    });
  },
  rmActiveDate: (date) => {
    set(({ data, activeDates, topk, filters, selectedWord }) => {
      if (activeDates.indexOf(date) > -1) {
        const _activeDates = activeDates.filter((o) => o !== date);
        if (topk === 0) return { activeDates: _activeDates };
        const _activeData = formatData(data, _activeDates, topk, filters);
        const wordData = getWordData(data, selectedWord, _activeDates);
        return { activeDates: _activeDates, activeData: _activeData, wordData };
      } else return {};
    });
  },
  isActiveDate: (date) => get().activeDates.indexOf(date) > -1,
  setSelectedWord: (word) => {
    set(({ data, activeDates }) => {
      const wordData = getWordData(data, word, activeDates);
      return { selectedWord: word, wordData };
    });
  },
  setTopK: (topk) => {
    set(() => ({ topk }));
  },
  addFilter: (word) => {
    set(({ data, activeDates, topk, filters }) => {
      if (filters.indexOf(word) > -1) return {};
      else {
        const _filters = filters.concat(word);
        localStorage.setItem("filters", _filters.join());
        const _activeData = formatData(data, activeDates, topk, _filters);
        return { activeData: _activeData, filters: _filters };
      }
    });
  },
  rmFilter: (word) => {
    set(({ data, activeDates, topk, filters }) => {
      if (filters.indexOf(word) > -1) {
        const _filters = filters.filter((o) => o !== word);
        localStorage.setItem("filters", _filters.join());
        const _activeData = formatData(data, activeDates, topk, _filters);
        return { activeData: _activeData, filters: _filters };
      } else return {};
    });
  },
  getTimelineData: (name) => get().wordData?.get(name),
}));
