'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  servicoFormSchema,
  type ServicoFormData,
  type Servico,
} from '@/src/types/servico';
import { createServico, updateServico } from '@/src/services/servicos.service';

interface UseServicoFormOptions {
  servicoAtual?: Servico | null;
  onSucesso: () => void;
}

export function useServicoForm({
  servicoAtual,
  onSucesso,
}: UseServicoFormOptions) {
  const [salvando, setSalvando] = useState(false);

  const form = useForm<ServicoFormData>({
    resolver: zodResolver(servicoFormSchema),
    defaultValues: {
      nome: '',
      valor: 0,
      tempo_servico: null,
      categorias_servico_id: null,
    },
  });

  useEffect(() => {
    if (servicoAtual) {
      const catId =
        servicoAtual.categorias_servico_id ||
        servicoAtual.categorias_servico?.id ||
        servicoAtual.categoria?.id ||
        null;

      form.reset({
        nome: servicoAtual.nome || '',
        valor: Number(servicoAtual.valor) || 0,
        tempo_servico: servicoAtual.tempo_servico || null,
        categorias_servico_id: catId ? Number(catId) : null,
      });
    } else {
      form.reset({
        nome: '',
        valor: 0,
        tempo_servico: null,
        categorias_servico_id: null,
      });
    }
  }, [servicoAtual, form]);

  const onSubmit = form.handleSubmit(async (dados: ServicoFormData) => {
    setSalvando(true);
    try {
      const payload = {
        nome: dados.nome.trim(),
        valor: Number(dados.valor),
        tempo_servico: dados.tempo_servico ? Number(dados.tempo_servico) : null,
        categorias_servico_id: dados.categorias_servico_id
          ? Number(dados.categorias_servico_id)
          : null,
      };

      if (servicoAtual) {
        await updateServico(servicoAtual.id, payload);
        toast.success('Serviço atualizado com sucesso!');
      } else {
        await createServico(payload);
        toast.success('Serviço cadastrado com sucesso!');
      }

      form.reset();
      onSucesso();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao salvar serviço.';
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
