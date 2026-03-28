import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
}

export function formatTime(timeString: string) {
  if (!timeString) return "";
  // Assuming HH:mm format
  try {
    const [hours, minutes] = timeString.split(':');
    const d = new Date();
    d.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    return format(d, "h:mm a");
  } catch {
    return timeString;
  }
}

export const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  called: "bg-purple-100 text-purple-800 border-purple-200 animate-pulse",
  in_progress: "bg-teal-100 text-teal-800 border-teal-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  no_show: "bg-red-100 text-red-800 border-red-200",
};

export const statusLabels = {
  pending: "Pending / قيد الانتظار",
  confirmed: "Confirmed / مؤكد",
  called: "Go to Counter / تفضل إلى النافذة",
  in_progress: "Serving / جاري الخدمة",
  completed: "Completed / مكتمل",
  cancelled: "Cancelled / ملغى",
  no_show: "No Show / لم يحضر",
};
