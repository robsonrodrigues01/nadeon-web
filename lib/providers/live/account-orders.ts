import {
  AddressSchema,
  OrderSchema,
  type Address,
  type FinancialStatus,
  type FulfillmentStatus,
  type Order,
  type OrderItem,
  type OrderLine,
} from "@/lib/contracts/account";
import type { Money } from "@/lib/contracts/catalog";

/**
 * Most recent orders fetched for the list. The Customer Account API allows up
 * to 250 per page; the account UI has no "load more", so the list is capped
 * here instead of paginating.
 */
export const ORDERS_PAGE_SIZE = 50;
export const ORDER_LINE_ITEMS_LIMIT = 50;
export const ORDER_FULFILLMENTS_LIMIT = 10;
export const ADDRESSES_PAGE_SIZE = 50;

const ADDRESS_FIELDS = `
  firstName
  lastName
  company
  address1
  address2
  city
  zoneCode
  territoryCode
  zip
  phoneNumber
`;

const ORDER_FIELDS_FRAGMENT = `
  fragment OrderFields on Order {
    id
    name
    number
    processedAt
    financialStatus
    statusPageUrl
    totalPrice {
      amount
      currencyCode
    }
    shippingAddress {
      ${ADDRESS_FIELDS}
    }
    lineItems(first: ${ORDER_LINE_ITEMS_LIMIT}) {
      nodes {
        id
        title
        variantTitle
        quantity
        variantId
        image {
          url
        }
        price {
          amount
          currencyCode
        }
      }
    }
    fulfillments(first: ${ORDER_FULFILLMENTS_LIMIT}) {
      nodes {
        status
        latestShipmentStatus
        trackingInformation {
          company
          number
          url
        }
      }
    }
  }
`;

export const GET_CUSTOMER_ORDERS_QUERY = `
  query GetCustomerOrders($first: Int!) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          ...OrderFields
        }
      }
    }
  }
  ${ORDER_FIELDS_FRAGMENT}
`;

export const GET_CUSTOMER_ORDER_QUERY = `
  query GetCustomerOrder($id: ID!) {
    order(id: $id) {
      ...OrderFields
    }
  }
  ${ORDER_FIELDS_FRAGMENT}
`;

export const GET_CUSTOMER_ADDRESSES_QUERY = `
  query GetCustomerAddresses($first: Int!) {
    customer {
      defaultAddress {
        id
      }
      addresses(first: $first) {
        nodes {
          id
          ${ADDRESS_FIELDS}
        }
      }
    }
  }
`;

interface RawMoney {
  amount?: string | number | null;
  currencyCode?: string | null;
}

interface RawAddress {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  zoneCode?: string | null;
  territoryCode?: string | null;
  zip?: string | null;
  phoneNumber?: string | null;
}

interface RawLineItem {
  id?: string | null;
  title?: string | null;
  variantTitle?: string | null;
  quantity?: number | null;
  variantId?: string | null;
  image?: { url?: string | null } | null;
  price?: RawMoney | null;
}

interface RawFulfillment {
  status?: string | null;
  latestShipmentStatus?: string | null;
  trackingInformation?: Array<{
    company?: string | null;
    number?: string | null;
    url?: string | null;
  } | null> | null;
}

export interface RawOrder {
  id: string;
  name?: string | null;
  number?: number | null;
  processedAt?: string | null;
  financialStatus?: string | null;
  statusPageUrl?: string | null;
  totalPrice?: RawMoney | null;
  shippingAddress?: RawAddress | null;
  lineItems?: { nodes?: Array<RawLineItem | null> | null } | null;
  fulfillments?: { nodes?: Array<RawFulfillment | null> | null } | null;
}

export interface RawCustomerAddresses {
  defaultAddress?: { id?: string | null } | null;
  addresses?: { nodes?: Array<RawAddress | null> | null } | null;
}

const DELIVERED_SHIPMENT_STATUSES = new Set(["DELIVERED", "PICKED_UP"]);
// The carrier has not moved the parcel yet.
const NOT_MOVING_SHIPMENT_STATUSES = new Set([
  "LABEL_PRINTED",
  "LABEL_PURCHASED",
  "LABEL_VOIDED",
  "CONFIRMED",
]);
const DEAD_FULFILLMENT_STATUSES = new Set(["CANCELLED", "ERROR", "FAILURE"]);

export function mapFinancialStatus(raw?: string | null): FinancialStatus {
  switch (raw) {
    case "PAID":
    case "PARTIALLY_REFUNDED":
      return "paid";
    case "REFUNDED":
    case "VOIDED":
      return "refunded";
    default:
      return "pending";
  }
}

/**
 * The order contract has one fulfillment status; the Customer Account API
 * only exposes per-fulfillment data, so it is derived: no live fulfillment
 * shipped means processing, all delivered means delivered, otherwise in transit.
 */
