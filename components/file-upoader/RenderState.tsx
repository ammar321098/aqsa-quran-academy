import { cn } from "@/lib/utils";
import { CloudUploadIcon, ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-primary/20 mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drag your file here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          click to upload
        </span>
      </p>
      <Button type="button" className="mt-4 hover:cursor-pointer">
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/20 mb-4">
        <ImageIcon className="size-6 text-destructive" />
      </div>

      <p className="text-base text-destructive font-semibold">Upload Failed</p>
      <p className="text-xs my-3 text-muted-foreground">Something went wrong</p>

      <Button type="button" onClick={onRetry}>
        Retry File Selection
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemovFile,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemovFile: () => void;
  fileType: "image" | "video";
}) {
  return (
    <div className="relative group w-full h-full flex items-center justify-center">
      {fileType === "video" ? (
        <video src={previewUrl} controls className="rounded-md w-full h-full" />
      ) : (
        <Image src={previewUrl} alt="Uploaded File" fill className="p-2" />
      )}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className={cn("absolute top-4 right-4 hover:cursor-pointer")}
        onClick={handleRemovFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex items-center justify-center flex-col">
      <p>{progress}</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
      <p className="mt-1 text-sx text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
