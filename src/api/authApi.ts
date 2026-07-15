import type { AuthSession, LoginCredentials } from "../types/auth";
import { apiClient } from "./axiosClient";

export async function loginRequest(credentials: LoginCredentials): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthSession>('/auth/login', credentials);
  return data;
}
