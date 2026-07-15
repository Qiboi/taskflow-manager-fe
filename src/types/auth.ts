export interface User {
    id: string;
    username: string;
    name: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthSession {
    token: string;
    user: User;
}
