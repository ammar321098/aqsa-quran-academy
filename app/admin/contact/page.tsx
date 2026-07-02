import { requireAdmin } from "@/app/data/admin/require-admin";
import { getContactSubmissions } from "@/app/data/admin/get-contact-submissions";
import { ContactSubmissionsTable } from "./_components/ContactSubmissionsTable";

export default async function AdminContactPage() {
  await requireAdmin();
  const submissions = await getContactSubmissions();

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-primary">
            {" "}
            Contact submissions
          </h1>
          <p className="text-muted-foreground">
            View messages sent through the website contact form.{" "}
          </p>
        </div>{" "}
      </div>{" "}
      <div className="h-px bg-border" />
      <ContactSubmissionsTable submissions={submissions} />
    </div>
  );
}
