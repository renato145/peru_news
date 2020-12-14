import axios from "axios";
import { useQuery } from "react-query";
import { SummaryData } from "../types";
import { defaultQueryConfig } from "../utils";

type FetchData = { [key: string]: { [word: string]: number } };

const formatData: (data: FetchData) => SummaryData = (data) =>
  Object.entries(data).map(([key, wc]) => [key, Object.entries(wc)]);

type Props = (_key: string, props: { url: string }) => Promise<SummaryData>;

const fetchData: Props = async (_key, { url }) => {
  console.log(`fetching summary data ${_key} ${url}`);
  // await new Promise((r) => setTimeout(r, 2000));
  const { data, status } = await axios.get<FetchData>(url);
  if (status !== 200) throw new Error(`status: ${status}`);
  return formatData(data);
};

export const useFetchData = (url: string) =>
  useQuery<SummaryData>(["data", { url }], fetchData, defaultQueryConfig);
