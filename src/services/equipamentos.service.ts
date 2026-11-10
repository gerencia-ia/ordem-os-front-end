import { apiGet, apiPost } from './api';
import type {
  Equipamento,
  CriarEquipamentoPayload,
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

export async function getHistoricoLaudos(
  equipamentoId: number | string,
): Promise<HistoricoLaudo[]> {
  return apiGet<HistoricoLaudo[]>(
    `/equipamentos/${equipamentoId}/historico_laudos`,
  );
}
