import type { AuthSession } from "../../types/auth";
import type { Task } from "../../types/task";

const STORAGE_KEYS = {
    auth: "taskflow-auth",
    tasks: "taskflow-tasks",
} as const;

function isBrowser() {
    return typeof window !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;

    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;

    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

function writeJson<T>(key: string, value: T) {
    if (!isBrowser()) return;
    window.localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key: string) {
    if (!isBrowser()) return;
    window.localStorage.removeItem(key);
}

/* =========================
   AUTH STORAGE
========================= */

export function getSession(): AuthSession | null {
    return readJson<AuthSession | null>(STORAGE_KEYS.auth, null);
}

export function saveSession(session: AuthSession) {
    writeJson(STORAGE_KEYS.auth, session);
}

export function clearSession() {
    removeItem(STORAGE_KEYS.auth);
}

/* =========================
   TASK STORAGE
========================= */

export function getTasks(): Task[] {
    return readJson<Task[]>(STORAGE_KEYS.tasks, []);
}

export function saveTasks(tasks: Task[]) {
    writeJson(STORAGE_KEYS.tasks, tasks);
}

export function clearTasks() {
    removeItem(STORAGE_KEYS.tasks);
}

/* =========================
   RESET / SEED HELPERS
========================= */

export function clearAllStorage() {
    clearSession();
    clearTasks();
}

export function seedTasksIfEmpty(seedTasks: Task[]) {
    const currentTasks = getTasks();

    if (currentTasks.length === 0) {
        saveTasks(seedTasks);
    }
}