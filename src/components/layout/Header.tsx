interface HeaderProps {
  onLogout: () => void;
  onAddTask: () => void;
}

export function Header({ onLogout, onAddTask }: HeaderProps) {
  return (
    <header className="mb-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-slate-900">TaskFlow Manager</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={onAddTask}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
        >
          + Tugas Baru
        </button>
        <button
          onClick={onLogout}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
        >
          Keluar
        </button>
      </div>
    </header>
  );
}
