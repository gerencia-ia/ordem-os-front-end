import { z } from 'zod';
import type { CategoriaServico } from './categoria';

export type { CategoriaServico } from './categoria';

export interface Servico {
  id: number;
  nome: string;
  valor: number;
  tempo_servico: number;
  categorias_servico_id?: number | null;
  categoria?: CategoriaServico | null;
  categorias_servico?: CategoriaServico | null;
  created_at?: string;
  updated_at?: string;
}

export interface CriarServicoPayload {
  nome: string;
  valor: number;
  tempo_servico?: number | null;
  categorias_servico_id?: number | null;
}

export interface EditarServicoPayload {
  nome?: string;
  valor?: number;
  tempo_servico?: number | null;
  categorias_servico_id?: number | null;
}

export type NovoServicoPayload = CriarServicoPayload;

export const servicoFormSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  valor: z.coerce.number().min(0.01, 'O valor deve ser maior que zero'),
  tempo_servico: z.coerce
    .number()
    .int('O tempo deve ser um número inteiro')
    .min(1, 'O tempo deve ser no mínimo 1 minuto')
    .optional()
    .nullable(),
  categorias_servico_id: z.coerce.number().optional().nullable(),
});

export type ServicoFormData = z.infer<typeof servicoFormSchema>;
