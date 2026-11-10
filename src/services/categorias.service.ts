import { apiDelete, apiGet, apiPost, apiPut } from './api';
import type {
  CategoriaServico,
  CriarCategoriaPayload,
  EditarCategoriaPayload,
} from '@/src/types/categoria';

export async function getCategorias(): Promise<CategoriaServico[]> {
  return apiGet<CategoriaServico[]>('/categorias_servico', {
    cache: 'no-store',
  });
}

export async function getCategoriaById(
  id: string | number,
): Promise<CategoriaServico> {
  return apiGet<CategoriaServico>(`/categorias_servico/${id}`);
}

export async function createCategoria(
  payload: CriarCategoriaPayload,
): Promise<CategoriaServico> {
  return apiPost<CategoriaServico>('/categorias_servico', payload);
}

export async function updateCategoria(
  id: string | number,
  payload: EditarCategoriaPayload,
): Promise<CategoriaServico> {
  return apiPut<CategoriaServico>(`/categorias_servico/${id}`, payload);
}

export async function deleteCategoria(id: string | number): Promise<void> {
  return apiDelete(`/categorias_servico/${id}`);
}
