import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { DataLoader } from "./components/DataLoader";
import { Visualization } from "./components/Visualization";

const queryClient =  new QueryClient({defaultOptions: {queries: {}}});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-4">
        <DataLoader n={10} loadN={5} />
        <Visualization topk={10} />
      </div>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
};
