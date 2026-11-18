'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@/src/lib/zod-resolver';
import {
  andarFormSchema,
  type AndarFormData,
  type Andar,
} from '@/src/types/andar';
import { createAndar, updateAndar } from '@/src/services/andares.service';

interface UseAndarFormOptions {
  andarAtual?: Andar | null;
  onSucesso: () => void;
}

export function useAndarForm({ andarAtual, onSucesso }: UseAndarFormOptions) {
  const [salvando, setSalvando] = useState(false);

  const form = useForm<AndarFormData>({
    resolver: zodResolver(andarFormSchema),
    defaultValues: {
      descricao: '',
    },
  });

  useEffect(() => {
    if (andarAtual) {
      form.reset({
        descricao: andarAtual.descricao || '',
      });
    } else {
      form.reset({
        descricao: '',
      });
    }
  }, [andarAtual, form]);

  const onSubmit = form.handleSubmit(async (dados: AndarFormData) => {
    setSalvando(true);
    try {
      if (andarAtual) {
        await updateAndar(andarAtual.id, {
          descricao: dados.descricao.trim(),
        });
        toast.success('Andar atualizado com sucesso!');
      } else {
        await createAndar({
          descricao: dados.descricao.trim(),
        });
        toast.success('Andar cadastrado com sucesso!');
      }

      form.reset();
      onSucesso();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar andar.';
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  });

  return {
    form,
    salvando,
    onSubmit,
  };
}
