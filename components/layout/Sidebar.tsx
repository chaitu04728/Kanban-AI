"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListTodo,
  Settings,
  LogOut,
  Bell,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "../ThemeToggle";

const navigation = [
  { name: "Boards", href: "/boards", icon: LayoutDashboard },
  { name: "Sprints", href: "/sprint", icon: ListTodo },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="flex h-16 items-center justify-between border-b dark:border-gray-800 px-6">
        <div className="flex items-center">
          <LayoutDashboard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
            AI Kanban
          </span>
        </div>
        {/* <ThemeToggle /> */}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {item.name}
            </Link>
          );
        })}

        {/* Admin Link - Only visible to admins */}
        {(session?.user as any)?.role === "admin" && (
          <Link
            href="/admin"
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium",
              pathname.startsWith("/admin")
                ? "bg-blue-50 text-blue-700"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Shield
              className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                pathname.startsWith("/admin")
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-gray-500"
              )}
            />
            Admin
          </Link>
        )}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center">
          {session?.user?.image ? (
            <div className="relative h-9 w-9 overflow-hidden rounded-full">
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full bg-gray-200" />
          )}
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500">
              {session?.user?.email?.slice(0, 20)}...
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="mt-4 flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Sign out
        </button>
      </div>
    </div>
  );
}
