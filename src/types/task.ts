export type TaskStatus = "active" | "completed";

export type Task = {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
};