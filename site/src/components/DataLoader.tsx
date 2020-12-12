import React from "react";
import { getFormattedDate } from "../utils";
import { DayLoader } from "./DayLoader";
import { Visualization } from "./Visualization";

interface Props {
  size: number;
}

export const DataLoader: React.FC<Props> = ({ size }) => {
  const dates = Array(size)
    .fill(0)
    .map((_, i) => getFormattedDate(-i));

  return (
    <div className="flex space-x-2">
      {dates.map((d, i) => (
        <div key={i}>
          <DayLoader date={d} />
          <Visualization date={d} />
        </div>
      ))}
    </div>
  );
};
