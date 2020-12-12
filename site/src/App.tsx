import React from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { ReactQueryDevtools } from "react-query-devtools";
import { DataLoader } from "./components/DataLoader";

const queryCache = new QueryCache();

export const App: React.FC = () => {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <div className="m-4">
        <DataLoader size={5} />
      </div>
      <ReactQueryDevtools initialIsOpen />
    </ReactQueryCacheProvider>
  );
};
