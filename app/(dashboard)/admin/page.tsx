import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AdminPageClient from "./AdminPageClient";

async function getUsers() {
  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(users));
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }

  await connectDB();
  const currentUser = await User.findOne({ email: session.user?.email });

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/unauthorized");
  }

  const users = await getUsers();

  return <AdminPageClient initialUsers={users} />;
}
