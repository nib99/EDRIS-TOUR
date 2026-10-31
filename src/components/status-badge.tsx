import { cn } from "@/lib/cn";

export function StatusBadge({ status, label }: { status: string; label: string }) {
  const tone =
    status === "completed"
      ? "bg-forest text-on-forest"
      : status === "cancelled"
        ? "text-danger bg-paper-2"
        : status === "new"
          ? "bg-forest/10 text-forest"
          : status === "documents_pending"
            ? "bg-paper-2 text-warn"
            : "bg-paper-2 text-ink";
  return (
    <span className={cn("inline-flex items-center rounded-sm px-2 py-1 text-xs font-semibold", tone)}>
      {label}
    </span>
  );
}
