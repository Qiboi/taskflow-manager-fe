import { useFilterStore } from '../store/filterStore';
import { useLogout } from '../hooks/useAuth';
import { useFilteredTasks, useTasksQuery } from '../hooks/useTasks';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
    const navigate = useNavigate();
    const logout = useLogout();
    const { status, keyword, setStatus, setKeyword } = useFilterStore();
    const { data: tasks, isLoading, isError } = useTasksQuery();
    const filtered = useFilteredTasks(tasks, status, keyword);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-slate-900">TaskFlow Manager</h1>
                <button
                    onClick={handleLogout}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
                >
                    Keluar
                </button>
            </header>

            <div className="mb-4 flex flex-wrap gap-2">
                <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Cari tugas..."
                    className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
                {(['all', 'active', 'completed'] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={
                            'rounded-lg px-3 py-2 text-sm ' +
                            (status === s ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200')
                        }
                    >
                        {s === 'all' ? 'Semua' : s === 'active' ? 'Belum Selesai' : 'Selesai'}
                    </button>
                ))}
            </div>

            {isLoading && <p className="text-sm text-slate-500">Memuat tugas...</p>}
            {isError && <p className="text-sm text-red-600">Gagal memuat tugas.</p>}

            <ul className="space-y-2">
                {filtered.map((task) => (
                    <li
                        key={task.id}
                        className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200"
                    >
                        <div>
                            <p className={task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}>
                                {task.title}
                            </p>
                            {task.description && (
                                <p className="text-xs text-slate-400">{task.description}</p>
                            )}
                        </div>
                        <span
                            className={
                                'rounded-full px-2 py-0.5 text-xs ' +
                                (task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')
                            }
                        >
                            {task.completed ? 'Selesai' : 'Berjalan'}
                        </span>
                    </li>
                ))}
            </ul>

            {!isLoading && filtered.length === 0 && (
                <p className="mt-6 text-center text-sm text-slate-400">Tidak ada tugas yang cocok.</p>
            )}

            <p className="mt-8 text-xs text-slate-400">
                Catatan: ini adalah dashboard sementara untuk membuktikan scaffold berjalan.
                CRUD lengkap, multi-select, dan bulk actions akan ditambahkan di tahap berikutnya.
            </p>
        </div>
    );
}
