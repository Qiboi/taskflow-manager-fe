import type { Project } from '../../types/project';
import type { Task } from '../../types/task';

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
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Projects
        </h2>
        <button
          onClick={onAddProject}
          className="rounded-md px-1.5 py-0.5 text-xs font-medium text-brand-600 hover:bg-brand-50"
          aria-label="Tambah project baru"
        >
          + Baru
        </button>
      </div>

      <nav className="space-y-1">
        <button
          onClick={() => onSelectProject(null)}
          className={
            'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ' +
            (activeProjectId === null
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100')
          }
        >
          <span>All Projects</span>
          <span
            className={
              'rounded-full px-1.5 py-0.5 text-xs ' +
              (activeProjectId === null ? 'bg-white/20' : 'bg-slate-100 text-slate-500')
            }
          >
            {totalCount}
          </span>
        </button>

        {projects.map((project) => (
          <div
            key={project.id}
            className={
              'group flex items-center rounded-lg text-sm transition ' +
              (activeProjectId === project.id ? 'bg-slate-100' : 'hover:bg-slate-50')
            }
          >
            <button
              onClick={() => onSelectProject(project.id)}
              className="flex flex-1 items-center gap-2 truncate px-3 py-2 text-left"
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span className="truncate text-slate-700">{project.name}</span>
              {project.clientName && (
                <span className="truncate text-xs text-slate-400">· {project.clientName}</span>
              )}
              <span className="ml-auto shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                {countForProject(project.id)}
              </span>
            </button>

            <div className="hidden shrink-0 items-center gap-0.5 pr-2 group-hover:flex">
              <button
                onClick={() => onEditProject(project)}
                className="rounded px-1.5 py-1 text-xs text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                aria-label={`Edit project ${project.name}`}
              >
                ✎
              </button>
              <button
                onClick={() => onDeleteProject(project)}
                className="rounded px-1.5 py-1 text-xs text-slate-400 hover:bg-red-100 hover:text-red-600"
                aria-label={`Hapus project ${project.name}`}
              >
                ✕
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <p className="px-3 py-2 text-xs text-slate-400">Belum ada project.</p>
        )}
      </nav>
    </aside>
  );
}
