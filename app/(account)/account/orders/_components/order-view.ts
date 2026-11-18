import type {
  Address,
  FulfillmentStatus,
  Order,
  OrderLine,
} from "@/lib/contracts/account";
import type { Money } from "@/lib/contracts/catalog";

export type OrderStatusFilter = "all" | FulfillmentStatus;

export const ORDER_STATUS_LABELS: Record<FulfillmentStatus, string> = {
  processing: "Processing",
  in_transit: "In transit",
  delivered: "Delivered",
};

export const ORDER_STATUS_FILTERS: ReadonlyArray<{
  value: OrderStatusFilter;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "processing", label: "Processing" },
  { value: "in_transit", label: "In transit" },
  { value: "delivered", label: "Delivered" },
];

/** Formatters injected by the server, so these helpers stay free of market state. */
export interface OrderFormatters {
  money(money: Money): string;
  date(iso: string): string;
  country(code: string): string;
}

export interface OrderRowView {
  id: string;
  orderNumber: string;
  status: FulfillmentStatus;
  statusLabel: string;
  placedLabel: string;
  totalLabel: string;
  itemTitles: string[];
  items?: Array<{
    title: string;
    image?: string;
    quantity?: number;
    variantTitle?: string;
    productSlug?: string;
  }>;
  trackingUrl?: string;
  lines?: OrderLine[];
  url?: string;
  copyLink?: string;
  canReorder?: boolean;
  canReview?: boolean;
  searchText: string;
}

export interface OrderItemView {
  title: string;
  variantTitle?: string;
  quantity: number;
  priceLabel: string;
  image?: string;
}

export interface OrderDetailView {
  id: string;
  orderNumber: string;
  status: FulfillmentStatus;
  statusLabel: string;
  placedLabel: string;
  totalLabel: string;
  items: OrderItemView[];
  trackingNumber?: string;
  trackingUrl?: string;
  lines?: OrderLine[];
  url?: string;
  copyLink?: string;
  canReorder?: boolean;
  addressLines?: string[];
}

export function toOrderRowView(order: Order, f: OrderFormatters): OrderRowView {
  const itemTitles = order.items.map((item) => item.title);
  const items = order.items.map((item) => ({
    title: item.title,
    image: item.image,
    quantity: item.quantity,
    variantTitle: item.variantTitle,
    productSlug: item.productSlug,
  }));
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.fulfillmentStatus,
    statusLabel: ORDER_STATUS_LABELS[order.fulfillmentStatus],
    placedLabel: f.date(order.createdAt),
    totalLabel: f.money(order.total),
    itemTitles,
    items,
    trackingUrl: order.trackingUrl,
    lines: order.lines,
    url: order.url,
    copyLink: order.copyLink ?? order.url,
    canReorder:
      order.canReorder ?? (order.lines ? order.lines.length > 0 : true),
    canReview:
      order.financialStatus === "paid" &&
      order.fulfillmentStatus === "delivered",
    searchText: [order.orderNumber, ...itemTitles].join(" ").toLowerCase(),
  };
}

export function toOrderDetailView(
  order: Order,
  f: OrderFormatters
): OrderDetailView {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.fulfillmentStatus,
    statusLabel: ORDER_STATUS_LABELS[order.fulfillmentStatus],
    placedLabel: f.date(order.createdAt),
    totalLabel: f.money(order.total),
    items: order.items.map((item) => ({
      title: item.title,
      variantTitle: item.variantTitle,
      quantity: item.quantity,
      priceLabel: f.money(item.price),
      image: item.image,
    })),
    trackingNumber: order.trackingNumber,
    trackingUrl: order.trackingUrl,
    lines: order.lines,
    url: order.url,
    copyLink: order.copyLink ?? order.url,
    canReorder:
      order.canReorder ?? (order.lines ? order.lines.length > 0 : true),
    addressLines: order.shippingAddress
      ? formatAddressLines(
          order.shippingAddress,
          f.country(order.shippingAddress.country)
        )
      : undefined,
  };
}

export function matchesOrderFilter(
  row: OrderRowView,
  filter: OrderStatusFilter,
  query: string
): boolean {
  if (filter !== "all" && row.status !== filter) return false;
  const q = query.trim().toLowerCase();
  return q === "" || row.searchText.includes(q);
}

export function formatAddressLines(
  address: Address,
  countryName: string
): string[] {
  const cityLine = [
    address.city,
    [address.province, address.zip].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
  return [
    `${address.firstName} ${address.lastName}`,
    address.address1,
    address.address2,
    cityLine,
    countryName,
  ].filter((line): line is string => Boolean(line));
}
