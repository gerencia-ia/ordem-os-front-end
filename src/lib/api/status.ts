import type { Status } from '@/src/lib/tipos';
import { apiGet } from './api';

export type StatusPayload = {
  nome: string;
};

export async function getStatus(): Promise<Status[]> {
  return apiGet<Status[]>('/status', { cache: 'no-store' });
}
