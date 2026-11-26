import { apiDelete, apiGet, apiPatch, apiPost } from './api';
import type { OrdemServico } from '@/src/types/ordem';
import type {
  AtualizarOrcamentoPayload,
  ConverterOrcamentoPayload,
  CriarOrcamentoPayload,
  Orcamento,
  OrcamentoStatusEditavel,
} from '@/src/types/orcamento';

export interface GetOrcamentosParams {
  cliente_id?: number;
  status?: string;
  mes?: number;
  ano?: number;
}

export async function getOrcamentos(
  params?: GetOrcamentosParams,
): Promise<Orcamento[]> {
  const search = new URLSearchParams();
  if (params?.cliente_id) search.set('cliente_id', String(params.cliente_id));
  if (params?.status && params.status !== 'todos') {
    search.set('status', params.status);
  }
  if (params?.mes) search.set('mes', String(params.mes));
  if (params?.ano) search.set('ano', String(params.ano));

  const query = search.toString();
  return apiGet<Orcamento[]>(query ? `/orcamentos?${query}` : '/orcamentos');
}

export async function getOrcamentoById(
  id: number | string,
): Promise<Orcamento> {
  return apiGet<Orcamento>(`/orcamentos/${id}`);
}

export async function createOrcamento(
  data: CriarOrcamentoPayload,
): Promise<Orcamento> {
  return apiPost<Orcamento>('/orcamentos', data);
}

export async function updateOrcamento(
  id: number | string,
  data: AtualizarOrcamentoPayload,
): Promise<Orcamento> {
  return apiPatch<Orcamento>(`/orcamentos/${id}`, data);
}

export async function updateOrcamentoStatus(
  id: number | string,
  status: OrcamentoStatusEditavel,
): Promise<Orcamento> {
  return apiPatch<Orcamento>(`/orcamentos/${id}/update_status`, { status });
}

export async function converterOrcamentoEmOrdem(
  id: number | string,
  data?: ConverterOrcamentoPayload,
): Promise<OrdemServico> {
  return apiPost<OrdemServico>(`/orcamentos/${id}/converter_em_os`, data ?? {});
}

export async function deleteOrcamento(id: number | string): Promise<void> {
  return apiDelete(`/orcamentos/${id}`);
}
