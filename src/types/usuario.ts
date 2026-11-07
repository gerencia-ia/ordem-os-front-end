import { z } from 'zod';
import type { Role } from './role';
import { validarCpf } from '@/src/utils/cpf';

export type { Role } from './role';

export interface Usuario {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  role: Role | null;
  role_id?: number;
}

// Alias de retrocompatibilidade
export type User = Usuario;

export interface CriarUsuarioPayload {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  senha: string;
  password?: string;
  role_id: number;
}

export type CreateUserPayload = CriarUsuarioPayload;

export interface AtualizarUsuarioPayload {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  senha?: string;
  password?: string;
  role_id?: number;
}

export type UpdateUserPayload = AtualizarUsuarioPayload;

export const usuarioFormSchema = z
  .object({
    nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    cpf: z
      .string()
      .min(11, 'CPF incompleto')
      .refine((val) => validarCpf(val), { message: 'CPF inválido' }),
    email: z.string().email('E-mail inválido'),
    telefone: z.string().refine((val) => val.replace(/\D/g, '').length >= 10, {
      message: 'Telefone deve ter ao menos 10 dígitos com DDD',
    }),
    senha: z.string().optional().default(''),
    role_id: z.coerce.number().min(1, 'A função do usuário é obrigatória'),
    isEdicao: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.role_id || Number(data.role_id) <= 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'A função do usuário é obrigatória',
        path: ['role_id'],
      });
    }

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
