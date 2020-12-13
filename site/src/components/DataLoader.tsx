import React from "react";
import { getFormattedDate } from "../utils";
import { DayLoader } from "./DayLoader";

interface Props {
  n: number;
  loadN: number;
}

export const DataLoader: React.FC<Props> = ({ n, loadN }) => {
  const dates = Array(n)
    .fill(0)
    .map((_, i) => getFormattedDate(-i));

  return (
    <div className="-mt-2 -ml-2 flex flex-wrap">
      {dates.map((d, i) => (
        <DayLoader key={i} className="mt-2 ml-2" date={d} load={i < loadN} />
      ))}
    </div>
  );
};
