// /api/enrolment/status/route.ts
"use server";

import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const enrolment = await prisma.enrolment.findUnique({ where: { id } });
  if (!enrolment) return new Response("Not found", { status: 404 });

  return new Response(JSON.stringify({ status: enrolment.status }), {
    status: 200,
  });
}
