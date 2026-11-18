import { z } from 'zod';
import type { Andar } from './andar';
import type { CategoriaServico } from './categoria';

export interface ValorPorAndar {
  id: number;
  servico_id: number;
  andar_id: number;
  valor: number | string;
  andar?: Andar | null;
}

export interface ValorPorAndarInput {
  id?: number;
  andar_id: number;
  valor: number;
  _destroy?: boolean;
}

export interface Servico {
  id: number;
  nome: string;
  tempo_servico: number;
  categorias_servico_id?: number | null;
  categoria?: CategoriaServico | null;
  categorias_servico?: CategoriaServico | null;
  valores_por_andares?: ValorPorAndar[];
  created_at?: string;
  updated_at?: string;
}

export interface CriarServicoPayload {
  nome: string;
  tempo_servico?: number | null;
  categorias_servico_id?: number | null;
  valores_por_andares_attributes?: ValorPorAndarInput[];
}

export interface EditarServicoPayload {
  nome?: string;
  tempo_servico?: number | null;
  categorias_servico_id?: number | null;
  valores_por_andares_attributes?: ValorPorAndarInput[];
}

export const valorPorAndarFormSchema = z.object({
  id: z.number().optional(),
  andar_id: z.coerce.number().min(1, 'Selecione um andar'),
  valor: z.coerce
    .number()
    .min(0, 'O valor deve ser maior ou igual a zero'),
  _destroy: z.boolean().optional(),
});

export const servicoFormSchema = z
  .object({
    nome: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
    tempo_servico: z.coerce
      .number()
      .int('O tempo deve ser um número inteiro')
      .min(1, 'O tempo deve ser no mínimo 1 minuto')
      .optional()
      .nullable(),
    categorias_servico_id: z.coerce.number().optional().nullable(),
    valores_por_andares_attributes: z.array(valorPorAndarFormSchema),
  })
  .superRefine((data, ctx) => {
    const ativos = data.valores_por_andares_attributes.filter(
      (item) => !item._destroy,
    );
    const andaresVistos = new Set<number>();

    ativos.forEach((item, index) => {
      if (item.andar_id > 0) {
        if (andaresVistos.has(item.andar_id)) {
          ctx.addIssue({
            code: 'custom',
            message: 'Este andar já foi adicionado neste serviço',
            path: ['valores_por_andares_attributes', index, 'andar_id'],
          });
        }
        andaresVistos.add(item.andar_id);
      }
    });
  });

export type ValorPorAndarFormData = z.infer<typeof valorPorAndarFormSchema>;
export type ServicoFormData = z.infer<typeof servicoFormSchema>;
