import { cn } from "@/lib/utils";
import type { Priority, AppointmentStatus } from "@/lib/mockData";

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
        priority === "emergency" && "bg-priority-emergency/15 text-priority-emergency",
        priority === "high" && "bg-priority-high/15 text-priority-high",
        priority === "medium" && "bg-priority-medium/15 text-priority-medium",
        priority === "normal" && "bg-priority-normal/15 text-priority-normal"
      )}
    >
      {priority === "emergency" && "● "}
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
        status === "confirmed" && "bg-status-confirmed/15 text-status-confirmed",
        status === "pending" && "bg-status-pending/15 text-status-pending",
        status === "completed" && "bg-status-completed/15 text-status-completed",
        status === "cancelled" && "bg-status-cancelled/15 text-status-cancelled"
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
