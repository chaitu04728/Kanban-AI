import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateReleaseNotes } from "@/lib/openai";
import Task from "@/models/Task";
import Sprint from "@/models/Sprint";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { sprintId } = await req.json();
    if (!sprintId) {
      return new NextResponse("Sprint ID is required", { status: 400 });
    }

    await connectDB();

    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      return new NextResponse("Sprint not found", { status: 404 });
    }

    const tasks = await Task.find({ sprintId });
    
    if (tasks.length === 0) {
      return new NextResponse("No tasks found in this sprint", { status: 400 });
    }

    const completedTasks = tasks.filter(t => t.status === "done" || t.status === "completed"); // Adjust status check based on your board columns
    // If no completed tasks, maybe generate notes for what was planned? 
    // Let's just send all tasks and let AI categorize them.

    const taskSummaries = tasks.map(t => ({
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      labels: t.labels
    }));

    const releaseNotes = await generateReleaseNotes(sprint.name, taskSummaries);

    return NextResponse.json({ releaseNotes });
  } catch (error) {
    console.error("[AI_RELEASE_NOTES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
