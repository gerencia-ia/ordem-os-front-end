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

function pertenceAoStatus(
  ordem: OrdemServico,
  statusId: number,
  statusNome: string,
) {
  const ordemStatusId = Number(ordem.status?.id || ordem.status_id || 0);
  if (ordemStatusId === statusId) return true;

  const nomeAtual = normalizar(ordem.status?.nome || ordem.status_descricao);
  const nomeAlvo = normalizar(statusNome);

  if (
    nomeAlvo.includes('agendad') &&
    (nomeAtual.includes('agendad') || nomeAtual.includes('abert'))
  ) {
    return true;
  }
  if (
    (nomeAlvo.includes('progresso') || nomeAlvo.includes('andamento')) &&
    (nomeAtual.includes('progresso') || nomeAtual.includes('andamento'))
  ) {
    return true;
  }
  if (nomeAlvo.includes('conclui') && nomeAtual.includes('conclui')) {
    return true;
  }
  if (nomeAlvo.includes('cancelad') && nomeAtual.includes('cancelad')) {
    return true;
  }

  return false;
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
    <div className="p-6 flex flex-col gap-6 max-w-[1600px] mx-auto">
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
        <div className="flex gap-4 overflow-x-auto pb-6 items-start scrollbar-thin">
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
