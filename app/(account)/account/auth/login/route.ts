import type { NextRequest } from "next/server";
import { handleAuthLoginRequest } from "@/lib/providers/live/account";

export async function GET(request: NextRequest) {
  return handleAuthLoginRequest(request);
}
