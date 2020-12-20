import React, { useMemo } from "react";
import { ResizeObserver } from "@juggle/resize-observer";
import useMeasure from "react-use-measure";
import { WordData } from "../store";
import { line, scaleLinear, ScaleTime, max, curveNatural, axisLeft } from "d3";
import { formatDate, formatDateStr } from "../utils";

interface Props {
  data: WordData;
  xScale: ScaleTime<number, number>;
}

const xMarging = 5;
const yMarging = 10;

export const LineChart: React.FC<Props> = ({ data, xScale }) => {
  const [ref, { width }] = useMeasure({ polyfill: ResizeObserver });
  const height = width / 3;
  const { values, path, timeScale, yScale } = useMemo(() => {
    // const yDomain = extent(data.map((d) => d[1]));
    const yDomain = [0, max(data.map((d) => d[1])) ?? 0];
    const yScale = scaleLinear()
      .domain(yDomain)
      .range([height - yMarging, yMarging]);
    const timeScale = xScale.range([xMarging, width - xMarging]);
    const values: [number, number][] = data.map(([date, count]) => [
      timeScale(formatDateStr(date)),
      yScale(count),
    ]);
    const path = line().curve(curveNatural)(values);
    return { values, path, timeScale, yScale };
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
            <circle
              key={i}
              cx={x}
              cy={y}
              className="scatter hover:scatter-lg fill-current text-blue-700 hover:text-blue-400 transition-all"
            >
              <title>
                {`${Math.round(yScale.invert(y))} (${formatDate(
                  timeScale.invert(x),
                  "dd MMM"
                )})`}
              </title>
            </circle>
          ))}
        </>
      ) : null}
    </svg>
  );
};
