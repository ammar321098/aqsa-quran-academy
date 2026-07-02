import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3 } from "@/lib/S3Client";
import { requireAdmin } from "@/app/data/admin/require-admin";

const fileUploadSchema = z.object({
  fileName: z.string().min(1, "File Name is required"),
  contentType: z.string().min(1, "Content type is required"),
  size: z.number().min(1, "Size is required"),
  isImage: z.boolean(),
});

export async function POST(req: Request) {
  // const session = await requireAdmin();

  try {
    // if (!session) {
    //   return NextResponse.json(
    //     { error: "User not authenticated" },
    //     { status: 429 }
    //   );
    // }

    const body = await req.json();
    const parsed = fileUploadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { fileName, contentType } = parsed.data;

    // Unique key inside the bucket
    const key = `${uuidv4()}-${fileName}`;

    // Create command WITHOUT ContentLength
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
      ContentType: contentType,
    });

    // Generate presigned URL
    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: 300 }); // 5 min

    return NextResponse.json({ presignedUrl, key });
  } catch (err) {
    console.error("Upload API Error:", err);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
