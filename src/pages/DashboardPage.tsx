import { useAuthStore } from "../store/auth.store";

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto max-w-5xl rounded-2xl border bg-white p-6 shadow-sm">
                <h1 className="text-3xl font-semibold">Dashboard</h1>
                <p className="mt-2 text-slate-600">
                    Halo, {user?.name ?? "User"}
                </p>
            </div>
        </div>
    );
}