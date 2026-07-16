import type { Project } from '@/types/project';
import type { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, X, Plus, FolderOpen } from 'lucide-react';

interface ProjectSidebarProps {
  projects: Project[];
  tasks: Task[] | undefined;
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

export function ProjectSidebar({
  projects,
  tasks,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onEditProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const countForProject = (id: string | null) =>
    (tasks ?? []).filter((t) => t.projectId === id).length;

  const totalCount = (tasks ?? []).length;

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-3">
      <div className="mb-1 flex items-center justify-between px-1 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
          Projects
        </h2>
        <Button
          onClick={onAddProject}
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs font-medium text-sidebar-primary hover:bg-sidebar-primary/10 hover:text-sidebar-primary"
        >
          <Plus className="size-3.5" />
          Baru
        </Button>
      </div>

      <nav className="space-y-0.5">
        <button
          onClick={() => onSelectProject(null)}
          className={
            'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ' +
            (activeProjectId === null
              ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
              : 'text-sidebar-foreground hover:bg-sidebar-accent')
          }
        >
          <span className="flex items-center gap-2">
            <FolderOpen className="size-4 opacity-70" />
            All Projects
          </span>
          <Badge
            variant="secondary"
            className={activeProjectId === null ? 'bg-white/20 text-current hover:bg-white/20' : ''}
          >
            {totalCount}
          </Badge>
        </button>
      </nav>

      <div className="my-3 h-px bg-sidebar-border" />

      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {projects.map((project) => (
          <div
            key={project.id}
            className={
              'group flex items-center rounded-md text-sm transition-colors ' +
              (activeProjectId === project.id ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50')
            }
          >
            <button
              onClick={() => onSelectProject(project.id)}
              className="flex flex-1 items-center gap-2 truncate px-3 py-2 text-left"
            >
              <span
                className="size-2.5 shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-sidebar"
                style={{ backgroundColor: project.color, boxShadow: `0 0 0 1px ${project.color}33` }}
              />
              <span className="truncate font-medium text-sidebar-foreground">{project.name}</span>
              {project.clientName && (
                <span className="truncate text-xs text-sidebar-foreground/50">
                  · {project.clientName}
                </span>
              )}
              <Badge variant="secondary" className="ml-auto shrink-0">
                {countForProject(project.id)}
              </Badge>
            </button>

            <div className="hidden shrink-0 items-center gap-0.5 pr-2 group-hover:flex">
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                onClick={() => onEditProject(project)}
                aria-label={`Edit project ${project.name}`}
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-sidebar-foreground/50 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDeleteProject(project)}
                aria-label={`Hapus project ${project.name}`}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <p className="px-3 py-6 text-center text-xs text-sidebar-foreground/50">
            Belum ada project.
          </p>
        )}
      </nav>
    </aside>
  );
}