import React, { HTMLProps } from "react";
import { StoreProps, useStore } from "../store";

interface Props extends HTMLProps<HTMLDivElement> {
  className?: string;
  word: string;
}

const selector = ({ rmFilter }: StoreProps) => ({ rmFilter });

export const Filter: React.FC<Props> = ({ word, className = "", ...props }) => {
  const { rmFilter } = useStore(selector);

  const handleClick = () => {
    rmFilter(word);
  };

  return (
    <div
      className={`px-2 rounded-md bg-red-400 hover:bg-red-600 text-sm text-white font-medium transition-colors cursor-pointer ${className}`}
      onClick={handleClick}
      {...props}
    >
      {word}
    </div>
  );
};
