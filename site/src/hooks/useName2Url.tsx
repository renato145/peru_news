import axios from "axios";
import { useQuery } from "react-query";

const URL =
  "https://raw.githubusercontent.com/renato145/peru_news/main/settings.json";

type FetchData = { sources: { name: string; url: string }[] };
type Name2Url = Map<string, string>;
type Props = () => Promise<Name2Url>;

const fetchData: Props = async () => {
  // await new Promise((r) => setTimeout(r, 2000));
  const { data, status } = await axios.get<FetchData>(URL, {});
  if (status !== 200) throw new Error(`status: ${status}`);
  const res: Name2Url = new Map();
  data.sources.forEach(({ name, url }) => res.set(name, url));
  return res;
};

export const useName2Url = () =>
  useQuery<Name2Url>("name2url", () => fetchData());
