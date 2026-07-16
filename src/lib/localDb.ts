import type { Task } from '../types/task';
import type { Project } from '../types/project';
import { PROJECT_COLORS } from '../types/project';

/**
 * Lapisan penyimpanan "database" palsu di atas LocalStorage.
 * Ini adalah satu-satunya tempat yang boleh menyentuh LocalStorage untuk data tugas & project.
 * Mock API (src/api/mock) memanggil fungsi-fungsi ini seolah-olah mereka
 * adalah query ke database sungguhan.
 */

const TASKS_DB_KEY = 'taskflow_db_tasks';
const PROJECTS_DB_KEY = 'taskflow_db_projects';

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------

function seedProjects(): Project[] {
    const now = new Date().toISOString();
    return [
        {
            id: 'project-moc',
            name: 'Company Website Redesign',
            color: PROJECT_COLORS[0],
            clientName: 'MOC',
            archived: false,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'project-design-system',
            name: 'UI Component Library',
            color: PROJECT_COLORS[4],
            clientName: 'Internal / Frontend Team',
            archived: false,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'project-personal',
            name: 'Personal Portfolio',
            color: PROJECT_COLORS[3],
            clientName: 'Personal',
            archived: false,
            createdAt: now,
            updatedAt: now,
        },
    ];
}


function readAllProjects(): Project[] {
    const raw = localStorage.getItem(PROJECTS_DB_KEY);
    if (!raw) {
        const seeded = seedProjects();
        localStorage.setItem(PROJECTS_DB_KEY, JSON.stringify(seeded));
        return seeded;
    }
    try {
        return JSON.parse(raw) as Project[];
    } catch {
        return [];
    }
}

function writeAllProjects(projects: Project[]): void {
    localStorage.setItem(PROJECTS_DB_KEY, JSON.stringify(projects));
}

export const projectDb = {
    getAll(): Project[] {
        return readAllProjects();
    },

    getById(id: string): Project | undefined {
        return readAllProjects().find((p) => p.id === id);
    },

    create(input: { name: string; color: string; clientName?: string }): Project {
        const projects = readAllProjects();
        const now = new Date().toISOString();
        const newProject: Project = {
            id: crypto.randomUUID(),
            name: input.name,
            color: input.color,
            clientName: input.clientName,
            archived: false,
            createdAt: now,
            updatedAt: now,
        };
        projects.unshift(newProject);
        writeAllProjects(projects);
        return newProject;
    },

    update(id: string, changes: Partial<Omit<Project, 'id' | 'createdAt'>>): Project {
        const projects = readAllProjects();
        const idx = projects.findIndex((p) => p.id === id);
        if (idx === -1) {
            throw new Error('PROJECT_NOT_FOUND');
        }
        const updated: Project = {
            ...projects[idx],
            ...changes,
            updatedAt: new Date().toISOString(),
        };
        projects[idx] = updated;
        writeAllProjects(projects);
        return updated;
    },

    remove(id: string): void {
        // Project dihapus -> tugas terkait tidak ikut terhapus, cukup dilepas ke "Tanpa Project"
        // supaya tidak ada data tugas yang hilang tanpa sepengetahuan user.
        const projects = readAllProjects().filter((p) => p.id !== id);
        writeAllProjects(projects);

        const tasks = readAllTasks();
        const releasedTasks = tasks.map((t) => (t.projectId === id ? { ...t, projectId: null } : t));
        writeAllTasks(releasedTasks);
    },
};

// ---------------------------------------------------------------------------
// TASKS
// ---------------------------------------------------------------------------

function seedTasks(): Task[] {
    const now = new Date().toISOString();

    return [
        {
            id: crypto.randomUUID(),
            title: 'Setup project repository dan routing awal',
            description: 'Inisialisasi Next.js, struktur folder, dan konfigurasi dasar project frontend',
            completed: true,
            status: 'completed',
            dueDate: null,
            priority: 'medium',
            difficulty: 'easy',
            projectId: 'project-acme',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: crypto.randomUUID(),
            title: 'Implementasi dashboard layout responsive',
            description: 'Membangun layout sidebar, header, dan content area yang adaptif untuk desktop dan mobile',
            completed: false,
            status: 'in_progress',
            dueDate: null,
            priority: 'high',
            difficulty: 'medium',
            projectId: 'project-acme',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: crypto.randomUUID(),
            title: 'Buat reusable component library',
            description: 'Menyusun komponen UI seperti Button, Input, Dialog, Card, dan Table agar konsisten',
            completed: false,
            status: 'todo',
            dueDate: null,
            priority: 'high',
            difficulty: 'hard',
            projectId: 'project-design-system',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: crypto.randomUUID(),
            title: 'Optimasi SEO dan metadata halaman',
            description: 'Menambahkan title, description, Open Graph, dan heading structure untuk landing page',
            completed: false,
            status: 'todo',
            dueDate: null,
            priority: 'medium',
            difficulty: 'medium',
            projectId: 'project-personal',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: crypto.randomUUID(),
            title: 'Integrasi form dengan mock API',
            description: 'Menghubungkan form frontend ke mock endpoint untuk simulasi create dan update data',
            completed: false,
            status: 'todo',
            dueDate: null,
            priority: 'medium',
            difficulty: 'medium',
            projectId: null,
            createdAt: now,
            updatedAt: now,
        },
    ];
}

