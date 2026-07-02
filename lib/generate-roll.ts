"use server";

import { prisma } from "@/lib/db";

export async function generateRollNumber(departmentId: number, role: number) {
  const year = new Date().getFullYear().toString().slice(-2);

  // Get last student in this department for this year
  const lastStudent = await prisma.user.findFirst({
    where: {
      rollNumber: {
        startsWith: `${year}${departmentId.toString().padStart(2, "0")}${role}`,
      },
    },
    orderBy: {
      rollNumber: "desc",
    },
    select: {
      rollNumber: true,
    },
  });

  let nextSequence = 1;

  if (lastStudent?.rollNumber) {
    const lastSeq = Number(lastStudent.rollNumber.slice(-3));
    nextSequence = lastSeq + 1;
  }

  const rollNumber =
    year +
    departmentId.toString().padStart(2, "0") +
    role +
    nextSequence.toString().padStart(3, "0");

  return rollNumber;
}
