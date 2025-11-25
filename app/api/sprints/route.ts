import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Sprint from "@/models/Sprint";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");

    if (!boardId) {
      return NextResponse.json({ error: "Board ID is required" }, { status: 400 });
    }

    await connectDB();
    const sprints = await Sprint.find({ boardId }).sort({ startDate: 1 });
    return NextResponse.json(sprints);
  } catch (error) {
    console.error("Error fetching sprints:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, startDate, endDate, boardId, goal } = body;

    if (!name || !startDate || !endDate || !boardId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();
    
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "viewer") {
      return NextResponse.json({ error: "Viewers cannot create sprints" }, { status: 403 });
    }

    const newSprint = await Sprint.create({
      name,
      startDate,
      endDate,
      boardId,
      goal,
      status: "planned",
    });

    return NextResponse.json(newSprint, { status: 201 });
  } catch (error) {
    console.error("Error creating sprint:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