/**
 * Migrasi ringan: data tugas dari versi sebelumnya (v1: belum ada `projectId`,
 * v2: belum ada `status`/`dueDate`/`priority`/`difficulty`) ditambal dengan
 * nilai default yang aman, supaya data lama di LocalStorage user tidak hilang
 * atau error saat aplikasi di-update.
 */
function migrateTask(raw: Task & Record<string, unknown>): Task {
    let t: Task & Record<string, unknown> = raw;

    if (t.projectId === undefined) {
        t = { ...t, projectId: null };
    }
    if (t.status === undefined) {
        t = { ...t, status: t.completed ? 'completed' : 'todo' };
    }
    if (t.dueDate === undefined) {
        t = { ...t, dueDate: null };
    }
    if (t.priority === undefined) {
        t = { ...t, priority: 'medium' };
    }
    if (t.difficulty === undefined) {
        t = { ...t, difficulty: 'medium' };
    }

    return t as Task;
}

function readAllTasks(): Task[] {
    const raw = localStorage.getItem(TASKS_DB_KEY);
    if (!raw) {
        const seeded = seedTasks();
        localStorage.setItem(TASKS_DB_KEY, JSON.stringify(seeded));
        return seeded;
    }
    try {
        const parsed = JSON.parse(raw) as Task[];
        const migrated = (parsed as Array<Task & Record<string, unknown>>).map(migrateTask);
        writeAllTasks(migrated);
        return migrated;
    } catch {
        return [];
    }
}

function writeAllTasks(tasks: Task[]): void {
    localStorage.setItem(TASKS_DB_KEY, JSON.stringify(tasks));
}

/**
 * Menjaga konsistensi antara `status` (detail: todo/in_progress/completed)
 * dan `completed` (boolean lama, dipakai filter Requirement Fitur C).
 * - Kalau `status` diubah -> `completed` ikut disesuaikan.
 * - Kalau cuma `completed` diubah (jalur lama) -> `status` ikut disesuaikan:
 *   completed:true => status 'completed'; completed:false => status 'todo'
 *   (kecuali sudah 'in_progress', supaya tidak reset progres tanpa alasan... 
 *   tapi karena completed:false biasanya datang dari uncheck manual, kita
 *   anggap user ingin balik ke awal -> 'todo').
 */
function syncStatusAndCompleted(
    _current: Task,
    changes: Partial<Omit<Task, 'id' | 'createdAt'>>
): Partial<Omit<Task, 'id' | 'createdAt'>> {
    if (changes.status !== undefined) {
        return { ...changes, completed: changes.status === 'completed' };
    }
    if (changes.completed !== undefined) {
        return { ...changes, status: changes.completed ? 'completed' : 'todo' };
    }
    return changes;
}

export const taskDb = {
    getAll(): Task[] {
        return readAllTasks();
    },

    getById(id: string): Task | undefined {
        return readAllTasks().find((t) => t.id === id);
    },

    create(input: {
        title: string;
        description?: string;
        projectId?: string | null;
        status?: Task['status'];
        dueDate?: string | null;
        priority?: Task['priority'];
        difficulty?: Task['difficulty'];
    }): Task {
        const tasks = readAllTasks();
        const now = new Date().toISOString();
        const status = input.status ?? 'todo';
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: input.title,
            description: input.description,
            completed: status === 'completed',
            status,
            dueDate: input.dueDate ?? null,
            priority: input.priority ?? 'medium',
            difficulty: input.difficulty ?? 'medium',
            projectId: input.projectId ?? null,
            createdAt: now,
            updatedAt: now,
        };
        tasks.unshift(newTask);
        writeAllTasks(tasks);
        return newTask;
    },

    update(id: string, changes: Partial<Omit<Task, 'id' | 'createdAt'>>): Task {
        const tasks = readAllTasks();
        const idx = tasks.findIndex((t) => t.id === id);
        if (idx === -1) {
            throw new Error('TASK_NOT_FOUND');
        }
        const current = tasks[idx];
        const syncedChanges = syncStatusAndCompleted(current, changes);
        const updated: Task = {
            ...current,
            ...syncedChanges,
            updatedAt: new Date().toISOString(),
        };
        tasks[idx] = updated;
        writeAllTasks(tasks);
        return updated;
    },

    remove(id: string): void {
        const tasks = readAllTasks().filter((t) => t.id !== id);
        writeAllTasks(tasks);
    },

    bulkUpdate(ids: string[], changes: Partial<Omit<Task, 'id' | 'createdAt'>>): Task[] {
        const tasks = readAllTasks();
        const idSet = new Set(ids);
        const now = new Date().toISOString();
        const updatedTasks = tasks.map((t) => {
            if (!idSet.has(t.id)) return t;
            const syncedChanges = syncStatusAndCompleted(t, changes);
            return { ...t, ...syncedChanges, updatedAt: now };
        });
        writeAllTasks(updatedTasks);
        return updatedTasks.filter((t) => idSet.has(t.id));
    },

    bulkRemove(ids: string[]): void {
        const idSet = new Set(ids);
        const tasks = readAllTasks().filter((t) => !idSet.has(t.id));
        writeAllTasks(tasks);
    },
};