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
      id: 'project-acme',
      name: 'Acme Corp Website',
      color: PROJECT_COLORS[0],
      clientName: 'Acme Corp',
      archived: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'project-personal',
      name: 'Personal / Side Project',
      color: PROJECT_COLORS[3],
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
      title: 'Setup project repository',
      description: 'Inisialisasi repo dan konfigurasi awal',
      completed: true,
      projectId: 'project-acme',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: 'Desain skema Mock API',
      description: 'Tentukan endpoint dan bentuk response',
      completed: false,
      projectId: 'project-acme',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      title: 'Implementasi fitur bulk actions',
      completed: false,
      projectId: 'project-personal',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

/**
 * Migrasi ringan: data tugas yang dibuat sebelum fitur Project ada (v1)
 * tidak punya field `projectId`. Kita tambal jadi `null` (artinya "Tanpa Project")
 * supaya data lama tetap kompatibel tanpa perlu di-reset manual oleh user.
 */
function migrateTask(raw: Task & { projectId?: string | null }): Task {
  if (raw.projectId === undefined) {
    return { ...raw, projectId: null };
  }
  return raw as Task;
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
    const migrated = parsed.map(migrateTask);
    writeAllTasks(migrated);
    return migrated;
  } catch {
    return [];
  }
}

function writeAllTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_DB_KEY, JSON.stringify(tasks));
}

export const taskDb = {
  getAll(): Task[] {
    return readAllTasks();
  },

  getById(id: string): Task | undefined {
    return readAllTasks().find((t) => t.id === id);
  },

  create(input: { title: string; description?: string; projectId?: string | null }): Task {
    const tasks = readAllTasks();
    const now = new Date().toISOString();
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      description: input.description,
      completed: false,
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
    const updated: Task = {
      ...tasks[idx],
      ...changes,
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
    const updatedTasks = tasks.map((t) =>
      idSet.has(t.id) ? { ...t, ...changes, updatedAt: now } : t
    );
    writeAllTasks(updatedTasks);
    return updatedTasks.filter((t) => idSet.has(t.id));
  },

  bulkRemove(ids: string[]): void {
    const idSet = new Set(ids);
    const tasks = readAllTasks().filter((t) => !idSet.has(t.id));
    writeAllTasks(tasks);
  },
};
