import { z } from 'zod';

export interface Telefone {
  id?: number;
  numero: string;
  cliente_id?: number;
  created_at?: string;
  updated_at?: string;
  _destroy?: boolean;
}

export const telefoneSchema = z
  .object({
    id: z.number().optional(),
    numero: z.string().default(''),
    _destroy: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data._destroy) {
      const digitos = (data.numero || '').replace(/\D/g, '');
      if (digitos.length < 10) {
        ctx.addIssue({
          code: 'custom',
          message: 'Telefone deve ter ao menos 10 dígitos com DDD',
          path: ['numero'],
        });
      }
    }
  });

export type TelefoneFormData = z.infer<typeof telefoneSchema>;
