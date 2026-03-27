import { format } from "date-fns";

export const formatDate = (date: Date | string, pattern = "MMM dd, yyyy") => {
  return format(new Date(date), pattern);
};
