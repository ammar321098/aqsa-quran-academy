import PublicClassCardSkeletonLayout from "@/app/(endusers)/classes/_components/PublicClassSkeletonLayout";
import { RenderClasses } from "@/app/(endusers)/classes/_components/RenderClasses";
import { Suspense } from "react";

export default function () {
  return (
    <div className="px-4 md:px-6 lg:px-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tighter">
          Explore Classes
        </h1>
        <p className="text-muted-foreground">
          Discover our wide range of classes designed to help you achieve your
          learning goals.
        </p>
      </div>

      <div className="h-px bg-border my-4" />

      <Suspense fallback={<PublicClassCardSkeletonLayout />}>
        <RenderClasses />
      </Suspense>
    </div>
  );
}
