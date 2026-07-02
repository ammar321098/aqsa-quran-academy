// app/dashboard/_components/EnrolledClassCard.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function EnrolledClassCard({ data }: any) {
  const classroom = data.classroom;

  return (
    <Card className="overflow-hidden rounded-xl hover:shadow-md transition dark:bg-zinc-900 p-0">
      {/* Header */}
      <div className="relative h-30 bg-emerald-600">
        <h1 className="absolute top-4 left-4 z-10 text-white text-2xl leading-tight max-w-[70%]">
          {classroom?.title}
        </h1>

        <Image
          src="/coverpage.jpg"
          alt="Class cover"
          fill
          className="object-cover"
        />

        {/* Teacher */}
        <div className="absolute -bottom-10 left-4 z-10">
          <Badge
            className="ml-auto block w-fit"
            variant={classroom?.isActive ? "default" : "destructive"}
          >
            {classroom?.isActive ? "Active" : "Ended"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="space-y-2 mt-7">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {classroom?.description ?? "No description available"}
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="w-full py-5">
        <Link
          href={`/dashboard/classroom/${classroom?.id}`}
          className={buttonVariants({ className: "w-full" })}
        >
          Enter Classroom
        </Link>
      </CardFooter>
    </Card>
  );
}
