import Link from "next/link";
import { CategoryIcon, StatusBadge, TypeBadge } from "./Badges";
import { CATEGORIES, type Category } from "@/lib/constants";
import { formatDate } from "@/lib/items";

export type ItemListItem = {
  id: string;
  type: string;
  title: string;
  category: string;
  location: string;
  eventDate: string;
  status: string;
};

export default function ItemCard({ item }: { item: ItemListItem }) {
  const category = CATEGORIES[item.category as Category]?.label ?? item.category;

  return (
    <Link
      href={`/items/${item.id}`}
      className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">
            <CategoryIcon category={item.category} />
          </span>
          <div>
            <TypeBadge type={item.type} />
            <h3 className="mt-1 font-semibold text-slate-900">{item.title}</h3>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>
      <p className="text-sm text-slate-600">
        {item.location} · {formatDate(item.eventDate)}
      </p>
      <p className="mt-1 text-xs text-slate-400">{category}</p>
    </Link>
  );
}
