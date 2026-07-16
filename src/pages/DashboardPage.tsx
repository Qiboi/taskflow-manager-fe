import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useAuth';
import { useToast } from '../components/ui/ToastProvider';
import { useFilterStore } from '../store/filterStore';
import { useSelectionStore } from '../store/selectionStore';
import { useBulkDeleteTasks, useBulkUpdateTasks, useCreateTask, useDeleteTask, useFilteredTasks, useTasksQuery, useUpdateTask } from '../hooks/useTasks';
import type { Task } from '../types/task';
import { TaskForm, type TaskFormValues } from '../components/tasks/TaskForm';
import { Header } from '../components/layout/Header';
import { BulkActionsBar } from '../components/tasks/BulkActionsBar';
import { TaskList } from '../components/tasks/TaskList';

export function DashboardPage() {
    const navigate = useNavigate();
    const logout = useLogout();
    const { showToast } = useToast();

    const { status, keyword, setStatus, setKeyword } = useFilterStore();
    const { selectedIds, clear: clearSelection } = useSelectionStore();

    const { data: tasks, isLoading, isError } = useTasksQuery();
    const filtered = useFilteredTasks(tasks, status, keyword);

    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();
    const deleteTaskMutation = useDeleteTask();
    const bulkUpdateMutation = useBulkUpdateTasks();
    const bulkDeleteMutation = useBulkDeleteTasks();

    const [formOpen, setFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const openCreateForm = () => {
        setEditingTask(null);
        setFormOpen(true);
    };

    const openEditForm = (task: Task) => {
        setEditingTask(task);
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditingTask(null);
    };

    const handleFormSubmit = (values: TaskFormValues) => {
        if (editingTask) {
            updateTaskMutation.mutate(
                { id: editingTask.id, title: values.title, description: values.description },
                {
                    onSuccess: () => {
                        showToast('Tugas berhasil diperbarui', 'success');
                        closeForm();
                    },
                    onError: () => showToast('Gagal memperbarui tugas.', 'error'),
                }
            );
        } else {
            createTaskMutation.mutate(
                { title: values.title, description: values.description },
                {
                    onSuccess: () => {
                        showToast('Tugas berhasil ditambahkan', 'success');
                        closeForm();
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

    const handleDelete = (task: Task) => {
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

    const isBulkProcessing = bulkUpdateMutation.isPending || bulkDeleteMutation.isPending;

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <Header onLogout={handleLogout} onAddTask={openCreateForm} />

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
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                />
            )}

            {formOpen && (
                <TaskForm
                    initialTask={editingTask}
                    isSubmitting={createTaskMutation.isPending || updateTaskMutation.isPending}
                    onSubmit={handleFormSubmit}
                    onCancel={closeForm}
                />
            )}
        </div>
    );
}
