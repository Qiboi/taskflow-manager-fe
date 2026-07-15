import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
            <h1 className="text-3xl font-bold">404</h1>
            <p className="text-slate-600">Halaman tidak ditemukan.</p>
            <Link
                to="/dashboard"
                className="rounded-xl bg-slate-900 px-4 py-2 text-white"
            >
                Kembali
            </Link>
        </div>
    );
}