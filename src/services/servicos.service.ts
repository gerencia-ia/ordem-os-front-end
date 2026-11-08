import { apiDelete, apiGet, apiPost, apiPut } from './api';
import type {
  Servico,
  CriarServicoPayload,
  EditarServicoPayload,
} from '@/src/types/servico';

export async function getServicos(): Promise<Servico[]> {
  return apiGet<Servico[]>('/servicos', { cache: 'no-store' });
}

export async function getServicoById(id: string | number): Promise<Servico> {
  return apiGet<Servico>(`/servicos/${id}`);
}

export async function createServico(
  payload: CriarServicoPayload,
): Promise<Servico> {
  return apiPost<Servico>('/servicos', payload);
}

export async function updateServico(
  id: string | number,
  payload: EditarServicoPayload,
): Promise<Servico> {
  return apiPut<Servico>(`/servicos/${id}`, payload);
}

export async function deleteServico(id: string | number): Promise<void> {
  return apiDelete(`/servicos/${id}`);
}

// Retrocompatibilidade
export type { NovoServicoPayload } from '@/src/types/servico';
