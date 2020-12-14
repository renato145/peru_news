import { parse, format } from "date-fns";
import React, { useCallback, useEffect } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { StoreProps, useStore } from "../store";

interface Props {
  date: string;
  url: string;
  load: boolean;
  className?: string;
}

const selector = (url: string) => (state: StoreProps) => ({
  addDate: () => state.add(url),
  removeDate: () => state.remove(url),
  isActive: state.isActive(url),
});

const formatDate = (date: string) =>
  format(parse(date, "yyyyMMdd", new Date()), "dd/MM/Y");

export const DayLoader: React.FC<Props> = ({ date, url, load, className = "" }) => {
  const { isError, isLoading, isSuccess, refetch } = useFetchData(url);
  const { addDate, removeDate, isActive } = useStore(selector(url));

  const toogle = useCallback(() => {
    if (isActive || isError) removeDate();
    else if (isSuccess) addDate();
  }, [isActive, isError, removeDate, isSuccess, addDate]);

  const toogleView = useCallback(() => {
    if (isSuccess) toogle();
    else if (isLoading) return;
    else
      refetch().then((o) => {
        if (o) addDate();
      });
  }, [addDate, isLoading, isSuccess, refetch, toogle]);

  useEffect(() => {
    if (load) toogleView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  return isError ? null : (
    <div
      className={`${className} p-2 transition cursor-pointer ${
        isActive ? "bg-green-600 text-gray-50" : "bg-gray-300"
      } ${isLoading ? "animate-pulse" : ""}`}
      onClick={() => toogleView()}
    >
      <p className="font-semibold pointer-events-none">{formatDate(date)}</p>
    </div>
  );
};
