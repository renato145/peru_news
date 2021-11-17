import React, { useMemo } from "react";
import { StoreProps, useStore } from "../store";

interface Props {
  data: [string, number][];
}

const selector = ({
  selectedWord,
  setSelectedWord,
  addFilter,
}: StoreProps) => ({
  selectedWord,
  setSelectedWord,
  addFilter,
});

export const WordCount: React.FC<Props> = ({ data }) => {
  const { selectedWord, setSelectedWord, addFilter } = useStore(selector);
  const width = useMemo(() => data.length === 0
    ? 0
    : data.map(([_, count]) => count).reduce((a, b) => Math.max(a, b)), [data]);

  const handleSelect = (word: string) => {
    if (selectedWord !== word) setSelectedWord(word);
    else setSelectedWord("");
  };

  const handleRemove = (
    ev: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
    word: string
  ) => {
    ev.stopPropagation();
    if (selectedWord === word) setSelectedWord("");
    addFilter(word);
  };

  return (
    <div className="flex flex-col space-y-1">
      {data.map(([word, count], i) => (
        <div
          key={i}
          className="group relative flex items-center h-8"
          onClick={() => handleSelect(word)}
        >
          <div className="absolute flex w-full justify-between pl-2">
            <p
              className={`pointer-events-none ${
                selectedWord === word ? "font-semibold" : ""
              }`}
            >
              {word} ({count})
            </p>
            <p
              className="mr-2 font-bold text-xs cursor-pointer text-gray-400 hover:text-gray-900"
              onClick={(e) => handleRemove(e, word)}
            >
              X
            </p>
          </div>
          <div
            className={`h-full transition-all duration-300 cursor-pointer group-hover:bg-blue-300 ${
              selectedWord === word ? "bg-blue-400" : "bg-blue-200"
            }`}
            style={{ width: `${(100 * count) / width}%` }}
          />
        </div>
      ))}
    </div>
  );
};
