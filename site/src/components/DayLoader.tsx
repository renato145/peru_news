import React from "react";
import { QueryStatus, useQuery } from "react-query";
import { useFetchData } from "../hooks/useFetchData";
import { defaultQueryConfig } from "../utils";

interface Props {
  date: string;
}

export const DayLoader: React.FC<Props> = ({ date }) => {
  const { status, refetch } = useQuery(["data", { date }], useFetchData, defaultQueryConfig);

  return (
    <div
      className={`p-2 ${
        status === QueryStatus.Idle
          ? "bg-blue-300"
          : status === QueryStatus.Loading
          ? "bg-blue-300 animate-pulse"
          : status === QueryStatus.Error
          ? "bg-red-300"
          : "bg-green-300"
      }`}
      onMouseOver={() =>
        (status === QueryStatus.Idle || status === QueryStatus.Error) &&
        refetch()
      }
    >
      <p className="font-semibold">{date}</p>
      {status === QueryStatus.Loading ? (
        <p className="text-gray-600">loading...</p>
      ) : status === QueryStatus.Error ? (
        <p>Error :C</p>
      ) : null}
    </div>
  );
};
