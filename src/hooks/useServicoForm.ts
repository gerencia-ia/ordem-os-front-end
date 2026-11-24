'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from '@/src/lib/zod-resolver';
import type { Andar } from '@/src/types/andar';
import {
  servicoFormSchema,
  type ServicoFormData,
  type Servico,
} from '@/src/types/servico';
import { getAndares } from '@/src/services/andares.service';
import { createServico, updateServico } from '@/src/services/servicos.service';

interface UseServicoFormOptions {
  servicoAtual?: Servico | null;
  aberto?: boolean;
  onSucesso: () => void;
}

export function useServicoForm({
  servicoAtual,
  aberto = true,
  onSucesso,
}: UseServicoFormOptions) {
  const [salvando, setSalvando] = useState(false);
  const [andares, setAndares] = useState<Andar[]>([]);
  const [carregandoAndares, setCarregandoAndares] = useState(false);

  const form = useForm<ServicoFormData>({
    resolver: zodResolver(servicoFormSchema),
    defaultValues: {
      nome: '',
      tempo_servico: null,
      categorias_servico_id: null,
      valores_por_andares_attributes: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'valores_por_andares_attributes',
    keyName: 'fieldKey',
  });

  useEffect(() => {
    if (!aberto) return;
    let ativo = true;

    async function carregarAndares() {
      try {
        const lista = await getAndares();
        if (ativo) setAndares(lista);
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar andares.';
          toast.error(msg);
        }
      } finally {
        if (ativo) setCarregandoAndares(false);
      }
    }

    void carregarAndares();

    return () => {
      ativo = false;
    };
  }, [aberto]);

  useEffect(() => {
    if (servicoAtual) {
      const catId =
        servicoAtual.categorias_servico_id ||
        servicoAtual.categorias_servico?.id ||
        servicoAtual.categoria?.id ||
        null;

      const valoresMapeados = (servicoAtual.valores_por_andares || []).map(
        (v) => ({
          id: v.id,
          andar_id: Number(v.andar_id),
          valor: Number(v.valor) || 0,
          _destroy: false,
        }),
      );

      form.reset({
        nome: servicoAtual.nome || '',
        tempo_servico: servicoAtual.tempo_servico || null,
        categorias_servico_id: catId ? Number(catId) : null,
        valores_por_andares_attributes: valoresMapeados,
      });
    } else {
      form.reset({
        nome: '',
        tempo_servico: null,
        categorias_servico_id: null,
        valores_por_andares_attributes: [],
      });
    }
  }, [servicoAtual, form]);

  const adicionarValorPorAndar = () => {
    const atuais = form.getValues('valores_por_andares_attributes') || [];
    const andaresUsados = new Set(
      atuais
        .filter((item) => !item._destroy)
        .map((item) => Number(item.andar_id)),
    );
    const proximoAndar = andares.find((a) => !andaresUsados.has(a.id));

    append({
      andar_id: proximoAndar ? proximoAndar.id : 0,
      valor: 0,
      _destroy: false,
    });
  };

  const removerValorPorAndar = (index: number) => {
    const item = form.getValues(`valores_por_andares_attributes.${index}`);
    if (item?.id) {
      update(index, { ...item, _destroy: true });
    } else {
      remove(index);
    }
  };

  const onSubmit = form.handleSubmit(async (dados: ServicoFormData) => {
    setSalvando(true);
    try {
      const valoresPayload = dados.valores_por_andares_attributes
        .filter((item) => item.id || !item._destroy)
        .map((item) => ({
          ...(item.id ? { id: item.id } : {}),
          andar_id: Number(item.andar_id),
          valor: Number(item.valor),
          ...(item._destroy ? { _destroy: true } : {}),
        }));

      const payload = {
        nome: dados.nome.trim(),
        tempo_servico: dados.tempo_servico ? Number(dados.tempo_servico) : null,
        categorias_servico_id: dados.categorias_servico_id
          ? Number(dados.categorias_servico_id)
          : null,
        valores_por_andares_attributes: valoresPayload,
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
    andares,
    carregandoAndares,
    valoresFields: fields,
    adicionarValorPorAndar,
    removerValorPorAndar,
    onSubmit,
  };
}
