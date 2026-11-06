'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/src/lib/zod-resolver';
import {
  usuarioFormSchema,
  type User,
  type UsuarioFormData,
} from '@/src/types/user';
import { createUser, updateUser } from '@/src/services/users.service';
import { toast } from 'sonner';

interface UseUsuarioFormProps {
  userParaEdicao?: User | null;
  roleIdPadrao?: number;
  onSuccess?: () => void;
}

export function useUsuarioForm({
  userParaEdicao,
  roleIdPadrao,
  onSuccess,
}: UseUsuarioFormProps = {}) {
  const [salvando, setSalvando] = useState(false);
  const isEdicao = Boolean(userParaEdicao);

  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioFormSchema),
    defaultValues: userParaEdicao
      ? {
          nome: userParaEdicao.nome || '',
          cpf: userParaEdicao.cpf || '',
          email: userParaEdicao.email || '',
          telefone: userParaEdicao.telefone || '',
          senha: '',
          role_id: userParaEdicao.role?.id
            ? Number(userParaEdicao.role.id)
            : undefined,
          isEdicao: true,
        }
      : {
          nome: '',
          cpf: '',
          email: '',
          telefone: '',
          senha: '',
          role_id: roleIdPadrao || ('' as unknown as number),
          isEdicao: false,
        },
  });

  const onSubmit = async (data: UsuarioFormData) => {
    try {
      setSalvando(true);

      if (userParaEdicao) {
        const payload: {
          nome: string;
          cpf: string;
          email: string;
          telefone: string;
          senha?: string;
          role_id?: number;
        } = {
          nome: data.nome.trim(),
          cpf: data.cpf.trim(),
          email: data.email.trim(),
          telefone: data.telefone.trim(),
          role_id: Number(data.role_id),
        };

        if (data.senha && data.senha.trim().length >= 6) {
          payload.senha = data.senha.trim();
        }

        await updateUser(userParaEdicao.id, payload);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        await createUser({
          nome: data.nome.trim(),
          cpf: data.cpf.trim(),
          email: data.email.trim(),
          telefone: data.telefone.trim(),
          senha: (data.senha || '').trim(),
          role_id: Number(data.role_id),
        });
        toast.success('Usuário cadastrado com sucesso!');
      }

      form.reset();
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar usuário';
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  };

  return {
    form,
    salvando,
    isEdicao,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
