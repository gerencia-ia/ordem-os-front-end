import { z } from 'zod';

export interface Endereco {
  id?: number;
  cep?: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento?: string;
  cidade: string;
  created_at?: string;
  updated_at?: string;
  _destroy?: boolean;
}

export const enderecoSchema = z
  .object({
    id: z.number().optional(),
    cep: z.string().optional().default(''),
    rua: z.string().optional().default(''),
    numero: z.string().optional().default(''),
    bairro: z.string().optional().default(''),
    complemento: z.string().optional().default(''),
    cidade: z.string().optional().default(''),
    _destroy: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data._destroy) {
      if (!data.rua || data.rua.trim().length < 2) {
        ctx.addIssue({
          code: 'custom',
          message: 'Rua é obrigatória',
          path: ['rua'],
        });
      }
      if (!data.numero || data.numero.trim().length < 1) {
        ctx.addIssue({
          code: 'custom',
          message: 'Número é obrigatório',
          path: ['numero'],
        });
      }
      if (!data.bairro || data.bairro.trim().length < 2) {
        ctx.addIssue({
          code: 'custom',
          message: 'Bairro é obrigatório',
          path: ['bairro'],
        });
      }
      if (!data.cidade || data.cidade.trim().length < 2) {
        ctx.addIssue({
          code: 'custom',
          message: 'Cidade é obrigatória',
          path: ['cidade'],
        });
      }
    }
  });

export type EnderecoFormData = z.infer<typeof enderecoSchema>;
