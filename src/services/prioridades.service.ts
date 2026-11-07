import { apiGet } from './api';
import type { Prioridade } from '@/src/types/ordem';

export type PrioridadePayload = {
  descricao: string;
};

export async function getPrioridades(): Promise<Prioridade[]> {
  return apiGet<Prioridade[]>('/prioridades', { cache: 'no-store' });
}
