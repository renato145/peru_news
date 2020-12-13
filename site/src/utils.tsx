import { add, format } from "date-fns";
import { QueryConfig } from "react-query";

export const getFormattedDate = (daysAdd = 0) => {
  const date = add(new Date(), { days: daysAdd });
  return format(date, "YMMdd");
};

export const defaultQueryConfig: QueryConfig<any> = {
  enabled: false,
  retry: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
  cacheTime: 60000 * 60,
};
