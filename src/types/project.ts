export interface Project {
    id: string;
    name: string;
    color: string;
    clientName?: string;
    archived: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectPayload {
    name: string;
    color: string;
    clientName?: string;
}

export interface UpdateProjectPayload {
    id: string;
    name?: string;
    color?: string;
    clientName?: string;
    archived?: boolean;
}

export const PROJECT_COLORS = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#64748b', // slate
] as const;
