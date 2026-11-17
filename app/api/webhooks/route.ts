import crypto from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { mailyteProvider } from "@/lib/providers";

function verifyShopifyHmac(
  rawBody: string,
  hmacHeader: string,
  secret: string
): boolean {
  try {
    const generatedHash = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("base64");

    const generatedBuf = Buffer.from(generatedHash, "utf8");
    const headerBuf = Buffer.from(hmacHeader, "utf8");

    if (generatedBuf.length !== headerBuf.length) {
      return false;
    }
    return crypto.timingSafeEqual(generatedBuf, headerBuf);
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Unauthorized: missing secret", { status: 401 });
  }

  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  if (!hmacHeader) {
    return new Response("Unauthorized: missing HMAC header", { status: 401 });
  }

  const rawBody = await request.text();

  if (!verifyShopifyHmac(rawBody, hmacHeader, secret)) {
    return new Response("Unauthorized: invalid HMAC signature", {
      status: 401,
    });
  }

  let payload: Record<string, unknown>;
  try {
    const parsed = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return new Response("Bad Request: invalid JSON payload", { status: 400 });
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return new Response("Bad Request: invalid JSON payload", { status: 400 });
  }

  const topic = request.headers.get("x-shopify-topic") ?? "";

  switch (topic) {
    case "checkouts/create": {
      const rawId = payload.id ?? payload.token;
      if (rawId == null || rawId === "") {
        return new Response("Bad Request: missing checkout id", {
          status: 400,
        });
      }
      const checkoutId = String(rawId);
      const email = typeof payload.email === "string" ? payload.email : null;
      const totalPrice =
        payload.total_price != null ? String(payload.total_price) : undefined;
      const currency =
        typeof payload.currency === "string" ? payload.currency : undefined;
      const lineItemsCount = Array.isArray(payload.line_items)
        ? payload.line_items.length
        : undefined;
      const abandonedCheckoutUrl =
        typeof payload.abandoned_checkout_url === "string"
          ? payload.abandoned_checkout_url
          : undefined;

      await mailyteProvider.sendCheckoutStarted({
        checkoutId,
        email,
        totalPrice,
        currency,
        lineItemsCount,
        abandonedCheckoutUrl,
      });

      console.info(
        `[webhook] topic=checkouts/create status=processed id=${checkoutId}`
      );
      break;
    }

    case "orders/create": {
      if (payload.id == null || payload.id === "") {
        return new Response("Bad Request: missing order id", { status: 400 });
      }
      const orderId = String(payload.id);
      const orderNumber =
        payload.order_number != null
          ? String(payload.order_number)
          : typeof payload.name === "string"
            ? payload.name
            : undefined;
      const email =
        typeof payload.email === "string"
          ? payload.email
          : typeof payload.contact_email === "string"
            ? payload.contact_email
            : null;
      const totalPrice =
        payload.total_price != null ? String(payload.total_price) : undefined;
      const currency =
        typeof payload.currency === "string" ? payload.currency : undefined;
      const lineItemsCount = Array.isArray(payload.line_items)
        ? payload.line_items.length
        : undefined;

      await mailyteProvider.sendOrderCompleted({
        orderId,
        orderNumber,
        email,
        totalPrice,
        currency,
        lineItemsCount,
      });

      console.info(
        `[webhook] topic=orders/create status=processed id=${orderId}`
      );
      break;
    }

    case "products/update": {
      if (payload.id == null && payload.handle == null) {
        return new Response("Bad Request: missing product id or handle", {
          status: 400,
        });
      }
      const productId = String(payload.id ?? "");
      const handle =
        typeof payload.handle === "string" ? payload.handle : undefined;

      if (handle) {
        revalidatePath(`/human/products/${handle}`);
        revalidatePath(`/pet/products/${handle}`);
      }
      revalidatePath("/human/shop");
      revalidatePath("/pet/dogs");
      revalidatePath("/pet/cats");
      revalidatePath("/pet/horses");
      revalidatePath("/");

      console.info(
        `[webhook] topic=products/update status=revalidated id=${productId}`
      );
      break;
    }

    default: {
      console.info(`[webhook] topic=${topic || "unknown"} status=ignored`);
      break;
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
