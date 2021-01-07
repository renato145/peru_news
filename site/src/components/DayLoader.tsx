import { format } from "date-fns";
import React, { useCallback, useEffect } from "react";
import { useFetchData } from "../hooks/useFetchData";
import { StoreProps, useStore } from "../store";
import { formatDateStr } from "../utils";

interface Props {
  date: string;
  url: string;
  load: boolean;
  className?: string;
}

const selector = (date: string) => (state: StoreProps) => ({
  add: state.add,
  addDate: () => state.addActiveDate(date),
  removeDate: () => state.rmActiveDate(date),
  isActive: state.isActiveDate(date),
});

const formatDate = (date: string) => format(formatDateStr(date), "dd/MM/Y");

export const DayLoader: React.FC<Props> = ({
  date,
  url,
  load,
  className = "",
}) => {
  const { isError, isLoading, isSuccess, refetch } = useFetchData(url);
  const { add, addDate, removeDate, isActive } = useStore(selector(date));

  const toogle = useCallback(() => {
    if (isActive || isError) removeDate();
    else if (isSuccess) addDate();
  }, [isActive, isError, removeDate, isSuccess, addDate]);

  const toogleView = useCallback(() => {
    if (isSuccess) toogle();
    else if (isLoading) return;
    else
      refetch().then(({ data }) => {
        if (data) {
          add({ [date]: data });
          addDate();
        }
      });
  }, [add, addDate, isLoading, isSuccess, refetch, toogle, date]);

  useEffect(() => {
    if (load) toogleView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  return isError ? null : (
    <div
      className={`${className} p-2 transition cursor-pointer ${
        isActive ? "bg-green-600 text-gray-50" : "bg-gray-300"
      } ${isLoading ? "animate-pulse" : ""}`}
      onClick={toogleView}
    >
      <p className="font-semibold pointer-events-none">{formatDate(date)}</p>
    </div>
  );
};
