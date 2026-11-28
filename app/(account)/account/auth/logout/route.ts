import type { NextRequest } from "next/server";
import { handleAuthLogoutRequest } from "@/lib/providers/live/account";

export async function GET(request: NextRequest) {
  return handleAuthLogoutRequest(request);
}
