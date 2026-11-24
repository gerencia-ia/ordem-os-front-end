import { apiDelete, apiGet, apiPost, apiPut } from './api';
import type {
  Equipamento,
  CriarEquipamentoPayload,
  AtualizarEquipamentoPayload,
  HistoricoLaudo,
} from '@/src/types/equipamento';

export async function getEquipamentosByCliente(
  clienteId: number | string,
): Promise<Equipamento[]> {
  return apiGet<Equipamento[]>(`/equipamentos?cliente_id=${clienteId}`, {
    cache: 'no-store',
  });
}

export async function createEquipamento(
  data: CriarEquipamentoPayload,
): Promise<Equipamento & { id: number }> {
  return apiPost<Equipamento & { id: number }>('/equipamentos', data);
}

export async function updateEquipamento(
  id: number | string,
  data: AtualizarEquipamentoPayload,
): Promise<Equipamento> {
  return apiPut<Equipamento>(`/equipamentos/${id}`, data);
}

export async function deleteEquipamento(id: number | string): Promise<void> {
  return apiDelete(`/equipamentos/${id}`);
}

export async function getHistoricoLaudos(
  equipamentoId: number | string,
): Promise<HistoricoLaudo[]> {
  return apiGet<HistoricoLaudo[]>(
    `/equipamentos/${equipamentoId}/historico_laudos`,
  );
}
