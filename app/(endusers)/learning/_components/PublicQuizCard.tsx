"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useConstructUrl } from "@/hooks/use-contstruct-url";
import { Copy, Download, FileQuestion, ListChecks, Share2 } from "lucide-react";
import Image from "next/image";
import type { StandaloneQuizItem } from "@/app/data/user/get-standalone-quizzes";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";

type Props = {
  quiz: StandaloneQuizItem;
};

export function PublicQuizCard({ quiz }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const [shareQuizId, setShareQuizid] = useState<string | null>(null);
  const thumbnailUrl = useConstructUrl(quiz.thumbnailKey ?? "");

  // url for copy and share
  const url =
    typeof window !== "undefined" && shareQuizId
      ? `${window.location.origin}/quizzes/${shareQuizId}`
      : "";

  useEffect(() => {
    if (shareQuizId) setIsOpen(true);
  }, [shareQuizId]);

  const downnloadQR = () => {
    setTimeout(() => {
      const canvas = qrRef.current?.querySelector("canvas");

      if (!canvas) {
        toast.error("QR not ready yet...");
        return;
      }

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `quiz-${shareQuizId}.png`;
      link.click();
    }, 150);
  };

  return (
    <>
      <Card className="overflow-hidden flex flex-col group relative">
        <Badge className="absolute top-2 right-2 z-10 bg-primary">Quiz</Badge>
        {quiz.thumbnailKey ? (
          <div className="relative aspect-video w-full bg-muted">
            <Image
              src={thumbnailUrl}
              alt={quiz.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-muted flex items-center justify-center">
            <FileQuestion className="size-12 text-muted-foreground/50" />
          </div>
        )}
        <CardHeader className="pb-2">
          <CardTitle className="text-base line-clamp-2">
            <div className="flex justify-between">
              <Link
                href={`/quizzes/${quiz.id}`}
                className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
              >
                {quiz.title}
              </Link>

              <button
                onClick={() => {
                  setShareQuizid(quiz.id);
                  setIsOpen(true);
                }}
                className="rounded-md p-2 hover:bg-muted transition-colors"
                aria-label="Share course"
              >
                <Share2 className="size-5 text-muted-foreground hover:text-primary" />
              </button>
            </div>
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {quiz.smallDescription ??
              "View details and enroll to take this quiz."}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto pt-0">
          <Button asChild variant="default" className="w-full" size="sm">
            <Link href={`/quizzes/${quiz.id}`}>View & Enroll</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Dialogue for copy and share quiz */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Share Quiz</DialogTitle>
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
                try {
                  await navigator.clipboard.writeText(url);
                  toast.success("Link copied!");
                } catch {
                  toast.error("Clipboard blocked — copy manually");
                }
              }}
            >
              Copy Link <Copy />
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
