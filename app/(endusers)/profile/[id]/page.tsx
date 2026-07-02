import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import EditUserForm from "./_components/EdirUserForm";
// import EditUserForm from "./_components/edit-user-form";

interface iAppProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: iAppProps) {
  const { id } = await params;

  const sessionUser = await requireUser();
  if (!sessionUser) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      studentProfile: true,
      teacherProfile: true,
    },
  });

  if (!user) redirect("/dashboard");

  return (
    <div className="bg-background p-6 my-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-8">Edit Profile</h1>

        <EditUserForm user={user} />
      </div>
    </div>
  );
}
