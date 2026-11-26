'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@/src/lib/zod-resolver';
import { DADOS_EMPRESA } from '@/src/lib/empresa';
import {
  orcamentoFormSchema,
  type AtualizarOrcamentoPayload,
  type CriarOrcamentoPayload,
  type Orcamento,
  type OrcamentoFormData,
  type OrcamentoMaterialInput,
  type OrcamentoServicoInput,
  type OrcamentoStatusEditavel,
} from '@/src/types/orcamento';
import type { Servico } from '@/src/types/servico';
import type { Cliente } from '@/src/types/cliente';
import type { Equipamento } from '@/src/types/equipamento';
import type { Material, MaterialOrdemInput } from '@/src/types/material';
import { getClientes } from '@/src/services/clientes.service';
import { getServicos } from '@/src/services/servicos.service';
import { getEquipamentosByCliente } from '@/src/services/equipamentos.service';
import { getMateriais } from '@/src/services/materiais.service';
import {
  createOrcamento,
  updateOrcamento,
} from '@/src/services/orcamentos.service';
import { toast } from 'sonner';

export interface MaterialOrcamentoFormItem extends MaterialOrdemInput {
  id?: number;
}

interface UseOrcamentoFormProps {
  orcamentoInicial?: Orcamento | null;
  onSuccess?: () => void;
}

function calcularDataValidadePadrao(): string {
  const data = new Date();
  data.setDate(data.getDate() + DADOS_EMPRESA.validadePadraoDias);
  return data.toISOString().split('T')[0];
}

function normalizarDataInput(dataStr?: string | null): string {
  if (!dataStr) return '';
  return dataStr.split('T')[0];
}

