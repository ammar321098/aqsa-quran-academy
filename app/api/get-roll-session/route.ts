// app/api/get-roll-session/route.ts
import { NextRequest } from "next/server";
import { getRollSession } from "@/lib/get-roll-session";

export async function GET(req: NextRequest) {
  const session = await getRollSession();
  return new Response(JSON.stringify(session), { status: 200 });
}
