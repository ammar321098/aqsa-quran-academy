import { EmptyState } from "@/components/general/EmptyState";
import { PublicClassroomCard } from "./PublicClassCard";
import { getAllClasses } from "@/app/data/classes/get-all-classes";

export async function RenderClasses() {
  const classes = await getAllClasses();

  return (
    <>
      {/* All Courses View */}
      {classes.length === 0 ? (
        <EmptyState
          title="No Course Found"
          description="There are no courses available publically"
          buttonText="Go to Home"
          href="/"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {classes.map((cls: any) => (
            <PublicClassroomCard key={cls.id} classroom={cls} />
          ))}
        </div>
      )}
    </>
  );
}
