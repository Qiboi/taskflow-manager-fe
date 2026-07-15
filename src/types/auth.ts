export type User = {
    id: string;
    name: string;
    email: string;
};

export type AuthSession = {
    token: string;
    user: User;
};