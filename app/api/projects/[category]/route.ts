import { NextResponse } from "next/server";
import { projects } from "@/generated/projects";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  const projectList =
    category in projects
      ? projects[category as keyof typeof projects]
      : [];

  return NextResponse.json(projectList, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}