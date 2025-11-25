import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { openai } from "@/lib/openai";
import Task from "@/models/Task";
import connectDB from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const task = await Task.findById(params.id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const { description, title } = task;
    const prompt = `
      You are a helpful project assistant.
      Generate a list of 3-7 actionable subtasks for the following task.
      
      Task Title: ${title}
      Description: ${description || ""}
      
      Return the response as a JSON array of strings. Example: ["Subtask 1", "Subtask 2"]
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content || '{"subtasks": []}');
    
    // Handle different potential JSON structures from LLM
    const subtasks = Array.isArray(parsed) ? parsed : parsed.subtasks || parsed.tasks || [];

    return NextResponse.json({ subtasks });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "Failed to generate subtasks" },
      { status: 500 }
    );
  }
}
