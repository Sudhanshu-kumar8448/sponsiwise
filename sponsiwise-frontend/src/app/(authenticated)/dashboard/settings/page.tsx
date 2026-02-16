import { getServerUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";

export const metadata = {
    title: "Settings | Sponsiwise",
    description: "Manage your account settings and security.",
};

export default async function SettingsPage() {
    const user = await getServerUser();
    if (!user) redirect("/login");

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Manage your account settings and security.
                </p>
            </div>

            {/* Profile Information */}
            <div className="rounded-xl bg-white p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-900">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Your account details are shown below.
                </p>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
                            Email
                        </label>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                            {user.email}
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
                            Role
                        </label>
                        <span className="mt-1 inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-800">
                            {user.role}
                        </span>
                    </div>

                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
                            Account Status
                        </label>
                        <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-800">
                            Active
                        </span>
                    </div>

                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wider text-gray-500">
                            Tenant ID
                        </label>
                        <p className="mt-1 truncate text-sm font-mono text-gray-600">
                            {user.tenant_id}
                        </p>
                    </div>
                </div>
            </div>

            {/* Change Password */}
            <div className="rounded-xl bg-white p-6 shadow">
                <h2 className="text-lg font-semibold text-gray-900">
                    Change Password
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Update your password to keep your account secure.
                </p>

                <div className="mt-6">
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}
