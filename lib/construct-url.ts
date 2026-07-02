import { env } from "@/lib/env";

export function constructFileUrl(key: string): string {
  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${key}`;
}

export function constructQuizThumbnailUrl(key: string): string {
  return constructFileUrl(key);
}
