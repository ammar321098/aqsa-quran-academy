import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

export default function NotAdmin() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="bg-destructive/10 rounded-full p-4 w-fit mx-auto">
            <ShieldX className="size-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl mx-auto">Access Restricted</CardTitle>
          <CardDescription className="max-w-xs mx-auto text-center">
            {" "}
            Hey! You&apos;re not an admin, which means you can&apos;t create any
            course or stuff like that...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/"
            className={buttonVariants({
              variant: "outline",
              className: "w-full",
            })}
          >
            <ArrowLeft className="mr-1 size-4" />
            Back To Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
