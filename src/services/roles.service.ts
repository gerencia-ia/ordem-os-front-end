import { apiGet } from './api';
import type { Role } from '@/src/types/role';

export async function getRoles(): Promise<Role[]> {
  return apiGet<Role[]>('/roles', { cache: 'no-store' });
}
