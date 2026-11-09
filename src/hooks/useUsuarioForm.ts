'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/src/lib/zod-resolver';
import {
  usuarioFormSchema,
  type Usuario,
  type UsuarioFormData,
} from '@/src/types/usuario';
import { createUsuario, updateUsuario } from '@/src/services/usuarios.service';
import { toast } from 'sonner';

interface UseUsuarioFormProps {
  userParaEdicao?: Usuario | null;
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
          password?: string;
          role_id?: number;
        } = {
          nome: data.nome.trim(),
          cpf: data.cpf.replace(/\D/g, ''),
          email: data.email.trim(),
          telefone: data.telefone.replace(/\D/g, ''),
          role_id: Number(data.role_id),
        };

        if (data.senha && data.senha.trim().length >= 6) {
          payload.password = data.senha.trim();
        }

        await updateUsuario(userParaEdicao.id, payload);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        const senhaLimpa = (data.senha || '').trim();
        await createUsuario({
          nome: data.nome.trim(),
          cpf: data.cpf.replace(/\D/g, ''),
          email: data.email.trim(),
          telefone: data.telefone.replace(/\D/g, ''),
          password: senhaLimpa,
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
