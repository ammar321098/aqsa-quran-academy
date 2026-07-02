import { PublicClassroomCardSkeleton } from "./PublicClassCard";

export default function PublicClassCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PublicClassroomCardSkeleton key={i} />
      ))}
    </div>
  );
}
