import {
  CATEGORIES,
  ITEM_TYPES,
  STATUSES,
  type Category,
  type ItemStatus,
  type ItemType,
} from "@/lib/constants";

export function StatusBadge({ status }: { status: string }) {
  const info = STATUSES[status as ItemStatus] ?? {
    label: status,
    color: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${info.color}`}>
      {info.label}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const info = ITEM_TYPES[type as ItemType] ?? { label: type, emoji: "📌" };
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
      <span>{info.emoji}</span>
      {info.label}
    </span>
  );
}

export function CategoryIcon({ category }: { category: string }) {
  const info = CATEGORIES[category as Category] ?? { icon: "📦", label: category };
  return <span title={info.label}>{info.icon}</span>;
}
