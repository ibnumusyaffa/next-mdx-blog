import { format } from "date-fns";
import locale from "date-fns/locale/id";

export function defaultFormat(date) {
  return format(date, "dd MMMM, yyyy", { locale });
}
