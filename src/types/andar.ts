import { z } from 'zod';

export interface Andar {
  id: number;
  descricao: string;
  created_at?: string;
  updated_at?: string;
}

export interface CriarAndarPayload {
  descricao: string;
}

export interface EditarAndarPayload {
  descricao?: string;
}

export const andarFormSchema = z.object({
  descricao: z
    .string()
    .trim()
    .min(1, 'A descrição do andar é obrigatória')
    .max(100, 'A descrição deve ter no máximo 100 caracteres'),
});

export type AndarFormData = z.infer<typeof andarFormSchema>;
