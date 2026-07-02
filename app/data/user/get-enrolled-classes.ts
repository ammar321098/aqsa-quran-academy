// data/user/get-enrolled-classes.ts
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";

export async function getEnrolledClasses() {
  const user = await requireUser();

  return prisma.enrolment.findMany({
    where: {
      userId: user.id,
    },
    include: {
      classroom: {
        include: {
          teacher: true,
        },
      },
    },
  });
}
