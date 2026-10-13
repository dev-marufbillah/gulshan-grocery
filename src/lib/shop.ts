export const PAGE_SIZE = 12;

// Header menu er chhoto naam gulo asol category slug e map kore
export const CATEGORY_ALIASES: Record<string, string> = {
  fruits: "fresh-fruits",
  vegetable: "vegetables",
  beverages: "drinks",
};

export type ShopState = {
  q: string;
  sort: string;
  page: number;
  category: string[];
  rating: string[];
  brand: string[];
  type: string[];
  stock: string[];
  min: number | null;
  max: number | null;
};

type RawParams = Record<string, string | string[] | undefined>;

const list = (v: string | string[] | undefined): string[] =>
  v === undefined ? [] : (Array.isArray(v) ? v : [v]).filter(Boolean);

const first = (v: string | string[] | undefined): string =>
  Array.isArray(v) ? v[0] ?? "" : v ?? "";

const num = (v: string | string[] | undefined): number | null => {
  const s = first(v);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

export function parseState(raw: RawParams): ShopState {
  return {
    q: first(raw.q).trim(),
    sort: first(raw.sort) || "default",
    page: Math.max(1, Math.floor(num(raw.page) ?? 1)),
    category: list(raw.category).map((c) => CATEGORY_ALIASES[c] ?? c),
    rating: list(raw.rating),
    brand: list(raw.brand),
    type: list(raw.type),
    stock: list(raw.stock),
    min: num(raw.min),
    max: num(raw.max),
  };
}

export function buildQuery(s: Partial<ShopState>): string {
  const p = new URLSearchParams();
  if (s.q) p.set("q", s.q);
  if (s.sort && s.sort !== "default") p.set("sort", s.sort);
  (["category", "rating", "brand", "type", "stock"] as const).forEach((k) =>
    (s[k] ?? []).forEach((v) => p.append(k, v))
  );
  if (s.min != null) p.set("min", String(s.min));
  if (s.max != null) p.set("max", String(s.max));
  if (s.page && s.page > 1) p.set("page", String(s.page));
  const qs = p.toString();
  return qs ? `/shop?${qs}` : "/shop";
}