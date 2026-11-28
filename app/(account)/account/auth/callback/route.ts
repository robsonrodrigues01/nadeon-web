import type { NextRequest } from "next/server";
import { handleAuthCallbackRequest } from "@/lib/providers/live/account";

export async function GET(request: NextRequest) {
  return handleAuthCallbackRequest(request);
}
