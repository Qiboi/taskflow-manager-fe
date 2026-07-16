import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilterStore } from '../store/filterStore';
import { useSelectionStore } from '../store/selectionStore';
import { useActiveProjectStore } from '../store/activeProjectStore';
import { useLogout } from '../hooks/useAuth';
import {
    useBulkDeleteTasks,
    useBulkUpdateTasks,
    useCreateTask,
    useDeleteTask,
    useFilteredTasks,
    useTasksQuery,
    useUpdateTask,
} from '../hooks/useTasks';
import {
    useCreateProject,
    useDeleteProject,
    useProjectsQuery,
    useUpdateProject,
} from '../hooks/useProjects';
import { useToast } from '../components/ui/ToastProvider';
import { Header } from '../components/layout/Header';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm, type TaskFormValues } from '../components/tasks/TaskForm';
import { BulkActionsBar } from '../components/tasks/BulkActionsBar';
import { ProjectSidebar } from '../components/projects/ProjectSidebar';
import { ProjectForm, type ProjectFormValues } from '../components/projects/ProjectForm';
import type { Task } from '../types/task';
import type { Project } from '../types/project';

export function DashboardPage() {
    const navigate = useNavigate();
    const logout = useLogout();
    const { showToast } = useToast();

    const { status, keyword, setStatus, setKeyword } = useFilterStore();
    const { selectedIds, clear: clearSelection } = useSelectionStore();
    const { activeProjectId, setActiveProjectId } = useActiveProjectStore();

    const handleSelectProject = (id: string | null) => {
        setActiveProjectId(id);
        clearSelection();
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
                },
                {
                    onSuccess: () => {
                        showToast('Tugas berhasil diperbarui', 'success');
                        closeTaskForm();
                    },
                    onError: () => showToast('Gagal memperbarui tugas.', 'error'),
                }
            );
        } else {
            createTaskMutation.mutate(
                { title: values.title, description: values.description, projectId: values.projectId },
                {
                    onSuccess: () => {
                        showToast('Tugas berhasil ditambahkan', 'success');
                        closeTaskForm();
                    },
                    onError: () => showToast('Gagal menambahkan tugas.', 'error'),
                }
            );
        }
    };

    const handleToggleComplete = (task: Task) => {
        updateTaskMutation.mutate(
            { id: task.id, completed: !task.completed },
            { onError: () => showToast('Gagal memperbarui status tugas.', 'error') }
        );
    };

    const handleDeleteTask = (task: Task) => {
        if (!window.confirm(`Hapus tugas "${task.title}"?`)) return;
        deleteTaskMutation.mutate(task.id, {
            onSuccess: () => showToast('Tugas dihapus', 'success'),
            onError: () => showToast('Gagal menghapus tugas.', 'error'),
        });
    };

    const handleBulkComplete = () => {
        bulkUpdateMutation.mutate(
            { ids: Array.from(selectedIds), changes: { completed: true } },
            {
                onSuccess: () => {
                    showToast(`${selectedIds.size} tugas ditandai selesai`, 'success');
                    clearSelection();
                },
                onError: () => showToast('Gagal memperbarui tugas terpilih.', 'error'),
            }
        );
    };

    const handleBulkDelete = () => {
        if (!window.confirm(`Hapus ${selectedIds.size} tugas terpilih?`)) return;
        bulkDeleteMutation.mutate(Array.from(selectedIds), {
            onSuccess: () => {
                showToast(`${selectedIds.size} tugas dihapus`, 'success');
                clearSelection();
            },
            onError: () => showToast('Gagal menghapus tugas terpilih.', 'error'),
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
                        showToast('Project berhasil diperbarui', 'success');
                        closeProjectForm();
                    },
                    onError: () => showToast('Gagal memperbarui project.', 'error'),
                }
            );
        } else {
            createProjectMutation.mutate(values, {
                onSuccess: () => {
                    showToast('Project berhasil dibuat', 'success');
                    closeProjectForm();
                },
                onError: () => showToast('Gagal membuat project.', 'error'),
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
                showToast('Project dihapus', 'success');
                // Kalau project yang dihapus sedang aktif, kembali ke tampilan "All Projects".
                if (activeProjectId === project.id) {
                    setActiveProjectId(null);
                }
            },
            onError: () => showToast('Gagal menghapus project.', 'error'),
        });
    };

    const isBulkProcessing = bulkUpdateMutation.isPending || bulkDeleteMutation.isPending;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <ProjectSidebar
                projects={projects ?? []}
                tasks={tasks}
                activeProjectId={activeProjectId}
                onSelectProject={handleSelectProject}
                onAddProject={openCreateProjectForm}
                onEditProject={openEditProjectForm}
                onDeleteProject={handleDeleteProject}
            />

            <div className="flex-1 p-6">
                <Header onLogout={handleLogout} onAddTask={openCreateTaskForm} />

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
                                (status === s
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-white text-slate-600 ring-1 ring-slate-200')
                            }
                        >
                            {s === 'all' ? 'Semua' : s === 'active' ? 'Belum Selesai' : 'Selesai'}
                        </button>
                    ))}
                </div>

                <BulkActionsBar
                    selectedCount={selectedIds.size}
                    onComplete={handleBulkComplete}
                    onDelete={handleBulkDelete}
                    onClear={clearSelection}
                    isProcessing={isBulkProcessing}
                />

                {isLoading && <p className="text-sm text-slate-500">Memuat tugas...</p>}
                {isError && <p className="text-sm text-red-600">Gagal memuat tugas.</p>}

                {!isLoading && !isError && (
                    <TaskList
                        tasks={filtered}
                        onToggleComplete={handleToggleComplete}
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