export function deriveFulfillmentStatus(
  fulfillments: RawFulfillment[]
): FulfillmentStatus {
  const live = fulfillments.filter(
    (f) => !DEAD_FULFILLMENT_STATUSES.has(f.status ?? "")
  );
  if (live.length === 0) return "processing";

  const isDelivered = (f: RawFulfillment) =>
    DELIVERED_SHIPMENT_STATUSES.has(f.latestShipmentStatus ?? "");
  if (live.every(isDelivered)) return "delivered";

  const isShipped = (f: RawFulfillment) => {
    const shipment = f.latestShipmentStatus;
    if (shipment) return !NOT_MOVING_SHIPMENT_STATUSES.has(shipment);
    return f.status === "SUCCESS";
  };
  return live.some(isShipped) ? "in_transit" : "processing";
}

function toMoney(raw?: RawMoney | null): Money {
  const amount = Number(raw?.amount);
  return {
    amount: Number.isFinite(amount) ? amount : 0,
    currencyCode: raw?.currencyCode || "USD",
  };
}

function httpUrlOrUndefined(value?: string | null): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export function mapShopifyAddress(
  raw: RawAddress,
  id: string,
  isDefault = false
): Address {
  return AddressSchema.parse({
    id,
    firstName: raw.firstName ?? "",
    lastName: raw.lastName ?? "",
    company: raw.company || undefined,
    address1: raw.address1 ?? "",
    address2: raw.address2 || undefined,
    city: raw.city ?? "",
    province: raw.zoneCode || undefined,
    zip: raw.zip ?? "",
    country: raw.territoryCode || "US",
    phone: raw.phoneNumber || undefined,
    isDefault,
  });
}

export function mapCustomerAddresses(raw: RawCustomerAddresses): Address[] {
  const defaultId = raw.defaultAddress?.id ?? null;
  const nodes = raw.addresses?.nodes ?? [];
  return nodes
    .filter((node): node is RawAddress & { id: string } => Boolean(node?.id))
    .map((node) =>
      mapShopifyAddress(
        node,
        node.id,
        defaultId !== null && node.id === defaultId
      )
    );
}

export function orderDetailPath(orderId: string): string {
  return `/account/orders/${encodeURIComponent(orderId)}`;
}

const ORDER_GID_PATTERN =
  /^gid:\/\/shopify\/Order\/\d+(\?[A-Za-z0-9=&_.~-]+)?$/;

/**
 * Accepts an order GID as returned by the API, with or without URL encoding
 * (route params arrive in either form). Anything else is not an order id.
 */
export function normalizeOrderId(raw: string): string | null {
  let id = raw.trim();
  if (id.includes("%")) {
    try {
      id = decodeURIComponent(id);
    } catch {
      return null;
    }
  }
  return ORDER_GID_PATTERN.test(id) ? id : null;
}

export function mapShopifyOrder(raw: RawOrder): Order {
  const lineItems = (raw.lineItems?.nodes ?? []).filter(
    (item): item is RawLineItem =>
      Boolean(item) && typeof item?.quantity === "number" && item.quantity > 0
  );

  const items: OrderItem[] = lineItems.map((item) => ({
    title: item.title ?? "",
    quantity: item.quantity as number,
    price: toMoney(item.price),
    image: httpUrlOrUndefined(item.image?.url),
    variantTitle: item.variantTitle || undefined,
    variantId: item.variantId || undefined,
  }));

  const lines: OrderLine[] = items
    .filter((item) => item.variantId)
    .map((item) => ({
      variantId: item.variantId as string,
      quantity: item.quantity,
      image: item.image,
      title: item.title,
      price: item.price,
    }));

  const fulfillments = (raw.fulfillments?.nodes ?? []).filter(
    (f): f is RawFulfillment => Boolean(f)
  );
  const tracking = fulfillments
    .filter((f) => !DEAD_FULFILLMENT_STATUSES.has(f.status ?? ""))
    .flatMap((f) => f.trackingInformation ?? [])
    .filter((t): t is NonNullable<typeof t> => Boolean(t?.number || t?.url))
    .sort(
      (a, b) =>
        Number(Boolean(httpUrlOrUndefined(b.url))) -
        Number(Boolean(httpUrlOrUndefined(a.url)))
    )[0];

  const name = raw.name?.trim().replace(/^#/, "");
  const orderNumber =
    name ||
    (raw.number !== null && raw.number !== undefined
      ? String(raw.number)
      : raw.id);
  const path = orderDetailPath(raw.id);

  return OrderSchema.parse({
    id: raw.id,
    orderNumber,
    createdAt: raw.processedAt ?? new Date(0).toISOString(),
    financialStatus: mapFinancialStatus(raw.financialStatus),
    fulfillmentStatus: deriveFulfillmentStatus(fulfillments),
    items,
    total: toMoney(raw.totalPrice),
    shippingAddress: raw.shippingAddress
      ? mapShopifyAddress(raw.shippingAddress, "order-shipping")
      : undefined,
    trackingNumber: tracking?.number || undefined,
    trackingUrl: httpUrlOrUndefined(tracking?.url),
    lines,
    url: path,
    copyLink: path,
    statusUrl: httpUrlOrUndefined(raw.statusPageUrl),
    canReorder: lines.length > 0,
  });
}
