import React, { useCallback, useMemo } from "react";
import { ResizeObserver } from "@juggle/resize-observer";
import useMeasure from "react-use-measure";
import { WordData } from "../store";
import {
  line,
  scaleLinear,
  ScaleTime,
  max,
  axisLeft as _axisLeft,
  select,
} from "d3";
import { formatDate, formatDateStr } from "../utils";

interface Props {
  data: WordData;
  xScale: ScaleTime<number, number>;
}

const margins = {
  left: 10,
  right: 10,
  top: 10,
  bottom: 10,
};

export const LineChart: React.FC<Props> = ({ data, xScale }) => {
  const [ref, { width }] = useMeasure({ polyfill: ResizeObserver });
  const height = width / 3;
  const { values, path, timeScale, yScale, axisLeft } = useMemo(() => {
    const yDomain = [0, max(data.map((d) => d[1])) ?? 0];
    const yScale = scaleLinear()
      .domain(yDomain)
      .range([height - margins.bottom, margins.top]);
    const timeScale = xScale.range([margins.left + 3, width - margins.right]);
    const values: [number, number][] = data.map(([date, count]) => [
      timeScale(formatDateStr(date)),
      yScale(count),
    ]);
    const path = line()(values);
    const axisLeft = _axisLeft(yScale)
      .ticks(2)
      .tickSize(-width + margins.left - margins.right).tickSizeOuter(0);
    return { values, path, timeScale, yScale, axisLeft };
  }, [xScale, width, height, data]);

  const xAxisRef = useCallback(
    (node) => {
      select(node).call(axisLeft);
    },
    [axisLeft]
  );

  return (
    <svg ref={ref} className="group w-full my-1 bg-white rounded" height={width / 3}>
      {path && values ? (
        <>
          <g
            ref={xAxisRef}
            transform={`translate(${margins.left},0)`}
            className="leftAxis"
          />
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
