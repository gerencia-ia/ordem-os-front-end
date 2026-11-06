import { z } from 'zod';
import type { Role } from './role';
import { validarCpf } from '@/src/utils/cpf';

export type { Role } from './role';

export interface User {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  role: Role | null;
}

export interface CreateUserPayload {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  role_id: number;
}

export interface UpdateUserPayload {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  senha?: string;
  role_id?: number;
}

export const usuarioFormSchema = z
  .object({
    nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    cpf: z
      .string()
      .min(11, 'CPF incompleto')
      .refine((val) => validarCpf(val), { message: 'CPF inválido' }),
    email: z.string().email('E-mail inválido'),
    telefone: z
      .string()
      .refine((val) => val.replace(/\D/g, '').length >= 10, {
        message: 'Telefone deve ter ao menos 10 dígitos com DDD',
      }),
    senha: z.string().optional().default(''),
    role_id: z.coerce.number().min(1, 'Selecione uma função'),
    isEdicao: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isEdicao) {
      if (!data.senha || data.senha.length < 6) {
        ctx.addIssue({
          code: 'custom',
          message: 'Senha deve ter no mínimo 6 caracteres',
          path: ['senha'],
        });
      }
    } else if (data.senha && data.senha.length > 0 && data.senha.length < 6) {
      ctx.addIssue({
        code: 'custom',
        message: 'Senha deve ter no mínimo 6 caracteres',
        path: ['senha'],
      });
    }
  });

export type UsuarioFormData = z.infer<typeof usuarioFormSchema>;
