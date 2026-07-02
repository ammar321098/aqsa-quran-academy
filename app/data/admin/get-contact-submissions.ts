import "server-only";
import { prisma } from "@/lib/db";

export async function getContactSubmissions() {
  const contact = (prisma as { contactSubmission?: typeof prisma.contactSubmission }).contactSubmission;
  if (!contact) {
    return [];
  }
  return contact.findMany({
    orderBy: { createdAt: "desc" },
  });
}
