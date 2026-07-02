"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verify2CheckoutINS } from "@/lib/2checkout";

export async function POST(req: Request) {
  const body = await req.text();
  const params = Object.fromEntries(new URLSearchParams(body)) as Record<
    string,
    string
  >;

  const isValid = verify2CheckoutINS(params);

  if (!isValid) {
    console.error("Invalid 2Checkout INS signature", params);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const enrolmentId = params.merchant_order_id;
  const status = params.invoice_status?.toLowerCase();

  if (!enrolmentId) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  try {
    if (["deposited", "approved", "completed"].includes(status)) {
      await prisma.enrolment.update({
        where: { id: enrolmentId },
        data: { status: "Active" },
      });
    }

    if (status === "refunded") {
      await prisma.enrolment.update({
        where: { id: enrolmentId },
        data: { status: "Cancelled" },
      });
    }
  } catch (err) {
    console.error("Enrollment update failed:", err);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
