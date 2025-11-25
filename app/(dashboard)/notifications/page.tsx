import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { Bell, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

async function getNotifications() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return [];

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return [];

  const notifications = await Notification.find({ userId: user._id }).sort({
    createdAt: -1,
  });
  return JSON.parse(JSON.stringify(notifications));
}

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }

  const notifications = await getNotifications();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Notifications
        </h1>
        <p className="text-sm text-gray-500">
          Stay updated with your project activity.
        </p>
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification: any) => (
            <div
              key={notification._id}
              className={`flex items-start gap-4 rounded-lg border p-4 ${
                notification.read ? "bg-white" : "bg-blue-50 border-blue-100"
              }`}
            >
              <div className="mt-1">
                {notification.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : notification.type === "warning" ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                ) : notification.type === "error" ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Info className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {notification.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <div className="h-2 w-2 rounded-full bg-blue-600" />
              )}
            </div>
          ))
        ) : (
          <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center">
            <Bell className="mx-auto h-8 w-8 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
