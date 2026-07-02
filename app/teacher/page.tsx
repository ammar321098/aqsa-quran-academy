import { EmptyState } from "@/components/general/EmptyState";

import { getAssignedClasses } from "../data/teacher/get-assigned-classes";
import { TeacherClassCard } from "./_components/TeacherClassCard";

export default async function DashboardPage() {
  const assignedClasses = await getAssignedClasses();

  return (
    <>
      <div className="flex flex-col gap-2 px-4 lg:px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Teacher Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your classes progress and manage it.
          </p>
          <div className="h-px bg-border my-4" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-center">Assigned Classes</h1>
          <p className="text-muted-foreground text-center">
            Here you can see all the courses you have access to
          </p>
        </div>
      </div>
      {assignedClasses.length === 0 ? (
        <div className="px-4 lg:px-6">
          <EmptyState
            title="No Assigned Classes"
            description="You haven't assigned any class yet."
            buttonText="Back To Home"
            href="/"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 lg:px-6">
          {assignedClasses.map((cls, idx) => (
            <TeacherClassCard key={idx} classroom={cls} />
          ))}
        </div>
      )}
    </>
  );
}
