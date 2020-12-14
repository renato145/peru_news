import React from "react";
import { QueryStatus } from "react-query";
import { useGetFiles } from "../hooks/useGetFiles";
import { DayLoader } from "./DayLoader";
import { Spinner } from "./Spinner";

interface Props {
  n: number;
  loadN: number;
}

export const DataLoader: React.FC<Props> = ({ n, loadN }) => {
  const { data, error, status } = useGetFiles();

  return (
    <div className="-mt-2 -ml-2 flex flex-wrap">
      {status === QueryStatus.Error ? (
        <p>
          Couldn't load files: <span>{String(error)}</span>
        </p>
      ) : status === QueryStatus.Success && data ? (
        data.map(({download_url, name}, i) => (
          <DayLoader key={i} className="mt-2 ml-2" date={name} url={download_url} load={i < loadN} />
        ))
      ) : (
        <div className="w-full flex justify-center">
          <Spinner className="h-10 w-10" />
        </div>
      )}
    </div>
  );
};
