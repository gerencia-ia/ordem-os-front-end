'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  categoriaFormSchema,
  type CategoriaFormData,
  type CategoriaServico,
} from '@/src/types/categoria';
import {
  createCategoria,
  updateCategoria,
} from '@/src/services/categorias.service';

interface UseCategoriaFormOptions {
  categoriaAtual?: CategoriaServico | null;
  onSucesso: () => void;
}

export function useCategoriaForm({
  categoriaAtual,
  onSucesso,
}: UseCategoriaFormOptions) {
  const [salvando, setSalvando] = useState(false);

  const form = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaFormSchema),
    defaultValues: {
      descricao: '',
    },
  });

  useEffect(() => {
    if (categoriaAtual) {
      form.reset({
        descricao: categoriaAtual.descricao || '',
      });
    } else {
      form.reset({
        descricao: '',
      });
    }
  }, [categoriaAtual, form]);

  const onSubmit = form.handleSubmit(async (dados: CategoriaFormData) => {
    setSalvando(true);
    try {
      if (categoriaAtual) {
        await updateCategoria(categoriaAtual.id, {
          descricao: dados.descricao.trim(),
        });
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await createCategoria({
          descricao: dados.descricao.trim(),
        });
        toast.success('Categoria cadastrada com sucesso!');
      }

      form.reset();
      onSucesso();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Erro ao salvar categoria de serviço.';
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
