import React, { HTMLProps } from "react";
import { Name2Url } from "../hooks/useName2Url";
import { WordCount } from "./WordCount";

interface Props extends HTMLProps<HTMLDivElement> {
  name2url?: Name2Url;
  name: string;
  wc: [string, number][];
}

export const Newspaper: React.FC<Props> = ({
  name2url,
  name,
  wc,
  ...props
}) => {
  return (
    <div {...props}>
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
