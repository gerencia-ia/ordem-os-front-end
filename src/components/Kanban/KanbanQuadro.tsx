'use client';

import { useKanban } from '@/src/hooks/useKanban';
import { KanbanFiltros } from './KanbanFiltros';
import { KanbanColuna } from './KanbanColuna';
import { OrdemModalCadastro } from '@/src/components/Ordens/OrdemModalCadastro';
import { Columns3, Loader2 } from 'lucide-react';
import type { OrdemServico } from '@/src/types/ordem';

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

type CategoriaStatus =
  | 'nao_iniciado'
  | 'em_progresso'
  | 'concluido'
  | 'cancelado';

function obterCategoriaStatus(
  statusId?: number | null,
  statusNome?: string | null,
): CategoriaStatus {
  const nomeNorm = normalizar(statusNome);

  // 1. Verificações por nome semântico (mais específico primeiro)
  if (nomeNorm.includes('nao iniciad')) {
    return 'nao_iniciado';
  }
  if (nomeNorm.includes('conclui') || nomeNorm.includes('finaliz')) {
    return 'concluido';
  }
  if (nomeNorm.includes('cancelad')) {
    return 'cancelado';
  }
  if (
    nomeNorm.includes('progresso') ||
    nomeNorm.includes('andamento') ||
    nomeNorm.includes('atendimento')
  ) {
    return 'em_progresso';
  }
  // Se houver ordens antigas com status "aberta" ou "agendada" (status sendo descontinuado),
  // mapeia para "Não iniciada" para manter visibilidade
  if (
    nomeNorm.includes('agendad') ||
    nomeNorm.includes('abert') ||
    nomeNorm.includes('aguardando')
  ) {
    return 'nao_iniciado';
  }

  // 2. Mapeamento por ID do banco de dados (Rails backend)
  const id = Number(statusId);
  if (id === 2 || id === 1) return 'nao_iniciado';
  if (id === 3) return 'em_progresso';
  if (id === 5) return 'concluido';
  if (id === 6) return 'cancelado';

  return 'nao_iniciado';
}

function pertenceAoStatus(
  ordem: OrdemServico,
  statusIdColuna: number,
  statusNomeColuna: string,
): boolean {
  const categoriaColuna = obterCategoriaStatus(
    statusIdColuna,
    statusNomeColuna,
  );

  const ordemStatusId = Number(ordem.status?.id || ordem.status_id || 0);
  const ordemStatusNome = ordem.status?.nome || ordem.status_descricao;
  const categoriaOrdem = obterCategoriaStatus(ordemStatusId, ordemStatusNome);

  return categoriaColuna === categoriaOrdem;
}

export function KanbanQuadro() {
  const {
    ordens,
    colunasStatus,
    loading,
    filtroMes,
    setFiltroMes,
    busca,
    setBusca,
    recarregar,
    draggedOrdemId,
    setDraggedOrdemId,
    colunaAtivaDrop,
    setColunaAtivaDrop,
    moverOrdem,
    modalCriarAberta,
    abrirModalCriarComStatus,
    fecharModalCriar,
  } = useKanban();

  const handleDragStart = (e: React.DragEvent, ordemId: number) => {
    setDraggedOrdemId(ordemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(ordemId));
  };

  const handleDragEnd = () => {
    setDraggedOrdemId(null);
    setColunaAtivaDrop(null);
  };

  const handleDragOver = (e: React.DragEvent, statusId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (colunaAtivaDrop !== statusId) {
      setColunaAtivaDrop(statusId);
    }
  };

  const handleDragLeave = () => {
    // Mantém suave
  };

  const handleDrop = async (e: React.DragEvent, statusId: number) => {
    e.preventDefault();
    const ordemId =
      draggedOrdemId || Number(e.dataTransfer.getData('text/plain'));
    if (!ordemId) return;

    await moverOrdem(ordemId, statusId);
  };

  return (
    <div className="p-6 flex flex-col gap-6 w-full">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Columns3 className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Quadro de Ordens (Kanban)
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie o fluxo operacional e transição de status das ordens de
            serviço por arrastar e soltar.
          </p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <KanbanFiltros
        filtroMes={filtroMes}
        onFiltroMesChange={setFiltroMes}
        busca={busca}
        onBuscaChange={setBusca}
        onNovaOrdem={() => abrirModalCriarComStatus()}
      />

      {/* Quadro de Colunas */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm">Carregando quadro de ordens...</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-6 items-start w-full scrollbar-thin">
          {colunasStatus.map((status) => {
            const statusId = Number(status.id);
            const ordensDaColuna = ordens.filter((o) =>
              pertenceAoStatus(o, statusId, status.nome),
            );

            return (
              <KanbanColuna
                key={status.id}
                status={status}
                ordens={ordensDaColuna}
                isOver={colunaAtivaDrop === statusId}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onNovaOrdem={() => abrirModalCriarComStatus(statusId)}
              />
            );
          })}
        </div>
      )}

      {/* Modal de Criação de OS integrado */}
      <OrdemModalCadastro
        aberto={modalCriarAberta}
        onOpenChange={(aberto) => {
          if (!aberto) fecharModalCriar();
        }}
        onSucesso={() => {
          fecharModalCriar();
          void recarregar();
        }}
      />
    </div>
  );
}
