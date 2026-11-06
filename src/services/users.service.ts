import { apiDelete, apiGet, apiPatch, apiPost } from './api';
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
} from '@/src/types/user';

export async function getUsers(): Promise<User[]> {
  return apiGet<User[]>('/users');
}

export async function getUserById(id: string | number): Promise<User> {
  return apiGet<User>(`/users/${id}`);
}

export async function createUser(data: CreateUserPayload): Promise<User> {
  return apiPost<User>('/users', data);
}

export async function updateUser(
  id: string | number,
  data: UpdateUserPayload,
): Promise<User> {
  return apiPatch<User>(`/users/${id}`, data);
}

export async function deleteUser(id: string | number): Promise<void> {
  return apiDelete(`/users/${id}`);
}
