import { NextResponse } from "next/server";
import { projects } from "@/generated/projects";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  const projectList =
    category in projects
      ? projects[category as keyof typeof projects]
      : [];

  return NextResponse.json(projectList);
}