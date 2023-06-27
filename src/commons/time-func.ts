import format from "date-fns/format";
import { formatToDate } from "./date-func";

export const dateFormatter = (
  value: string | Date,
  dateFormat = "dd/MM/yyyy"
) => {
  const formattedDate = value instanceof Date ? value : formatToDate(value);
  return format(formattedDate, dateFormat);
};
