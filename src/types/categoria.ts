import { z } from 'zod';

export interface CategoriaServico {
  id: number;
  descricao: string;
  created_at?: string;
  updated_at?: string;
}

export interface CriarCategoriaPayload {
  descricao: string;
}

export interface EditarCategoriaPayload {
  descricao?: string;
}

export const categoriaFormSchema = z.object({
  descricao: z
    .string()
    .min(2, 'A descrição deve ter no mínimo 2 caracteres')
    .max(100, 'A descrição deve ter no máximo 100 caracteres'),
});

export type CategoriaFormData = z.infer<typeof categoriaFormSchema>;
