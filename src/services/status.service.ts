import { apiGet } from './api';
import type { Status } from '@/src/types/ordem';

export type StatusPayload = {
  nome: string;
};

export async function getStatus(): Promise<Status[]> {
  return apiGet<Status[]>('/status', { cache: 'no-store' });
}
