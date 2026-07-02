import { requireAdmin } from "@/app/data/admin/require-admin";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  try {
    if (!session) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const key = body.key;

    if (!key || typeof key !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid key" },
        { status: 400 }
      );
    }

    const bucket = process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES;

    await S3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
