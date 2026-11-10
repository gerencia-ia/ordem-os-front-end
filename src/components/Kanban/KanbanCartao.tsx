'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/src/components/Ui/card';
import { PrioridadeBadge } from '@/src/components/Ui/status-badge';
import { Calendar, User, HardHat, ArrowUpRight } from 'lucide-react';
import type { OrdemServico } from '@/src/types/ordem';
import { formatarDataHoraCurta } from '@/src/utils/date';

interface KanbanCartaoProps {
  ordem: OrdemServico;
  onDragStart: (e: React.DragEvent, ordemId: number) => void;
  onDragEnd: () => void;
}

export function KanbanCartao({
  ordem,
  onDragStart,
  onDragEnd,
}: KanbanCartaoProps) {
  const prioridadeNome =
    ordem.prioridade?.descricao || ordem.prioridade_descricao || 'Normal';

  // Normaliza técnico responsável
  const tecnicoNome =
    ordem.tecnico_responsavel?.nome ||
    (Array.isArray(ordem.tecnicos) && ordem.tecnicos.length > 0
      ? ordem.tecnicos[0]?.nome
      : undefined);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, ordem.id)}
      onDragEnd={onDragEnd}
      className="cursor-grab active:cursor-grabbing transition-transform hover:-translate-y-0.5"
    >
      <Link href={`/ordens/${ordem.id}`}>
        <Card className="hover:border-primary/50 hover:shadow-md transition-all group bg-card py-0 gap-0">
          <CardContent className="p-3.5 flex flex-col gap-2.5">
            {/* Topo do Card: Número e Prioridade */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-primary flex items-center gap-1">
                #{ordem.numero_ordem || ordem.id}
                <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <PrioridadeBadge
                prioridade={prioridadeNome}
                className="text-[10px] px-2 py-0.5"
              />
            </div>

            {/* Descrição */}
            {ordem.descricao && (
              <p className="text-xs text-foreground font-medium line-clamp-2 leading-relaxed">
                {ordem.descricao}
              </p>
            )}

            {/* Detalhes de Rodapé */}
            <div className="pt-2 border-t border-border/40 flex flex-col gap-1 text-[11px] text-muted-foreground">
              {ordem.cliente?.nome && (
                <div className="flex items-center gap-1.5 truncate">
                  <User className="size-3 shrink-0 text-muted-foreground/70" />
                  <span className="truncate">{ordem.cliente.nome}</span>
                </div>
              )}

              {ordem.data_agendamento && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3 shrink-0 text-muted-foreground/70" />
                  <span>{formatarDataHoraCurta(ordem.data_agendamento)}</span>
                </div>
              )}

              {tecnicoNome && (
                <div className="flex items-center gap-1.5 truncate">
                  <HardHat className="size-3 shrink-0 text-muted-foreground/70" />
                  <span className="truncate">{tecnicoNome}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