export function useOrcamentoForm({
  orcamentoInicial,
  onSuccess,
}: UseOrcamentoFormProps = {}) {
  const isEdicao = Boolean(orcamentoInicial?.id);

  const [salvando, setSalvando] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(false);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [materiaisSelecionados, setMateriaisSelecionados] = useState<
    MaterialOrcamentoFormItem[]
  >(() =>
    (orcamentoInicial?.materiais || []).map((m) => ({
      id: m.id,
      material_id: m.material_id,
      nome_material: m.nome,
      valor: Number(m.valor) || 0,
    })),
  );

  const statusInicial: OrcamentoStatusEditavel =
    orcamentoInicial?.status && orcamentoInicial.status !== 'convertido'
      ? orcamentoInicial.status
      : 'rascunho';

  const form = useForm<OrcamentoFormData>({
    resolver: zodResolver(orcamentoFormSchema),
    defaultValues: {
      cliente_id: orcamentoInicial?.cliente?.id ?? 0,
      endereco_id: orcamentoInicial?.endereco?.id ?? 0,
      status: statusInicial,
      data_validade: orcamentoInicial
        ? normalizarDataInput(orcamentoInicial.data_validade)
        : calcularDataValidadePadrao(),
      desconto: orcamentoInicial ? Number(orcamentoInicial.desconto) || 0 : 0,
      condicoes_pagamento:
        orcamentoInicial?.condicoes_pagamento ?? DADOS_EMPRESA.condicoesPadrao,
      observacao: orcamentoInicial?.observacao ?? '',
      equipamento_ids: (orcamentoInicial?.equipamentos || []).map((eq) =>
        Number(eq.equipamento_id ?? eq.id),
      ),
      orcamento_servicos: (orcamentoInicial?.servicos || []).map((srv) => ({
        equipamento_id: Number(srv.equipamento_id),
        valor_por_andar_id: Number(srv.valor_por_andar_id),
        quantidade: Number(srv.quantidade) || 1,
      })),
    },
  });

  const clienteIdSelecionado = useWatch({
    control: form.control,
    name: 'cliente_id',
  });

  const watchedServicos = useWatch({
    control: form.control,
    name: 'orcamento_servicos',
  });
  const orcamentoServicosSelecionados = useMemo(
    () => watchedServicos || [],
    [watchedServicos],
  );

  const watchedEquipamentoIds = useWatch({
    control: form.control,
    name: 'equipamento_ids',
  });
  const equipamentoIdsSelecionados = useMemo(
    () => watchedEquipamentoIds || [],
    [watchedEquipamentoIds],
  );

  const watchedDesconto = useWatch({
    control: form.control,
    name: 'desconto',
  });

  useEffect(() => {
    let ativo = true;

    async function carregarApoio() {
      try {
        setLoadingDados(true);
        const [clientesData, servicosData, materiaisData] = await Promise.all([
          getClientes(),
          getServicos(),
          getMateriais(),
        ]);

        if (ativo) {
          setClientes(clientesData);
          setServicos(servicosData);
          setMateriais(materiaisData);
        }
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Erro ao carregar dados do formulário';
          toast.error(msg);
        }
      } finally {
        if (ativo) {
          setLoadingDados(false);
        }
      }
    }

    void carregarApoio();

    return () => {
      ativo = false;
    };
  }, []);

  const clienteAtual = useMemo(() => {
    if (!clienteIdSelecionado) return null;
    return clientes.find((c) => c.id === Number(clienteIdSelecionado)) || null;
  }, [clientes, clienteIdSelecionado]);

  const onClienteChange = useCallback(
    (novoClienteId: number) => {
      form.setValue('cliente_id', novoClienteId, { shouldValidate: true });
      if (!novoClienteId || novoClienteId <= 0) {
        setEquipamentos([]);
        form.setValue('endereco_id', 0);
        form.setValue('equipamento_ids', []);
        form.setValue('orcamento_servicos', []);
        return;
      }

      const cliente = clientes.find((c) => c.id === novoClienteId);
      const enderecos = cliente?.enderecos || [];
      if (enderecos.length === 1 && enderecos[0].id) {
        form.setValue('endereco_id', Number(enderecos[0].id), {
          shouldValidate: true,
        });
      } else {
        form.setValue('endereco_id', 0);
      }
      form.setValue('equipamento_ids', []);
      form.setValue('orcamento_servicos', []);
    },
    [form, clientes],
  );

  useEffect(() => {
    if (!clienteIdSelecionado || Number(clienteIdSelecionado) <= 0) {
      return;
    }

    let ativo = true;

    async function buscarEquipamentos() {
      try {
        setLoadingEquipamentos(true);
        const eqData = await getEquipamentosByCliente(clienteIdSelecionado);
        if (ativo) {
          setEquipamentos(eqData);
        }
      } catch {
        if (ativo) {
          setEquipamentos([]);
        }
      } finally {
        if (ativo) {
          setLoadingEquipamentos(false);
        }
      }
    }

    void buscarEquipamentos();

    return () => {
      ativo = false;
    };
  }, [clienteIdSelecionado]);

  const valorTotalServicos = useMemo(() => {
    if (!orcamentoServicosSelecionados.length) return 0;

    const mapaValores = new Map<number, number>();
    for (const servico of servicos) {
      for (const vpa of servico.valores_por_andares || []) {
        mapaValores.set(Number(vpa.id), Number(vpa.valor) || 0);
      }
    }

    return orcamentoServicosSelecionados.reduce((acc, item) => {
      const valorUnitario =
        mapaValores.get(Number(item.valor_por_andar_id)) || 0;
      const qtd = Number(item.quantidade) || 1;
      return acc + valorUnitario * qtd;
    }, 0);
  }, [servicos, orcamentoServicosSelecionados]);

  const valorTotalMateriais = useMemo(
    () =>
      materiaisSelecionados.reduce(
        (total, item) => total + Number(item.valor || 0),
        0,
      ),
    [materiaisSelecionados],
  );

  const subtotalBruto = valorTotalServicos + valorTotalMateriais;
  const descontoNumerico = Math.max(0, Number(watchedDesconto) || 0);
  const valorTotalFinal = Math.max(0, subtotalBruto - descontoNumerico);

  const adicionarMaterial = useCallback((item: MaterialOrdemInput) => {
    setMateriaisSelecionados((atuais) => [...atuais, item]);
  }, []);

  const removerMaterial = useCallback((indice: number) => {
    setMateriaisSelecionados((atuais) => atuais.filter((_, i) => i !== indice));
  }, []);

  const adicionarNovoEquipamento = useCallback(
    (novoEq: Equipamento) => {
      setEquipamentos((prev) => [novoEq, ...prev]);
      const idNum = Number(novoEq.id);
      const atuais = form.getValues('equipamento_ids') || [];
      if (!atuais.includes(idNum)) {
        form.setValue('equipamento_ids', [...atuais, idNum], {
          shouldValidate: true,
        });
      }
    },
    [form],
  );

  const adicionarNovoCliente = useCallback(
    async (novoCliente?: Cliente) => {
      if (novoCliente?.id) {
        const novoId = Number(novoCliente.id);
        setClientes((prev) => [
          novoCliente,
          ...prev.filter((c) => c.id !== novoId),
        ]);
        form.setValue('cliente_id', novoId, { shouldValidate: true });

        const enderecos = novoCliente.enderecos || [];
        if (enderecos.length === 1 && enderecos[0].id) {
          form.setValue('endereco_id', Number(enderecos[0].id), {
            shouldValidate: true,
          });
        } else {
          form.setValue('endereco_id', 0);
        }
        form.setValue('equipamento_ids', []);
        form.setValue('orcamento_servicos', []);
        return;
      }

      try {
        const lista = await getClientes();
        setClientes(lista);
      } catch {
        // Silencioso: lista mantida caso falhe
      }
    },
    [form],
  );

  const setEquipamentosSelecionados = useCallback(
    (ids: number[]) => {
      form.setValue('equipamento_ids', ids, { shouldValidate: true });
      const servicosAtuais = form.getValues('orcamento_servicos') || [];
      const filtrados = servicosAtuais.filter((s) =>
        ids.includes(Number(s.equipamento_id)),
      );
      if (filtrados.length !== servicosAtuais.length) {
        form.setValue('orcamento_servicos', filtrados, {
          shouldValidate: true,
        });
      }
    },
    [form],
  );

  const setServicosPorEquipamento = useCallback(
    (equipamentoId: number, valorPorAndarIds: number[]) => {
      const atuais = form.getValues('orcamento_servicos') || [];
      const outrosEquipamentos = atuais.filter(
        (item) => Number(item.equipamento_id) !== equipamentoId,
      );
      const atuaisDoEquipamento = atuais.filter(
        (item) => Number(item.equipamento_id) === equipamentoId,
      );

      const novosDoEquipamento = valorPorAndarIds.map((vpaId) => {
        const existente = atuaisDoEquipamento.find(
          (item) => Number(item.valor_por_andar_id) === vpaId,
        );
        return (
          existente ?? {
            equipamento_id: equipamentoId,
            valor_por_andar_id: vpaId,
            quantidade: 1,
          }
        );
      });

      form.setValue(
        'orcamento_servicos',
        [...outrosEquipamentos, ...novosDoEquipamento],
        { shouldValidate: true },
      );
    },
    [form],
  );

  const atualizarQuantidadeServico = useCallback(
    (equipamentoId: number, valorPorAndarId: number, quantidade: number) => {
      const qtdValida = Math.max(1, Math.floor(quantidade) || 1);
      const atuais = form.getValues('orcamento_servicos') || [];
      const novos = atuais.map((item) =>
        Number(item.equipamento_id) === equipamentoId &&
        Number(item.valor_por_andar_id) === valorPorAndarId
          ? { ...item, quantidade: qtdValida }
          : item,
      );
      form.setValue('orcamento_servicos', novos, { shouldValidate: true });
    },
    [form],
  );

  const onSubmit = async (data: OrcamentoFormData) => {
    if (
      data.orcamento_servicos.length === 0 &&
      materiaisSelecionados.length === 0
    ) {
      toast.error('Adicione pelo menos um serviço ou material ao orçamento.');
      return;
    }

    try {
      setSalvando(true);

      if (isEdicao && orcamentoInicial) {
        // Diff de serviços para accepts_nested_attributes_for com allow_destroy
        const servicosOriginais = orcamentoInicial.servicos || [];
        const servicosAttributes: OrcamentoServicoInput[] = [];

        for (const s of data.orcamento_servicos) {
          const original = servicosOriginais.find(
            (orig) =>
              Number(orig.equipamento_id) === Number(s.equipamento_id) &&
              Number(orig.valor_por_andar_id) === Number(s.valor_por_andar_id),
          );
          if (original) {
            servicosAttributes.push({
              id: original.id,
              equipamento_id: Number(s.equipamento_id),
              valor_por_andar_id: Number(s.valor_por_andar_id),
              quantidade: Number(s.quantidade) || 1,
            });
          } else {
            servicosAttributes.push({
              equipamento_id: Number(s.equipamento_id),
              valor_por_andar_id: Number(s.valor_por_andar_id),
              quantidade: Number(s.quantidade) || 1,
            });
          }
        }

        for (const orig of servicosOriginais) {
          const aindaExiste = data.orcamento_servicos.some(
            (s) =>
              Number(s.equipamento_id) === Number(orig.equipamento_id) &&
              Number(s.valor_por_andar_id) === Number(orig.valor_por_andar_id),
          );
          if (!aindaExiste) {
            servicosAttributes.push({ id: orig.id, _destroy: true });
          }
        }

        // Diff de materiais
        const materiaisOriginais = orcamentoInicial.materiais || [];
        const materiaisAttributes: OrcamentoMaterialInput[] = [];
        const idsMateriaisMantidos = new Set<number>();

        for (const m of materiaisSelecionados) {
          if (m.id) {
            idsMateriaisMantidos.add(m.id);
            materiaisAttributes.push({
              id: m.id,
              material_id: m.material_id,
              nome_material: m.nome_material,
              valor: Number(m.valor),
            });
          } else {
            materiaisAttributes.push({
              material_id: m.material_id,
              nome_material: m.nome_material,
              valor: Number(m.valor),
            });
          }
        }

        for (const orig of materiaisOriginais) {
          if (!idsMateriaisMantidos.has(orig.id)) {
            materiaisAttributes.push({ id: orig.id, _destroy: true });
          }
        }

        const payloadUpdate: AtualizarOrcamentoPayload = {
          orcamento: {
            cliente_id: Number(data.cliente_id),
            endereco_id: Number(data.endereco_id),
            status: data.status,
            data_validade: data.data_validade || null,
            desconto: Number(data.desconto) || 0,
            condicoes_pagamento: data.condicoes_pagamento?.trim() || null,
            observacao: data.observacao?.trim() || null,
            equipamento_ids: data.equipamento_ids.map(Number),
            orcamento_servicos_attributes: servicosAttributes,
            orcamento_materiais_attributes: materiaisAttributes,
          },
        };

        await updateOrcamento(orcamentoInicial.id, payloadUpdate);
        toast.success('Orçamento atualizado com sucesso!');
      } else {
        const payloadCreate: CriarOrcamentoPayload = {
          orcamento: {
            cliente_id: Number(data.cliente_id),
            endereco_id: Number(data.endereco_id),
            status: data.status,
            data_validade: data.data_validade || undefined,
            desconto: Number(data.desconto) || 0,
            condicoes_pagamento: data.condicoes_pagamento?.trim() || undefined,
            observacao: data.observacao?.trim() || undefined,
            equipamento_ids: data.equipamento_ids.map(Number),
            orcamento_servicos_attributes: data.orcamento_servicos.map((s) => ({
              equipamento_id: Number(s.equipamento_id),
              valor_por_andar_id: Number(s.valor_por_andar_id),
              quantidade: Number(s.quantidade) || 1,
            })),
            orcamento_materiais_attributes: materiaisSelecionados.map((m) => ({
              material_id: m.material_id,
              nome_material: m.nome_material,
              valor: Number(m.valor),
            })),
          },
        };

        await createOrcamento(payloadCreate);
        toast.success('Orçamento criado com sucesso!');
        form.reset();
        setMateriaisSelecionados([]);
      }

      onSuccess?.();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao salvar orçamento';
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  };

  return {
    form,
    isEdicao,
    salvando,
    loadingDados,
    loadingEquipamentos,
    clientes,
    clienteAtual,
    servicos,
    equipamentos,
    materiais,
    materiaisSelecionados,
    adicionarMaterial,
    removerMaterial,
    orcamentoServicosSelecionados,
    equipamentoIdsSelecionados,
    valorTotalServicos,
    valorTotalMateriais,
    subtotalBruto,
    descontoNumerico,
    valorTotalFinal,
    onClienteChange,
    setEquipamentosSelecionados,
    setServicosPorEquipamento,
    atualizarQuantidadeServico,
    adicionarNovoEquipamento,
    adicionarNovoCliente,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
