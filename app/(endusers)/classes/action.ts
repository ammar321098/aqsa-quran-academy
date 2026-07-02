"use server";

import { requireStudent } from "@/app/data/user/requireStudent";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { ApiResponse } from "@/lib/types";
import { redirect } from "next/navigation";

export async function enrollInClassroomAction(
  classroomId: string,
): Promise<ApiResponse> {
  const user = await requireStudent();


  const PKR_TO_USD_RATE = 280;

  try {
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      select: { id: true, title: true, price: true, isFree: true, slug: true },
    });

    if (!classroom) {
      return { status: "error", message: "Classroom not found" };
    }

    // FREE CLASSROOM
    if (classroom.isFree) {
      await prisma.enrolment.upsert({
        where: {
          classroomId_userId: { classroomId: classroom.id, userId: user.id },
        },
        update: {
          status: "Active",
          amount: 0,
          updatedAt: new Date(),
        },
        create: {
          classroomId: classroom.id,
          userId: user.id,
          status: "Active",
          amount: 0,
        },
      });

      await prisma.classroomMember.upsert({
        where: {
          classroomId_userId: { classroomId: classroom.id, userId: user.id },
        },
        update: { status: "PENDING" },
        create: {
          classroomId: classroom.id,
          userId: user.id,
          status: "PENDING",
        },
      });

      return { status: "success", message: "Enrolled in free classroom" };
    }

    // PAID CLASSROOM
    const usdPrice = Number((classroom.price / PKR_TO_USD_RATE).toFixed(2));

    const enrolment = await prisma.enrolment.upsert({
      where: { courseId_userId: { courseId: classroom.id, userId: user.id } },
      update: {
        amount: classroom.price,
        status: "Pending",
        updatedAt: new Date(),
        classroomId: classroom.id,
      },
      create: {
        userId: user.id,
        courseId: classroom.id,
        amount: classroom.price,
        status: "Pending",
        classroomId: classroom.id,
      },
    });

    await prisma.classroomMember.upsert({
      where: {
        classroomId_userId: { classroomId: classroom.id, userId: user.id },
      },
      update: { status: "PENDING" },
      create: { classroomId: classroom.id, userId: user.id, status: "PENDING" },
    });

    // Redirect to 2Checkout for payment
    const baseUrl = "https://www.2checkout.com/checkout/purchase";
    const params: Record<string, string> = {
      sid: env.TWOCHECKOUT_MERCHANT_CODE,
      mode: "2CO",
      li_0_name: classroom.title,
      li_0_price: usdPrice.toFixed(2),
      li_0_quantity: "1",
      merchant_order_id: enrolment.id,
      x_receipt_link_url: `${env.PUBLIC_APP_URL}/payment/success`,
      demo: env.TWOCHECKOUT_TEST_MODE === "true" ? "Y" : "N",
    };

    redirect(`${baseUrl}?${new URLSearchParams(params).toString()}`);
  } catch (error) {
    console.error("Enroll Error:", error);
    return { status: "error", message: "Failed to enroll" };
  }
}
