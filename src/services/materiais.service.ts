import { apiDelete, apiGet, apiPost, apiPut } from './api';
import type { Material, MaterialPayload } from '@/src/types/material';

export async function getMateriais(): Promise<Material[]> {
  return apiGet<Material[]>('/materiais', { cache: 'no-store' });
}

export async function createMaterial(payload: MaterialPayload): Promise<Material> {
  return apiPost<Material>('/materiais', payload);
}

export async function updateMaterial(
  id: number,
  payload: MaterialPayload,
): Promise<Material> {
  return apiPut<Material>(`/materiais/${id}`, payload);
}

export async function deleteMaterial(id: number): Promise<void> {
  return apiDelete(`/materiais/${id}`);
}
