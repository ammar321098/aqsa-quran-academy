import { PublicCourseCardSkeleton } from "./PublicCourseCard";

export default function PublicCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PublicCourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
