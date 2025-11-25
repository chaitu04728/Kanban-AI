import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  const user = session.user;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="text-sm text-gray-500">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Profile Information
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {user?.image ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <span className="text-2xl font-semibold">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {user?.name || "User"}
                </h3>
                <p className="text-sm text-gray-500">Personal Account</p>
              </div>
            </div>

            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <User className="mr-2 h-4 w-4 text-gray-400" />
                  Full name
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {user?.name}
                </dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <Mail className="mr-2 h-4 w-4 text-gray-400" />
                  Email address
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {user?.email}
                </dd>
              </div>
              <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="flex items-center text-sm font-medium leading-6 text-gray-900">
                  <Shield className="mr-2 h-4 w-4 text-gray-400" />
                  Role
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 capitalize">
                  {(user as any)?.role || "User"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-100 bg-red-50 px-6 py-4">
          <h2 className="text-base font-semibold leading-7 text-red-900">
            Danger Zone
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Sign out</h3>
              <p className="text-sm text-gray-500">
                Sign out of your account on this device.
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
