import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useFilterStore } from '@/store/filterStore';
import { useSelectionStore } from '@/store/selectionStore';
import { useActiveProjectStore } from '@/store/activeProjectStore';
import { useLogout } from '@/hooks/useAuth';
import {
    useBulkDeleteTasks,
    useBulkUpdateTasks,
    useCreateTask,
    useDeleteTask,
    useFilteredTasks,
    useTasksQuery,
    useUpdateTask,
} from '@/hooks/useTasks';
import {
    useCreateProject,
    useDeleteProject,
    useProjectsQuery,
    useUpdateProject,
} from '@/hooks/useProjects';
import { Header } from '@/components/layout/Header';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm, type TaskFormValues } from '@/components/tasks/TaskForm';
import { BulkActionsBar } from '@/components/tasks/BulkActionsBar';
import { ProjectSidebar } from '@/components/projects/ProjectSidebar';
import { ProjectForm, type ProjectFormValues } from '@/components/projects/ProjectForm';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { nextStatus } from '@/lib/taskMeta';
import type { Task } from '@/types/task';
import type { Project } from '@/types/project';
import { Search, Loader2, AlertCircle, Menu, X } from 'lucide-react';

export function DashboardPage() {
    const navigate = useNavigate();
    const logout = useLogout();

    const { status, keyword, setStatus, setKeyword } = useFilterStore();
    const { selectedIds, clear: clearSelection } = useSelectionStore();
    const { activeProjectId, setActiveProjectId } = useActiveProjectStore();

    const handleSelectProject = (id: string | null) => {
        setActiveProjectId(id);
        clearSelection();
        setMobileSidebarOpen(false);
    };

    const { data: tasks, isLoading, isError } = useTasksQuery();
    const { data: projects } = useProjectsQuery();
    const filtered = useFilteredTasks(tasks, status, keyword, activeProjectId);

    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();
    const bulkUpdateMutation = useBulkUpdateTasks();
    const bulkDeleteMutation = useBulkDeleteTasks();

    const createProjectMutation = useCreateProject();
    const updateProjectMutation = useUpdateProject();
    const deleteProjectMutation = useDeleteProject();

    const [taskFormOpen, setTaskFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [projectFormOpen, setProjectFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ---------- Task form handlers ----------
    const openCreateTaskForm = () => {
        setEditingTask(null);
        setTaskFormOpen(true);
    };

    const openEditTaskForm = (task: Task) => {
        setEditingTask(task);
        setTaskFormOpen(true);
    };

    const closeTaskForm = () => {
        setTaskFormOpen(false);
        setEditingTask(null);
    };

    const handleTaskFormSubmit = (values: TaskFormValues) => {
        if (editingTask) {
            updateTaskMutation.mutate(
                {
                    id: editingTask.id,
                    title: values.title,
                    description: values.description,
                    projectId: values.projectId,
                    status: values.status,
                    dueDate: values.dueDate,
                    priority: values.priority,
                    difficulty: values.difficulty,
                },
                {
                    onSuccess: () => {
                        toast.success('Tugas berhasil diperbarui');
                        closeTaskForm();
                    },
                    onError: () => toast.error('Gagal memperbarui tugas.'),
                }
            );
        } else {
            createTaskMutation.mutate(
                {
                    title: values.title,
                    description: values.description,
                    projectId: values.projectId,
                    status: values.status,
                    dueDate: values.dueDate,
                    priority: values.priority,
                    difficulty: values.difficulty,
                },
                {
                    onSuccess: () => {
                        toast.success('Tugas berhasil ditambahkan');
                        closeTaskForm();
                    },
                    onError: () => toast.error('Gagal menambahkan tugas.'),
                }
            );
        }
    };

    const handleCycleStatus = (task: Task) => {
        updateTaskMutation.mutate(
            { id: task.id, status: nextStatus(task.status) },
            { onError: () => toast.error('Gagal memperbarui status tugas.') }
        );
    };

    const handleDeleteTask = (task: Task) => {
        if (!window.confirm(`Hapus tugas "${task.title}"?`)) return;
        deleteTaskMutation.mutate(task.id, {
            onSuccess: () => toast.success('Tugas dihapus'),
            onError: () => toast.error('Gagal menghapus tugas.'),
        });
    };

    const handleBulkComplete = () => {
        bulkUpdateMutation.mutate(
            { ids: Array.from(selectedIds), changes: { status: 'completed' } },
            {
                onSuccess: () => {
                    toast.success(`${selectedIds.size} tugas ditandai selesai`);
                    clearSelection();
                },
                onError: () => toast.error('Gagal memperbarui tugas terpilih.'),
            }
        );
    };

    const handleBulkDelete = () => {
        if (!window.confirm(`Hapus ${selectedIds.size} tugas terpilih?`)) return;
        bulkDeleteMutation.mutate(Array.from(selectedIds), {
            onSuccess: () => {
                toast.success(`${selectedIds.size} tugas dihapus`);
                clearSelection();
            },
            onError: () => toast.error('Gagal menghapus tugas terpilih.'),
        });
    };

    // ---------- Project handlers ----------
    const openCreateProjectForm = () => {
        setEditingProject(null);
        setProjectFormOpen(true);
    };

    const openEditProjectForm = (project: Project) => {
        setEditingProject(project);
        setProjectFormOpen(true);
    };

    const closeProjectForm = () => {
        setProjectFormOpen(false);
        setEditingProject(null);
    };

    const handleProjectFormSubmit = (values: ProjectFormValues) => {
        if (editingProject) {
            updateProjectMutation.mutate(
                { id: editingProject.id, ...values },
                {
                    onSuccess: () => {
                        toast.success('Project berhasil diperbarui');
                        closeProjectForm();
                    },
                    onError: () => toast.error('Gagal memperbarui project.'),
                }
            );
        } else {
            createProjectMutation.mutate(values, {
                onSuccess: () => {
                    toast.success('Project berhasil dibuat');
                    closeProjectForm();
                },
                onError: () => toast.error('Gagal membuat project.'),
            });
        }
    };

    const handleDeleteProject = (project: Project) => {
        if (
            !window.confirm(
                `Hapus project "${project.name}"? Tugas di dalamnya tidak akan terhapus, hanya dilepas ke "Tanpa Project".`
            )
        )
            return;

        deleteProjectMutation.mutate(project.id, {
            onSuccess: () => {
                toast.success('Project dihapus');
                if (activeProjectId === project.id) {
                    setActiveProjectId(null);
                }
            },
            onError: () => toast.error('Gagal menghapus project.'),
        });
    };

    const isBulkProcessing = bulkUpdateMutation.isPending || bulkDeleteMutation.isPending;

    return (
        <div className="flex min-h-screen bg-background">
            <div className="hidden md:sticky md:top-0 md:flex md:h-screen">
                <ProjectSidebar
                    projects={projects ?? []}
                    tasks={tasks}
                    activeProjectId={activeProjectId}
                    onSelectProject={handleSelectProject}
                    onAddProject={openCreateProjectForm}
                    onEditProject={openEditProjectForm}
                    onDeleteProject={handleDeleteProject}
                />
            </div>

            {mobileSidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    <button
                        aria-label="Tutup menu project"
                        onClick={() => setMobileSidebarOpen(false)}
                        className="absolute inset-0 bg-black/40"
                    />
                    <div className="relative z-50 flex h-full w-64 max-w-[80vw] animate-in slide-in-from-left duration-200">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileSidebarOpen(false)}
                            aria-label="Tutup menu project"
                            className="absolute right-2 top-2 z-10 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                        >
                            <X className="size-4" />
                        </Button>
                        <ProjectSidebar
                            projects={projects ?? []}
                            tasks={tasks}
                            activeProjectId={activeProjectId}
                            onSelectProject={handleSelectProject}
                            onAddProject={openCreateProjectForm}
                            onEditProject={openEditProjectForm}
                            onDeleteProject={handleDeleteProject}
                        />
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-x-hidden p-4 sm:p-6">
                <div className="mb-4 flex items-center gap-3 md:hidden">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setMobileSidebarOpen(true)}
                        aria-label="Buka menu project"
                    >
                        <Menu className="size-4" />
                    </Button>
                    <span className="text-sm font-medium text-muted-foreground">Projects</span>
                </div>

                <Header onLogout={handleLogout} onAddTask={openCreateTaskForm} />

                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Cari tugas..."
                            className="w-full pl-8"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'active', 'completed'] as const).map((s) => (
                            <Button
                                key={s}
                                size="sm"
                                variant={status === s ? 'default' : 'outline'}
                                onClick={() => setStatus(s)}
                            >
                                {s === 'all' ? 'Semua' : s === 'active' ? 'Belum Selesai' : 'Selesai'}
                            </Button>
                        ))}
                    </div>
                </div>

                <BulkActionsBar
                    selectedCount={selectedIds.size}
                    onComplete={handleBulkComplete}
                    onDelete={handleBulkDelete}
                    onClear={clearSelection}
                    isProcessing={isBulkProcessing}
                />

                {isLoading && (
                    <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Memuat tugas...
                    </div>
                )}
                {isError && (
                    <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        <AlertCircle className="size-4 shrink-0" />
                        Gagal memuat tugas.
                    </div>
                )}

                {!isLoading && !isError && (
                    <TaskList
                        tasks={filtered}
                        onCycleStatus={handleCycleStatus}
                        onEdit={openEditTaskForm}
                        onDelete={handleDeleteTask}
                    />
                )}
            </div>

            {taskFormOpen && (
                <TaskForm
                    initialTask={editingTask}
                    projects={projects ?? []}
                    defaultProjectId={activeProjectId}
                    isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
                    onSubmit={handleTaskFormSubmit}
                    onCancel={closeTaskForm}
                />
            )}

            {projectFormOpen && (
                <ProjectForm
                    initialProject={editingProject}
                    isSubmitting={createProjectMutation.isPending || updateProjectMutation.isPending}
                    onSubmit={handleProjectFormSubmit}
                    onCancel={closeProjectForm}
                />
            )}
        </div>
    );
}