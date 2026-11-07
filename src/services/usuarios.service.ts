import { apiDelete, apiGet, apiPatch, apiPost } from './api';
import type {
  Usuario,
  CriarUsuarioPayload,
  AtualizarUsuarioPayload,
} from '@/src/types/usuario';

export async function getUsuarios(): Promise<Usuario[]> {
  return apiGet<Usuario[]>('/users');
}

export async function getUsuarioById(id: string | number): Promise<Usuario> {
  return apiGet<Usuario>(`/users/${id}`);
}

export async function createUsuario(
  data: CriarUsuarioPayload,
): Promise<Usuario> {
  return apiPost<Usuario>('/users', data);
}

export async function updateUsuario(
  id: string | number,
  data: AtualizarUsuarioPayload,
): Promise<Usuario> {
  return apiPatch<Usuario>(`/users/${id}`, data);
}

export async function deleteUsuario(id: string | number): Promise<void> {
  return apiDelete(`/users/${id}`);
}

// Aliases de retrocompatibilidade
export const getUsers = getUsuarios;
export const getUserById = getUsuarioById;
export const createUser = createUsuario;
export const updateUser = updateUsuario;
export const deleteUser = deleteUsuario;
