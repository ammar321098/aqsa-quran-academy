"use client";

import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-contstruct-url";
import { IconChartBar } from "@tabler/icons-react";
import {
  ArrowRightIcon,
  Copy,
  Download,
  Share,
  Share2,
  TimerIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";

interface iAppProps {
  data: PublicCourseType;
}

export function PublicCourseCard({ data }: iAppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const thumbnailUrl = useConstructUrl(data.fileKey);

  // url for copy and share
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/courses/${data.slug}`
      : "";

  const handleShare = async () => {
    try {
      setIsOpen(true);
    } catch (error) {
      toast.error("Failed to share");
    }
  };

  const downnloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");

    if (!canvas) {
      toast.error("QR not exists...");
      return;
    }

    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${data.title}-qr.png`;
    link.click();
  };

  return (
    <>
      <Card className="group relative py-0 gap-0">
        {data.isFree ? (
          <Badge className="bg-green-500 absolute top-2 right-2 z-10">
            Free
          </Badge>
        ) : (
          <Badge className="bg-red-500 absolute top-2 right-2 z-10">Paid</Badge>
        )}

        <Image
          width={600}
          height={400}
          src={thumbnailUrl}
          alt="Thumbnail Image"
          className="w-full rounded-t-xl aspect-video h-full object-cover"
          style={{ width: "100%", height: "auto" }}
        />

        <CardContent className="p-4">
          <div className="flex justify-between">
            <Link
              href={`/courses/${data.slug}`}
              className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
            >
              {data.title}
            </Link>

            <button
              onClick={handleShare}
              className="rounded-md p-2 hover:bg-muted transition-colors"
              aria-label="Share course"
            >
              <Share2 className="size-5 text-muted-foreground hover:text-primary" />
            </button>
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
            {data.smallDescription}
          </p>
          <div className="flex items-center gap-x-5 mt-5">
            <div className="flex items-center gap-x-2">
              <TimerIcon className="size-6 p-1 rounded-sm text-primary bg-primary/10" />
              <p className="text-sm text-muted-foreground">
                {data.duration} {data.duration === 1 ? "Day" : "Days"}
              </p>
            </div>
            <div className="flex items-center gap-x-2">
              <IconChartBar className="size-6 p-1 rounded-sm text-primary bg-primary/10" />
              <p className="text-sm text-muted-foreground">{data.level}</p>
            </div>
          </div>
          <Link
            href={`/courses/${data.slug}`}
            className={buttonVariants({
              className: "w-full mt-4",
            })}
          >
            Learn More <ArrowRightIcon className="size-4" />
          </Link>{" "}
        </CardContent>
      </Card>

      {/* Dialogue for copy and share course */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Share Course</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            {/* QR Code */}
            <div ref={qrRef} className="bg-white p-2">
              <QRCodeCanvas value={url} size={180} level="H" />
            </div>

            {/* Course URL */}
            <p className="text-xs text-muted-foreground text-center break-all">
              {url}
            </p>

            {/* Copy Button */}
            <Button
              className="w-full"
              onClick={async () => {
                await navigator.clipboard.writeText(url);
                toast.success("Link copied!");
              }}
            >
              Copy Link <Copy/>
            </Button>

            <Button variant="outline" className="w-full" onClick={downnloadQR}>
              Download QR <Download />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function PublicCourseCardSkeleton() {
  const skeletonBase = "bg-neutral-300 dark:bg-neutral-800 animate-pulse";
  return (
    <Card className="group relative py-0 gap-0">
      {/* Badge placeholder */}
      <Skeleton
        className={`absolute top-2 right-2 z-10 h-6 w-16 rounded-full ${skeletonBase}`}
      />

      {/* Thumbnail */}
      <Skeleton
        className={`w-full aspect-video rounded-t-xl ${skeletonBase}`}
      />

      <CardContent className="p-4">
        {/* Title */}
        <Skeleton className={`h-6 w-3/4 ${skeletonBase}`} />

        {/* Description */}
        <div className="space-y-2 mt-3">
          <Skeleton className={`h-4 w-full ${skeletonBase}`} />
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-x-5 mt-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className={`size-6 rounded-sm ${skeletonBase}`} />
            <Skeleton className={`h-4 w-16 ${skeletonBase}`} />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className={`size-6 rounded-sm ${skeletonBase}`} />
            <Skeleton className={`h-4 w-20 ${skeletonBase}`} />
          </div>
        </div>

        {/* Button */}
        <Skeleton className={`h-10 w-full mt-4 rounded-md ${skeletonBase}`} />
      </CardContent>
    </Card>
  );
}
