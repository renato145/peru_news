import React, { useMemo } from "react";
import { useQueryCache } from "react-query";
import { StoreProps, useStore } from "../store";
import { SummaryData } from "../types";
import { Spinner } from "./Spinner";
import { WordCount } from "./WordCount";

const selector = (state: StoreProps) => state.data;
interface Props {
  topk: number;
}

export const Visualization: React.FC<Props> = ({ topk }) => {
  const data = useStore(selector);
  const cache = useQueryCache();

  const queryData = useMemo<SummaryData>(() => {
    const all = new Map<string, Map<string, number>>();
    data
      .map((date) => cache.getQueryData<SummaryData>(["data", { date }]))
      .forEach((dayData) => {
        if (dayData) {
          dayData.forEach(([name, wc]) => {
            const nameData = all.get(name) ?? new Map<string, number>();
            wc.forEach(([word, count]) => {
              nameData.set(word, (nameData.get(word) ?? 0) + count);
            });
            all.set(name, nameData);
          });
        }
      });
    return Array.from(all).map(([name, data]) => [
      name,
      Array.from(data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topk),
    ]);
  }, [cache, data, topk]);

  console.log(queryData);

  return (
    <div className="mt-2">
      {queryData.length === 0 ? (
        <div className="mt-10 flex justify-center">
          <Spinner className="h-14 w-14 text-gray-500" />
        </div>
      ) : (
        <>
          <p className="font-semibold">Loaded data: {data.length}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {queryData.map(([name, wc], i) => (
              <div key={i} className="px-4 py-2 bg-blue-50">
                <p className="capitalize text-lg font-semibold">
                  {name.replace("_", " ")}
                </p>
                <div className="my-2">
                  <WordCount data={wc} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
