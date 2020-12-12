import axios from "axios";
import { SummaryData } from "../types";

const DATA_URL =
  "https://raw.githubusercontent.com/renato145/peru_news/main/data/summary/";

type FetchData = { [key: string]: { [word: string]: number } };

const formatData: (data: FetchData) => SummaryData = (data) =>
  Object.entries(data).map(([key, wc]) => [
    key,
    Object.entries(wc).sort((a, b) => b[1] - a[1]),
  ]);

type Props = (_key: string, props: { date: string }) => Promise<SummaryData>;

export const useFetchData: Props = async (_key, { date }) => {
  console.log(`fetching summary data ${_key} ${date}`);
  await new Promise((r) => setTimeout(r, 1000));
  const url = `${DATA_URL}${date}.json`;
  const { data, status } = await axios.get<FetchData>(url);
  if (status !== 200) throw new Error(`status: ${status}`);
  return formatData(data);
};
