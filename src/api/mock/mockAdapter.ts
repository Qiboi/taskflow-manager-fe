import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../axiosClient';
import { taskDb, projectDb } from '../../lib/localDb';

/**
 * HARDCODED credentials untuk mock login. Sesuai requirement:
 * "Halaman Login dengan validasi kredensial (hardcoded)".
 */
const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'password123',
};

const MOCK_TOKEN = 'mock-jwt-token-taskflow';

// Rentang latensi sesuai requirement (800ms - 1s)
const MIN_DELAY = 800;
const MAX_DELAY = 1000;

function randomDelay(): number {
  return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
}

/**
 * Helper untuk mensimulasikan kegagalan acak (opsional dipakai di endpoint tertentu)
 * agar UI benar-benar teruji menangani error state, bukan hanya happy path.
 */
function shouldSimulateRandomFailure(failureRate = 0): boolean {
  return Math.random() < failureRate;
}

export function setupMockAdapter() {
  const mock = new MockAdapter(apiClient, { delayResponse: randomDelay() });

  // ---------- AUTH ----------
  mock.onPost('/auth/login').reply((config) => {
    const body = JSON.parse(config.data);
    const { username, password } = body;

    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      return [
        200,
        {
          token: MOCK_TOKEN,
          user: { id: 'user-1', username: 'admin', name: 'Admin User' },
        },
      ];
    }

    return [401, { message: 'Username atau password salah.' }];
  });

  // ---------- PROJECTS: LIST ----------
  mock.onGet('/projects').reply((config) => {
    if (!hasValidAuthHeader(config)) {
      return [401, { message: 'Unauthorized' }];
    }
    try {
      return [200, projectDb.getAll()];
    } catch {
      return [500, { message: 'Gagal mengambil data project.' }];
    }
  });

  // ---------- PROJECTS: CREATE ----------
  mock.onPost('/projects').reply((config) => {
    if (!hasValidAuthHeader(config)) {
      return [401, { message: 'Unauthorized' }];
    }
    try {
      const body = JSON.parse(config.data);
      if (!body.name || !body.name.trim()) {
        return [400, { message: 'Nama project wajib diisi.' }];
      }
      const created = projectDb.create({
        name: body.name,
        color: body.color,
        clientName: body.clientName,
      });
      return [201, created];
    } catch {
      return [500, { message: 'Gagal menyimpan project baru.' }];
    }
  });

  // ---------- PROJECTS: UPDATE ----------
  mock.onPatch(/\/projects\/.+/).reply((config) => {
    if (!hasValidAuthHeader(config)) {
      return [401, { message: 'Unauthorized' }];
    }
    try {
      const id = extractIdFromUrl(config.url);
      const body = JSON.parse(config.data);
      const updated = projectDb.update(id, body);
      return [200, updated];
    } catch {
      return [404, { message: 'Project tidak ditemukan.' }];
    }
  });

  // ---------- PROJECTS: DELETE ----------
  mock.onDelete(/\/projects\/.+/).reply((config) => {
    if (!hasValidAuthHeader(config)) {
      return [401, { message: 'Unauthorized' }];
    }
    try {
      const id = extractIdFromUrl(config.url);
      projectDb.remove(id);
      return [200, { success: true }];
    } catch {
      return [500, { message: 'Gagal menghapus project.' }];
    }
  });

  // ---------- TASKS: LIST ----------
  mock.onGet('/tasks').reply((config) => {
    if (!hasValidAuthHeader(config)) {
      return [401, { message: 'Unauthorized' }];
    }
    try {
      const tasks = taskDb.getAll();
      return [200, tasks];
    } catch {
      return [500, { message: 'Gagal mengambil data tugas.' }];
    }
  });

  // ---------- TASKS: CREATE ----------
  mock.onPost('/tasks').reply((config) => {
    if (!hasValidAuthHeader(config)) {
      return [401, { message: 'Unauthorized' }];
    }
    if (shouldSimulateRandomFailure(0)) {
      return [500, { message: 'Gagal menyimpan tugas baru.' }];
    }
    try {
      const body = JSON.parse(config.data);
      if (!body.title || !body.title.trim()) {
        return [400, { message: 'Judul tugas wajib diisi.' }];
      }
      const created = taskDb.create({
        title: body.title,
        description: body.description,
        projectId: body.projectId ?? null,
        status: body.status,
        dueDate: body.dueDate ?? null,
        priority: body.priority,
        difficulty: body.difficulty,
      });
      return [201, created];
    } catch {
      return [500, { message: 'Gagal menyimpan tugas baru.' }];
    }
  });

  // ---------- TASKS: BULK UPDATE ----------
  // Didaftarkan SEBELUM regex /\/tasks\/.+/ di bawah, supaya request ke
  // "/tasks/bulk" tidak salah tertangkap sebagai "update task dengan id=bulk".
  mock.onPatch('/tasks/bulk').reply((config) => {
    if (!hasValidAuthHeader(config)) {
      return [401, { message: 'Unauthorized' }];
    }
    try {
      const body = JSON.parse(config.data);
      const updated = taskDb.bulkUpdate(body.ids, body.changes);
      return [200, updated];
    } catch {
      return [500, { message: 'Gagal memperbarui tugas secara massal.' }];
    }
  });

  // ---------- TASKS: BULK DELETE ----------
  mock.onDelete('/tasks/bulk').reply((config) => {
    if (!hasValidAuthHeader(config)) {
      return [401, { message: 'Unauthorized' }];
    }
    try {
      const body = JSON.parse(config.data);
      taskDb.bulkRemove(body.ids);
      return [200, { success: true }];
    } catch {
      return [500, { message: 'Gagal menghapus tugas secara massal.' }];
    }
  });

  // ---------- TASKS: UPDATE (single, by id) ----------
  mock.onPatch(/\/tasks\/.+/).reply((config) => {
    if (!hasValidAuthHeader(config)) {
      return [401, { message: 'Unauthorized' }];
    }
    try {
      const id = extractIdFromUrl(config.url);
      const body = JSON.parse(config.data);
      const updated = taskDb.update(id, body);
      return [200, updated];
    } catch {
      return [404, { message: 'Tugas tidak ditemukan.' }];
    }
  });

  // ---------- TASKS: DELETE (single, by id) ----------
  mock.onDelete(/\/tasks\/.+/).reply((config) => {
    if (!hasValidAuthHeader(config)) {
      return [401, { message: 'Unauthorized' }];
    }
    try {
      const id = extractIdFromUrl(config.url);
      taskDb.remove(id);
      return [200, { success: true }];
    } catch {
      return [500, { message: 'Gagal menghapus tugas.' }];
    }
  });

  return mock;
}

function hasValidAuthHeader(config: { headers?: Record<string, unknown> }): boolean {
  const authHeader = config.headers?.Authorization as string | undefined;
  return authHeader === `Bearer ${MOCK_TOKEN}`;
}

function extractIdFromUrl(url?: string): string {
  if (!url) throw new Error('NO_URL');
  const parts = url.split('/');
  return parts[parts.length - 1];
}