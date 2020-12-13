import React from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { DataLoader } from "./components/DataLoader";
import { Visualization } from "./components/Visualization";

const queryCache = new QueryCache();

export const App: React.FC = () => {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <div className="m-4">
        <DataLoader n={10} loadN={5} />
        <Visualization topk={10} />
      </div>
      <ReactQueryDevtools initialIsOpen />
    </ReactQueryCacheProvider>
  );
};
