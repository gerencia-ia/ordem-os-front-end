'use client';

import { Badge } from '@/src/components/Ui/badge';
import { Button } from '@/src/components/Ui/button';
import { Plus } from 'lucide-react';
import type { OrdemServico, Status } from '@/src/types/ordem';
import { KanbanCartao } from './KanbanCartao';

interface KanbanColunaProps {
  status: Status;
  ordens: OrdemServico[];
  isOver: boolean;
  onDragStart: (e: React.DragEvent, ordemId: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, statusId: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, statusId: number) => void;
  onNovaOrdem: (statusId: number) => void;
}

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function getCoresColuna(nome: string) {
  const norm = normalizar(nome);

  if (norm.includes('nao iniciad')) {
    return {
      header: 'text-slate-700 dark:text-slate-300',
      badge:
        'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      container: 'border-slate-200/80 bg-slate-50/40 dark:bg-slate-900/20',
    };
  }
  if (norm.includes('agendad') || norm.includes('abert')) {
    return {
      header: 'text-amber-800 dark:text-amber-300',
      badge:
        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      container: 'border-amber-200/60 bg-amber-50/20 dark:bg-amber-950/10',
    };
  }
  if (norm.includes('progresso') || norm.includes('andamento')) {
    return {
      header: 'text-blue-800 dark:text-blue-300',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      container: 'border-blue-200/60 bg-blue-50/20 dark:bg-blue-950/10',
    };
  }
  if (norm.includes('conclui')) {
    return {
      header: 'text-emerald-800 dark:text-emerald-300',
      badge:
        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      container:
        'border-emerald-200/60 bg-emerald-50/20 dark:bg-emerald-950/10',
    };
  }
  if (norm.includes('cancelad')) {
    return {
      header: 'text-red-800 dark:text-red-300',
      badge: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
      container: 'border-red-200/60 bg-red-50/20 dark:bg-red-950/10',
    };
  }

  return {
    header: 'text-foreground',
    badge: 'bg-muted text-muted-foreground',
    container: 'border-border/60 bg-muted/10',
  };
}

export function KanbanColuna({
  status,
  ordens,
  isOver,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  onNovaOrdem,
}: KanbanColunaProps) {
  const statusId = Number(status.id);
  const cores = getCoresColuna(status.nome);

  return (
    <div className="flex flex-col rounded-xl border border-border/70 bg-card/60 p-3 min-w-[280px] flex-1">
      {/* Topo da Coluna */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-border/40">
        <h2 className={`font-semibold text-sm ${cores.header}`}>
          {status.nome}
        </h2>
        <Badge
          variant="outline"
          className={`text-xs font-mono font-medium ${cores.badge}`}
        >
          {ordens.length}
        </Badge>
      </div>

      {/* Área de Drop */}
      <div
        onDragOver={(e) => onDragOver(e, statusId)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, statusId)}
        className={`flex-1 min-h-[460px] rounded-lg p-2.5 mt-2.5 transition-all flex flex-col gap-2.5 ${cores.container} ${
          isOver
            ? 'ring-2 ring-primary/80 ring-offset-2 bg-primary/5 border-primary/50'
            : ''
        }`}
      >
        {ordens.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {ordens.map((ordem) => (
              <KanbanCartao
                key={ordem.id}
                ordem={ordem}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-44 text-xs text-muted-foreground/60 italic border border-dashed rounded-lg">
            Nenhuma ordem neste status
          </div>
        )}

        {/* Botão de Adicionar Ordem Rápida */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNovaOrdem(statusId)}
          className="w-full text-xs text-muted-foreground hover:text-foreground border border-dashed border-border/70 hover:border-border mt-3 gap-1.5"
        >
          <Plus className="size-3.5" />
          Adicionar Ordem
        </Button>
      </div>
    </div>
  );
}
