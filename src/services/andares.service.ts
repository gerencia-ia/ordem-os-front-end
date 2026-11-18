import { apiDelete, apiGet, apiPost, apiPut } from './api';
import type {
  Andar,
  CriarAndarPayload,
  EditarAndarPayload,
} from '@/src/types/andar';

export async function getAndares(): Promise<Andar[]> {
  return apiGet<Andar[]>('/andares', {
    cache: 'no-store',
  });
}

export async function getAndarById(id: string | number): Promise<Andar> {
  return apiGet<Andar>(`/andares/${id}`);
}

export async function createAndar(payload: CriarAndarPayload): Promise<Andar> {
  return apiPost<Andar>('/andares', { andar: payload });
}

export async function updateAndar(
  id: string | number,
  payload: EditarAndarPayload,
): Promise<Andar> {
  return apiPut<Andar>(`/andares/${id}`, { andar: payload });
}

export async function deleteAndar(id: string | number): Promise<void> {
  return apiDelete(`/andares/${id}`);
}
