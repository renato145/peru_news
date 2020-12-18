import { ScaleTime } from "d3";
import React, { HTMLProps, useMemo } from "react";
import { Name2Url } from "../hooks/useName2Url";
import { StoreProps, useStore } from "../store";
import { LineChart } from "./LineChart";
import { WordCount } from "./WordCount";

interface Props extends HTMLProps<HTMLDivElement> {
  name2url?: Name2Url;
  name: string;
  wc: [string, number][];
  xScale: ScaleTime<number, number> | null;
}

const selector = ({ selectedWord, getTimelineData }: StoreProps) => ({
  selectedWord,
  getTimelineData,
});

export const Newspaper: React.FC<Props> = ({
  name2url,
  name,
  wc,
  xScale,
  ...props
}) => {
  const { selectedWord: word, getTimelineData } = useStore(selector);
  // const { data } = useMemo(() => ({ data: getTimelineData(name) }), [
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => getTimelineData(name), [
    getTimelineData,
    name,
    word,
  ]);

  return (
    <div {...props}>
      {(data && xScale !== null && word !== "") ? <LineChart data={data} xScale={xScale} /> : null}
      <a
        className="capitalize text-lg font-semibold"
        href={name2url?.get(name)}
        target="_black"
        rel="noopener"
      >
        {name.replace("_", " ")}
      </a>
      <div className="my-2">
        <WordCount data={wc} />
      </div>
    </div>
  );
};
