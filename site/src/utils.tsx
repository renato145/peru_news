import { format, parse } from "date-fns";

export const formatDateStr = (date: string) =>
  parse(date, "yyyyMMdd", new Date());

export const formatDate = (date: Date, fmt: string = "dd/MM/Y") =>
  format(date, fmt);
