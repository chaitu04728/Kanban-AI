import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { openai } from "@/lib/openai";
import Task from "@/models/Task";
import connectDB from "@/lib/db";

// We need a Comment model or we can store comments in the Task model.
// The README said "comments" collection, but let's check the Task model.
// The Task model doesn't have comments array in the schema I created earlier?
// Let's check Task.ts.

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
    // In a real app, we would fetch comments from a separate collection or embedded array
    // For now, let's assume we pass the comments in the body or fetch them if they existed
    // Since I haven't implemented Comments fully yet, I'll stub this to accept comments from body
    
    const { comments } = await req.json();

    if (!comments || !Array.isArray(comments) || comments.length === 0) {
       return NextResponse.json({ summary: "No comments to summarize." });
    }

    const commentsText = comments.map((c: any) => `${c.user}: ${c.text}`).join("\n");

    const prompt = `
      Summarize the following discussion thread into:
      1. Key Decisions
      2. Blockers
      3. Next Steps
      
      Comments:
      ${commentsText}
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const summary = completion.choices[0].message.content;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(
      { error: "Failed to summarize comments" },
      { status: 500 }
    );
  }
}
