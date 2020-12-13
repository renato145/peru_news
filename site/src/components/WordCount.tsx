import React, { useMemo } from "react";
import { StoreProps, useStore } from "../store";

interface Props {
  data: [string, number][];
}

const selector = ({ selectedWord, setSelectedWord }: StoreProps) => ({
  selectedWord,
  setSelectedWord,
});

export const WordCount: React.FC<Props> = ({ data }) => {
  const { selectedWord, setSelectedWord } = useStore(selector);
  const width = useMemo(
    () => data.map(([_, count]) => count).reduce((a, b) => Math.max(a, b)),
    [data]
  );

  const handleClick = (word: string) => {
    if (selectedWord !== word) setSelectedWord(word);
    else setSelectedWord("");
  };

  return (
    <div className="flex flex-col space-y-1">
      {data.map(([word, count], i) => (
        <div
          key={i}
          className="relative flex items-center h-8"
          onClick={() => handleClick(word)}
        >
          <p
            className={`absolute pl-2 pointer-events-none ${
              selectedWord === word ? "font-semibold" : ""
            }`}
          >
            {word} ({count})
          </p>
          <div
            className={`h-full transition-all duration-300 ${
              selectedWord === word ? "bg-blue-400" : "bg-blue-200"
            }`}
            style={{ width: `${(100 * count) / width}%` }}
          />
        </div>
      ))}
    </div>
  );
};
