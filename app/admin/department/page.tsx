import { prisma } from "@/lib/db";
import DepartmentsClient from "./_components/DepartmentsClient";

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    orderBy: { id: "asc" },
  });

  return <DepartmentsClient departments={departments} />;
}
