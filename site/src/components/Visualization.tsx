import React, { useEffect } from "react";
import { useName2Url } from "../hooks/useName2Url";
import { StoreProps, useStore } from "../store";
import { Filter } from "./Filter";
import { Newspaper } from "./Newspaper";
import { Spinner } from "./Spinner";

const selector = ({
  activeData,
  activeUrls,
  setTopK,
  filters,
}: StoreProps) => ({
  activeData,
  activeUrls,
  setTopK,
  filters,
});
interface Props {
  topk: number;
}

export const Visualization: React.FC<Props> = ({ topk }) => {
  const { activeData, activeUrls, setTopK, filters } = useStore(selector);
  const { data: name2url } = useName2Url();

  useEffect(() => {
    setTopK(topk);
  }, [setTopK, topk]);

  return (
    <div className="mt-2">
      {activeData.length === 0 ? (
        <div className="mt-10 flex justify-center">
          <Spinner className="h-14 w-14" />
        </div>
      ) : (
        <>
          <p className="font-semibold">Loaded data: {activeUrls.length}</p>
          <div className="flex flex-wrap -ml-1">
            {filters.map((word, i) => (
              <Filter key={i} className="ml-1 mt-0.5" word={word} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {activeData
              .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
              .map(([name, wc], i) => (
                <Newspaper
                  key={i}
                  className="px-4 py-2 bg-blue-50"
                  name2url={name2url}
                  name={name}
                  wc={wc}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};
