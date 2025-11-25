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
      You are a professional project manager. 
      Rewrite the following task description to be more clear, actionable, and professional.
      
      Task Title: ${title}
      Current Description: ${description || "No description provided."}
      
      Return only the improved description text, no conversational filler.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const improvedDescription = completion.choices[0].message.content;

    return NextResponse.json({ suggestion: improvedDescription });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}
