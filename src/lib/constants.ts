export const APP_NAME = "양벤져스 분실물 센터";
export const STORAGE_LOCATION = "분실물 보관소";
export const COMPLETED_HIDE_DAYS = 7;

export const ITEM_TYPES = {
  LOST: { label: "분실", emoji: "😢", color: "rose" },
  FOUND: { label: "습득", emoji: "🎁", color: "emerald" },
} as const;

export type ItemType = keyof typeof ITEM_TYPES;

export const CATEGORIES = {
  ELECTRONICS: { label: "전자기기", icon: "📱" },
  WALLET: { label: "지갑·카드", icon: "👛" },
  CLOTHING: { label: "의류", icon: "👕" },
  OTHER: { label: "기타", icon: "📦" },
} as const;

export type Category = keyof typeof CATEGORIES;

export const STATUSES = {
  RECEIVED: { label: "접수됨", color: "bg-slate-100 text-slate-700" },
  REVIEWING: { label: "확인 중", color: "bg-amber-100 text-amber-800" },
  CONTACT_PENDING: { label: "연락 대기", color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "완료", color: "bg-green-100 text-green-800" },
  HIDDEN: { label: "숨김", color: "bg-gray-100 text-gray-500" },
} as const;

export type ItemStatus = keyof typeof STATUSES;

export const STATUS_FLOW: ItemStatus[] = [
  "RECEIVED",
  "REVIEWING",
  "CONTACT_PENDING",
  "COMPLETED",
];

export const TIME_NOTES = [
  "아침 (등교)",
  "1교시",
  "2교시",
  "3교시",
  "4교시",
  "점심시간",
  "5교시",
  "6교시",
  "7교시",
  "방과 후",
  "기타",
];
