import axios from "axios";
import { useQuery } from "react-query";
import { FetchData } from "../store";

type Props = (url: string) => Promise<FetchData>;

const fetchData: Props = async (url) => {
  console.log(`fetching summary data from ${url}`);
  // await new Promise((r) => setTimeout(r, 2000));
  const { data, status } = await axios.get<FetchData>(url);
  if (status !== 200) throw new Error(`status: ${status}`);
  return data;
};

export const useFetchData = (url: string) =>
  useQuery<FetchData>(["data", { url }], () => fetchData(url), {
    enabled: false,
    retry: false,
  });
