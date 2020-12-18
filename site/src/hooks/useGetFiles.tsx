import axios from "axios";
import { useQuery } from "react-query";
import { defaultQueryConfig } from "../utils";

const URL =
  "https://api.github.com/repos/renato145/peru_news/contents/data/summary?ref=main";

type FetchData = { download_url: string; name: string }[];
type Props = () => Promise<FetchData>;

const fetchData: Props = async () => {
  // await new Promise((r) => setTimeout(r, 2000));
  const { data, status } = await axios.get<FetchData>(URL, {});
  if (status !== 200) throw new Error(`status: ${status}`);
  return data
    .map(({ download_url, name }) => ({
      download_url,
      name: name.split(".json")[0],
    }))
    .sort((a, b) => b.name.localeCompare(a.name));
};

export const useGetFiles = () =>
  useQuery<FetchData>("files", () => fetchData(), {
    ...defaultQueryConfig,
    enabled: true,
    retry: true,
  });
