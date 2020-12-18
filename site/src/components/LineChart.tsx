import React, { useMemo } from "react";
import { ResizeObserver } from "@juggle/resize-observer";
import useMeasure from "react-use-measure";
import { WordData } from "../store";
import { line, scaleLinear, ScaleTime, extent, curveNatural } from "d3";
import { formatDate } from "../utils";

interface Props {
  data: WordData;
  xScale: ScaleTime<number, number>;
}

const xMarging = 5;
const yMarging = 10;

export const LineChart: React.FC<Props> = ({ data, xScale }) => {
  const [ref, { width }] = useMeasure({ polyfill: ResizeObserver });
  const height = width / 3;
  const { values, path } = useMemo(() => {
    const yDomain = extent(data.map((d) => d[1]));
    if (!yDomain[0]) return {};
    const yScale = scaleLinear()
      .domain(yDomain)
      .range([height - yMarging, yMarging]);
    const timeScale = xScale.range([xMarging, width-xMarging]);
    const values: [number, number][] = data.map(([date, count]) => [
      timeScale(formatDate(date)),
      yScale(count),
    ]);
    const path = line().curve(curveNatural)(values);
    return { values, path };
  }, [xScale, width, height, data]);

  return (
    <svg ref={ref} className="w-full my-1 bg-white rounded" height={width / 3}>
      {path && values ? (
        <>
          <path
            fill="none"
            className="stroke-current text-blue-700 stroke-2 transition-all"
            d={path}
          />
          {values.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} className="scatter hover:scatter-lg fill-current text-blue-700 hover:text-blue-400 transition-all" >
              <title>asd</title>
            </circle>
          ))}
        </>
      ) : null}
    </svg>
  );
};
