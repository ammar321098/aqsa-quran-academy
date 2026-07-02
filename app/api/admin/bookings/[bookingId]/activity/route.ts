import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  await params; // validate dynamic segment exists
  return Response.json({ activity: [] });
}
