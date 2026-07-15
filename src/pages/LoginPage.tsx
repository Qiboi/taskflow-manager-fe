import { useAuthStore } from "../store/auth.store";

export default function LoginPage() {
    const login = useAuthStore((state) => state.login);

    const handleLogin = () => {
        login({
            token: "mock-token-123",
            user: {
                id: "1",
                name: "TaskFlow User",
                email: "user@taskflow.dev",
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
                <h1 className="text-2xl font-semibold">TaskFlow Manager</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Offline mock login untuk tahap fondasi.
                </p>

                <button
                    onClick={handleLogin}
                    className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-800"
                >
                    Login Mock
                </button>
            </div>
        </div>
    );
}