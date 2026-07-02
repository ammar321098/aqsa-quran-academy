"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, Pencil, Share2, Trash2 } from "lucide-react";
import Image from "next/image";
import DeleteClassroom from "./DeleteClassroom";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";

export function AdminClassroomCard({ classroom }: { classroom: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // url for copy and share
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/dashboard/classroom/${classroom.id}`
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
    link.download = `${classroom.title}-qr.png`;
    link.click();
  };

  return (
    <>
    <Card className="overflow-hidden rounded-xl hover:shadow-md transition dark:bg-zinc-900 p-0">
      {/* Background Header */}
      <div className="relative h-30 bg-emerald-600">
        <div className="max-w-45">
          <h1 className="relative top-4 left-4 z-2 text-white text-2xl leading-tight">
            {classroom.title}
          </h1>
        </div>
        <Image
          src="/classCover.jpg"
          alt="Class cover"
          fill
          className="object-cover"
        />

        {/* Teacher Avatar */}
        <div className="absolute -bottom-10 left-4">
          {classroom.teacher?.image ? (
            <Image
              src={classroom.teacher.image}
              alt={classroom.teacher.name ?? "Teacher"}
              width={48}
              height={48}
              className="rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center text-lg font-semibold border-2 border-white">
              {classroom.teacher.teacherProfile?.fullName?.charAt(0) ?? "T"}
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-1">
            {classroom.teacher.teacherProfile?.fullName}
          </p>
        </div>
      </div>

      <CardContent className="space-y-1 px-4">
        <Badge
          variant={classroom.isActive ? "default" : "destructive"}
          className="relative -top-3 left-50"
        >
          {classroom.isActive ? "Active" : "Ended"}
        </Badge>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {classroom.description ? classroom.description : "N/A"}
        </p>
      </CardContent>

      <CardFooter className="border-t-2 p-2">
        <div className="flex gap-2">
          <Button variant="default" onClick={handleShare}>
            Share Class
            <Share2 className="size-4" />
          </Button>
          <Link href={`/admin/classes/${classroom.id}/edit`}>
            <Button variant="default" className="w-full">
              <Pencil className="w-4 h-4" />
            </Button>
          </Link>

          <DeleteClassroom classroomId={classroom.id} />
        </div>
        
      </CardFooter>
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
