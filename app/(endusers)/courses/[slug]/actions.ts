"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { ApiResponse } from "@/lib/types";
import { redirect } from "next/navigation";

export async function enrollInCourseAction(
  courseId: string,
): Promise<ApiResponse> | never {
  const user = await requireUser();

  let checkoutUrl: string;
  const PKR_TO_USD_RATE = 280;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true, isFree: true, slug: true },
    });

    if (!course) {
      return { status: "error", message: "Course not found" };
    }

    // FREE COURSE
    if (course.isFree) {
      await prisma.enrolment.upsert({
        where: { courseId_userId: { courseId, userId: user.id } },
        update: { status: "Active", amount: 0, updatedAt: new Date() },
        create: { courseId, userId: user.id, status: "Active", amount: 0 },
      });

      // redirect straight to dashboard or course page
      return { status: "success", message: "Enrolled in free course" };
    }

    // Convert PKR → USD
    const usdPrice = Number((course.price / PKR_TO_USD_RATE).toFixed(2));

    const enrolment = await prisma.enrolment.upsert({
      where: {
        courseId_userId: { courseId, userId: user.id },
      },
      update: {
        amount: course.price,
        status: "Pending",
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        courseId,
        amount: course.price,
        status: "Pending",
      },
    });

    const baseUrl = "https://www.2checkout.com/checkout/purchase";

    const params: Record<string, string> = {
      sid: env.TWOCHECKOUT_MERCHANT_CODE,
      mode: "2CO",
      li_0_name: course.title,
      li_0_price: usdPrice.toFixed(2),
      li_0_quantity: "1",
      merchant_order_id: enrolment.id,
      x_receipt_link_url: `${env.PUBLIC_APP_URL}/payment/success`,
      demo: env.TWOCHECKOUT_TEST_MODE === "true" ? "Y" : "N",
    };

    checkoutUrl = `${baseUrl}?${new URLSearchParams(params).toString()}`;
  } catch (error) {
    console.error("Enroll Error:", error);
    return { status: "error", message: "Failed to enroll" };
  }

  redirect(checkoutUrl);
}
