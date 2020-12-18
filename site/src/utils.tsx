import { parse } from "date-fns";

export const formatDate = (date: string) => parse(date, "yyyyMMdd", new Date());