import { format } from "date-fns";
import locale from "date-fns/locale/id";

export default function formatDate(date) {
  return format(date, "dd MMMM, yyyy", { locale });
}
