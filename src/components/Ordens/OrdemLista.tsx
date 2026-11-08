'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { useOrdens } from '@/src/hooks/useOrdens';
import { usePermissions } from '@/src/hooks/usePermissions';
import { getUsuarios } from '@/src/services/usuarios.service';
import type { Usuario } from '@/src/types/usuario';
import type { OrdemServico } from '@/src/types/ordem';
import { OrdemFiltros } from './OrdemFiltros';
import { OrdemTabela } from './OrdemTabela';
import { OrdemModalCadastro } from './OrdemModalCadastro';
import { OrdemModalExcluir } from './OrdemModalExcluir';
import { ClipboardList, Plus } from 'lucide-react';

export function OrdemLista() {
  const { isTecnico } = usePermissions();
  const {
    ordens,
    ordensFiltradas,
    loading,
    filtros,
    setBusca,
    setFiltroStatus,
    setFiltroPrioridade,
    setFiltroTecnico,
    setFiltroData,
    limparFiltros,
    recarregar,
    excluirOrdem,
  } = useOrdens();

  const [modalCadastroAberta, setModalCadastroAberta] = useState(false);
  const [ordemParaExclusao, setOrdemParaExclusao] =
    useState<OrdemServico | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);

  // Carrega técnicos disponíveis para o filtro
  useEffect(() => {
    let ativo = true;
    async function carregarTecnicos() {
      try {
        const dados = await getUsuarios();
        if (ativo) {
          const apenasTecnicos = dados.filter(
            (u) =>
              (u.role?.nome || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase() === 'tecnico',
          );
          setTecnicos(apenasTecnicos);
        }
      } catch {
        if (ativo) setTecnicos([]);
      }
    }
    void carregarTecnicos();
    return () => {
      ativo = false;
    };
  }, []);

  const handleConfirmarExclusao = async (id: string | number) => {
    try {
      setExcluindo(true);
      await excluirOrdem(id);
    } finally {
      setExcluindo(false);
      setOrdemParaExclusao(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Ordens de Serviço
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie os atendimentos, manutenções e ordens de serviço.
          </p>
        </div>

        {/* Criação restrita para Admin e Secretaria */}
        {!isTecnico && (
          <Button
            onClick={() => setModalCadastroAberta(true)}
            className="gap-1.5 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Nova Ordem
          </Button>
        )}
      </div>

      {/* Card Principal com Filtros e Tabela */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
          <OrdemFiltros
            busca={filtros.busca}
            filtroStatus={filtros.status}
            filtroPrioridade={filtros.prioridade}
            filtroTecnico={filtros.tecnico}
            filtroData={filtros.data}
            tecnicos={tecnicos}
            totalOrdens={ordens.length}
            totalFiltradas={ordensFiltradas.length}
            onBuscaChange={setBusca}
            onStatusChange={setFiltroStatus}
            onPrioridadeChange={setFiltroPrioridade}
            onTecnicoChange={setFiltroTecnico}
            onDataChange={setFiltroData}
            onLimparFiltros={limparFiltros}
          />
        </CardHeader>
        <CardContent>
          <OrdemTabela
            ordens={ordensFiltradas}
            loading={loading}
            onExcluir={(ordem) => setOrdemParaExclusao(ordem)}
            onLimparFiltros={limparFiltros}
          />
        </CardContent>
      </Card>

      {/* Modal de Criação Desacoplado */}
      {!isTecnico && (
        <OrdemModalCadastro
          aberto={modalCadastroAberta}
          onOpenChange={setModalCadastroAberta}
          onSucesso={recarregar}
        />
      )}

      {/* Modal de Exclusão com Confirmação */}
      <OrdemModalExcluir
        ordem={ordemParaExclusao}
        aberto={ordemParaExclusao !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setOrdemParaExclusao(null);
        }}
        onConfirmar={handleConfirmarExclusao}
        excluindo={excluindo}
      />
    </div>
  );
}
