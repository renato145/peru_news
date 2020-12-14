import axios from "axios";
import { useQuery } from "react-query";
import { FetchData } from "../store";
import { defaultQueryConfig } from "../utils";

type Props = (_key: string, props: { url: string }) => Promise<FetchData>;

const fetchData: Props = async (_key, { url }) => {
  console.log(`fetching summary data ${_key} ${url}`);
  // await new Promise((r) => setTimeout(r, 2000));
  const { data, status } = await axios.get<FetchData>(url);
  if (status !== 200) throw new Error(`status: ${status}`);
  return data;
};

export const useFetchData = (url: string) =>
  useQuery<FetchData>(["data", { url }], fetchData, defaultQueryConfig);
