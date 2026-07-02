// app/api/signout-roll/route.ts
import { signOutRoll } from "@/lib/SignoutRoll";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const res = await signOutRoll();
  return new Response(JSON.stringify(res), { status: 200 });
}
