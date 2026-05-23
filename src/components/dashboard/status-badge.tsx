import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "CONFIRMED"
      ? "border-green-500/30 bg-green-500/10 text-green-400"
      : status === "CANCELLED"
        ? "border-red-500/30 bg-red-500/10 text-red-400"
        : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles
      )}
    >
      {status}
    </span>
  );
}
