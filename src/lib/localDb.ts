import type { Task } from "../types/task";

const DB_KEY = 'taskflow_db_tasks';

function seedTasks(): Task[] {
    const now = new Date().toISOString();
    return [
        {
            id: crypto.randomUUID(),
            title: 'Setup project repository',
            description: 'Inisialisasi repo dan konfigurasi awal',
            completed: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: crypto.randomUUID(),
            title: 'Desain skema Mock API',
            description: 'Tentukan endpoint dan bentuk response',
            completed: false,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: crypto.randomUUID(),
            title: 'Implementasi fitur bulk actions',
            completed: false,
            createdAt: now,
            updatedAt: now,
        },
    ];
}

function readAll(): Task[] {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
        const seeded = seedTasks();
        localStorage.setItem(DB_KEY, JSON.stringify(seeded));
        return seeded;
    }
    try {
        return JSON.parse(raw) as Task[];
    } catch {
        return [];
    }
}

function writeAll(tasks: Task[]): void {
    localStorage.setItem(DB_KEY, JSON.stringify(tasks));
}

export const taskDb = {
    getAll(): Task[] {
        return readAll();
    },

    getById(id: string): Task | undefined {
        return readAll().find((t) => t.id === id);
    },

    create(input: { title: string; description?: string }): Task {
        const tasks = readAll();
        const now = new Date().toISOString();
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: input.title,
            description: input.description,
            completed: false,
            createdAt: now,
            updatedAt: now,
        };
        tasks.unshift(newTask);
        writeAll(tasks);
        return newTask;
    },

    update(id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>): Task {
        const tasks = readAll();
        const idx = tasks.findIndex((t) => t.id === id);
        if (idx === -1) {
            throw new Error('TASK_NOT_FOUND');
        }
        const updated: Task = {
            ...tasks[idx],
            ...changes,
            updatedAt: new Date().toISOString(),
        };
        tasks[idx] = updated;
        writeAll(tasks);
        return updated;
    },

    remove(id: string): void {
        const tasks = readAll().filter((t) => t.id !== id);
        writeAll(tasks);
    },

    bulkUpdate(ids: string[], changes: Partial<Omit<Task, 'id' | 'createdAt'>>): Task[] {
        const tasks = readAll();
        const idSet = new Set(ids);
        const now = new Date().toISOString();
        const updatedTasks = tasks.map((t) =>
            idSet.has(t.id) ? { ...t, ...changes, updatedAt: now } : t
        );
        writeAll(updatedTasks);
        return updatedTasks.filter((t) => idSet.has(t.id));
    },

    bulkRemove(ids: string[]): void {
        const idSet = new Set(ids);
        const tasks = readAll().filter((t) => !idSet.has(t.id));
        writeAll(tasks);
    },
};
