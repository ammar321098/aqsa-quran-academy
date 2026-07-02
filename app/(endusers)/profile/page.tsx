import { redirect } from "next/navigation";
import { requireUser } from "@/app/data/user/require-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Pencil } from "lucide-react";
import { ChangePassword } from "./_components/ChangePassword";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default async function ProfilePage() {
  const user = await requireUser();
  if (!user) redirect("/login");

  const profile = user.studentProfile || user.teacherProfile;

  const rollNumber = user.rollNumber || "Not Provided";
  const fullName = profile?.fullName || user.name || "Not Provided";
  const cnic = profile?.cnic || "Not Provided";
  const phone = profile?.phone || "Not Provided";
  const department = user.department?.name || "Not Provided";
  const address = profile?.address || "Not Provided";
  const role = user.role;
  const capitalizedRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "Not Provided";

  return (
    <div className="min-h-screen bg-background p-6 md:px-16">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Top Profile Card */}
        <div className="bg-card border rounded-2xl p-8 flex items-center justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-6 shadow-sm">
            <Avatar className="h-20 w-20 border-2 border-muted">
              {user.image ? (
                <AvatarImage src={user.image} className="object-cover" />
              ) : (
                <AvatarFallback className="text-4xl font-semibold">
                  {fullName?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {fullName}
              </h2>
              <Badge>{department}</Badge>
            </div>
          </div>
          <Link
            href={`/profile/${user.id}`}
            className={cn(buttonVariants(), "flex items-center px-5 py-1")}
          >
            <Edit size={16} />
            Edit
          </Link>
        </div>

        {/* Personal Information Card */}
        <div className="bg-card border rounded-2xl shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="font-semibold text-foreground">
              Personal Information
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 p-6 text-sm">
            <div>
              <p className="text-muted-foreground">CNIC</p>
              <p className="font-medium text-foreground">{cnic}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Roll #</p>
              <p className="font-medium text-foreground">{rollNumber}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">
                {user.email || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Full Name</p>
              <p className="font-medium text-foreground">{fullName}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Phone Number</p>
              <p className="font-medium text-foreground">{phone}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Role</p>
              <p className="font-medium text-foreground">{capitalizedRole}</p>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-card border rounded-2xl shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="font-semibold text-foreground">
              Address Information
            </h3>
          </div>

          <div className="p-6 text-sm">
            <p className="text-muted-foreground">Address</p>
            <p className="font-medium">{address}</p>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-card border rounded-2xl shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="font-semibold text-foreground">
              Security Information
            </h3>
          </div>

          <div className="grid  gap-8 p-6 text-sm">
            <ChangePassword hasPassword={!!user.password} />
          </div>
        </div>
      </div>
    </div>
  );
}
