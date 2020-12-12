import React from "react";
import { useQuery } from "react-query";
import { useFetchData } from "../hooks/useFetchData";
import { defaultQueryConfig } from "../utils";

interface Props {
  date: string;
}

export const Visualization: React.FC<Props> = ({ date }) => {
  const { data, isFetching } = useQuery(["data", { date }], useFetchData, defaultQueryConfig);

  return (
    <div>
      {isFetching ? "loading..." : null}
      {data
        ? data.map((o, i) => (
            <div key={i}>
              <p>{o[0]}</p>
              <div className="ml-4">
                {o[1].slice(0, 5).map(([word, count], j) => (
                  <p key={`${i}-${j}`}>{`${word}: ${count}`}</p>
                ))}
              </div>
            </div>
          ))
        : null}
    </div>
  );
};
