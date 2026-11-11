'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@/src/lib/zod-resolver';
import {
  criarOrdemFormSchema,
  type CriarOrdemFormData,
  type CriarOrdemServicoPayload,
  type Status,
  type Prioridade,
} from '@/src/types/ordem';
import type { Servico } from '@/src/types/servico';
import type { Cliente } from '@/src/types/cliente';
import type { Usuario } from '@/src/types/usuario';
import type { Equipamento } from '@/src/types/equipamento';
import type { Material, MaterialOrdemInput } from '@/src/types/material';
import { getClientes } from '@/src/services/clientes.service';
import { getUsuarios } from '@/src/services/usuarios.service';
import { getServicos } from '@/src/services/servicos.service';
import { getStatus } from '@/src/services/status.service';
import { getPrioridades } from '@/src/services/prioridades.service';
import { getEquipamentosByCliente } from '@/src/services/equipamentos.service';
import { getMateriais } from '@/src/services/materiais.service';
import { createOrdem } from '@/src/services/ordens.service';
import { toast } from 'sonner';

interface UseOrdemFormProps {
  onSuccess?: () => void;
}

export function useOrdemForm({ onSuccess }: UseOrdemFormProps = {}) {
  const [salvando, setSalvando] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(false);

  // Listas de apoio
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [statusList, setStatusList] = useState<Status[]>([]);
  const [prioridadesList, setPrioridadesList] = useState<Prioridade[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [materiaisSelecionados, setMateriaisSelecionados] = useState<MaterialOrdemInput[]>([]);

  const form = useForm<CriarOrdemFormData>({
    resolver: zodResolver(criarOrdemFormSchema),
    defaultValues: {
      cliente_id: 0,
      endereco_id: 0,
      status_id: 0,
      prioridade_id: 0,
      data_agendamento: '',
      data_vencimento: '',
      descricao: '',
      observacao: '',
      servico_ids: [],
      equipamento_ids: [],
      tecnico_ids: [],
      custo_estimado: 0,
    },
  });

  const clienteIdSelecionado = useWatch({
    control: form.control,
    name: 'cliente_id',
  });

  const watchedServicoIds = useWatch({
    control: form.control,
    name: 'servico_ids',
  });
  const servicoIdsSelecionados = useMemo(
    () => watchedServicoIds || [],
    [watchedServicoIds],
  );

  const watchedEquipamentoIds = useWatch({
    control: form.control,
    name: 'equipamento_ids',
  });
  const equipamentoIdsSelecionados = useMemo(
    () => watchedEquipamentoIds || [],
    [watchedEquipamentoIds],
  );

  const watchedTecnicoIds = useWatch({
    control: form.control,
    name: 'tecnico_ids',
  });
  const tecnicoIdsSelecionados = useMemo(
    () => watchedTecnicoIds || [],
    [watchedTecnicoIds],
  );

  // Carregar dados de apoio iniciais
  useEffect(() => {
    let ativo = true;

    async function carregarApoio() {
      try {
        setLoadingDados(true);
        const [
          clientesData,
          usuariosData,
          servicosData,
          statusData,
          prioridadesData,
          materiaisData,
        ] = await Promise.all([
          getClientes(),
          getUsuarios(),
          getServicos(),
          getStatus(),
          getPrioridades(),
          getMateriais(),
        ]);

        if (ativo) {
          setClientes(clientesData);
          // Filtra apenas usuários com perfil técnico para atribuição de OS
          const apenasTecnicos = usuariosData.filter(
            (u) =>
              (u.role?.nome || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase() === 'tecnico',
          );
          setTecnicos(apenasTecnicos);
          setServicos(servicosData);
          setStatusList(statusData);
          setPrioridadesList(prioridadesData);
          setMateriais(materiaisData);

          // Pré-seleciona primeiro status e prioridade se existirem
          if (statusData.length > 0) {
            form.setValue('status_id', Number(statusData[0].id));
          }
          if (prioridadesData.length > 0) {
            form.setValue('prioridade_id', Number(prioridadesData[0].id));
          }
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
  }, [form]);

  // Cliente selecionado no formulário
  const clienteAtual = useMemo(() => {
    if (!clienteIdSelecionado) return null;
    return clientes.find((c) => c.id === Number(clienteIdSelecionado)) || null;
  }, [clientes, clienteIdSelecionado]);

  // Seleção e reset de dados dependentes do cliente
  const onClienteChange = useCallback(
    (novoClienteId: number) => {
      form.setValue('cliente_id', novoClienteId, { shouldValidate: true });
      if (!novoClienteId || novoClienteId <= 0) {
        setEquipamentos([]);
        form.setValue('endereco_id', 0);
        form.setValue('equipamento_ids', []);
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
    },
    [form, clientes],
  );

  // Carregar equipamentos do cliente quando selecionado
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

  // Cálculo do total de serviços em tempo real
  const valorTotalServicos = useMemo(() => {
    if (!servicoIdsSelecionados.length) return 0;
    return servicos
      .filter((s) => servicoIdsSelecionados.includes(s.id))
      .reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0);
  }, [servicos, servicoIdsSelecionados]);

  const valorTotalMateriais = useMemo(
    () => materiaisSelecionados.reduce((total, item) => total + Number(item.valor || 0), 0),
    [materiaisSelecionados],
  );

  const valorTotalItens = valorTotalServicos + valorTotalMateriais;

  // Atualiza custo_estimado no form sempre que serviços mudarem
  useEffect(() => {
    form.setValue('custo_estimado', valorTotalItens);
  }, [valorTotalItens, form]);

  const adicionarMaterial = useCallback((item: MaterialOrdemInput) => {
    setMateriaisSelecionados((atuais) => [...atuais, item]);
  }, []);

  const removerMaterial = useCallback((indice: number) => {
    setMateriaisSelecionados((atuais) => atuais.filter((_, i) => i !== indice));
  }, []);

  // Ações de alternância de IDs
  const toggleServico = useCallback(
    (servicoId: number) => {
      const atuais = form.getValues('servico_ids') || [];
      const novos = atuais.includes(servicoId)
        ? atuais.filter((id) => id !== servicoId)
        : [...atuais, servicoId];
      form.setValue('servico_ids', novos, { shouldValidate: true });
    },
    [form],
  );

  const toggleEquipamento = useCallback(
    (equipamentoId: number) => {
      const atuais = form.getValues('equipamento_ids') || [];
      const novos = atuais.includes(equipamentoId)
        ? atuais.filter((id) => id !== equipamentoId)
        : [...atuais, equipamentoId];
      form.setValue('equipamento_ids', novos, { shouldValidate: true });
    },
    [form],
  );

  const toggleTecnico = useCallback(
    (tecnicoId: number) => {
      const atuais = form.getValues('tecnico_ids') || [];
      const novos = atuais.includes(tecnicoId)
        ? atuais.filter((id) => id !== tecnicoId)
        : [...atuais, tecnicoId];
      form.setValue('tecnico_ids', novos, { shouldValidate: true });
    },
    [form],
  );

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

  const onSubmit = async (data: CriarOrdemFormData) => {
    try {
      setSalvando(true);

      const payload: CriarOrdemServicoPayload = {
        ordem_servico: {
          cliente_id: Number(data.cliente_id),
          endereco_id: Number(data.endereco_id),
          user_ids: data.tecnico_ids.map(Number),
          tecnico_ids: data.tecnico_ids.map(Number),
          equipamento_ids: data.equipamento_ids.map(Number),
          servico_ids: data.servico_ids.map(Number),
          descricao: data.descricao?.trim() || undefined,
          observacao: data.observacao?.trim() || undefined,
          status_id: Number(data.status_id),
          prioridade_id: Number(data.prioridade_id),
          data_agendamento: data.data_agendamento || undefined,
          data_vencimento: data.data_vencimento || undefined,
          custo_estimado: valorTotalItens,
          os_materiais_attributes: materiaisSelecionados,
        },
      };

      await createOrdem(payload);
      toast.success('Ordem de serviço criada com sucesso!');
      form.reset();
      setMateriaisSelecionados([]);
      onSuccess?.();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao criar ordem de serviço';
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  };

  return {
    form,
    salvando,
    loadingDados,
    loadingEquipamentos,
    clientes,
    clienteAtual,
    tecnicos,
    servicos,
    statusList,
    prioridadesList,
    equipamentos,
    materiais,
    materiaisSelecionados,
    adicionarMaterial,
    removerMaterial,
    servicoIdsSelecionados,
    equipamentoIdsSelecionados,
    tecnicoIdsSelecionados,
    valorTotalServicos,
    valorTotalMateriais,
    onClienteChange,
    toggleServico,
    toggleEquipamento,
    toggleTecnico,
    adicionarNovoEquipamento,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
