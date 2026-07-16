import { Button } from '@/components/ui/button';
import { Plus, LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  onAddTask: () => void;
}

export function Header({ onLogout, onAddTask }: HeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <span className="text-sm font-semibold">T</span>
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          TaskFlow Manager
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onAddTask} size="sm">
          <Plus className="size-4" />
          Tugas Baru
        </Button>
        <Button onClick={onLogout} variant="outline" size="sm">
          <LogOut className="size-4" />
          Keluar
        </Button>
      </div>
    </header>
  );
}