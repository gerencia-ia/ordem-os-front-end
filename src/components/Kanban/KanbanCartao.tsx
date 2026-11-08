'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Calendar, User, HardHat, ArrowUpRight } from 'lucide-react';
import type { OrdemServico } from '@/src/types/ordem';
import type { Usuario } from '@/src/types/usuario';
import { formatadores } from '@/src/lib/utilitarios';

interface KanbanCartaoProps {
  ordem: OrdemServico;
  onDragStart: (e: React.DragEvent, ordemId: number) => void;
  onDragEnd: () => void;
}

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function getBadgePrioridade(prioridade?: string | null) {
  const norm = normalizar(prioridade);
  const cores: Record<string, string> = {
    critica: 'bg-red-600 text-white border-transparent',
    alta: 'bg-orange-500 text-white border-transparent',
    media: 'bg-amber-500 text-white border-transparent',
    baixa: 'bg-blue-500 text-white border-transparent',
  };
  return cores[norm] || 'bg-muted text-muted-foreground';
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
    (Array.isArray(ordem.tecnicos)
      ? ordem.tecnicos[0]?.nome
      : (ordem.tecnicos as Usuario | null)?.nome);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, ordem.id)}
      onDragEnd={onDragEnd}
      className="cursor-grab active:cursor-grabbing transition-transform hover:-translate-y-0.5"
    >
      <Link href={`/ordens/${ordem.id}`}>
        <Card className="hover:border-primary/50 hover:shadow-md transition-all group bg-card">
          <CardContent className="p-3.5 space-y-2.5">
            {/* Topo do Card: Número e Prioridade */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-primary flex items-center gap-1">
                #{ordem.numero_ordem || ordem.id}
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <Badge
                className={`text-[10px] px-2 py-0.5 font-medium ${getBadgePrioridade(
                  prioridadeNome,
                )}`}
              >
                {prioridadeNome}
              </Badge>
            </div>

            {/* Descrição */}
            {ordem.descricao && (
              <p className="text-xs text-foreground font-medium line-clamp-2 leading-relaxed">
                {ordem.descricao}
              </p>
            )}

            {/* Detalhes de Rodapé */}
            <div className="pt-2 border-t border-border/40 space-y-1 text-[11px] text-muted-foreground">
              {ordem.cliente?.nome && (
                <div className="flex items-center gap-1.5 truncate">
                  <User className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                  <span className="truncate">{ordem.cliente.nome}</span>
                </div>
              )}

              {ordem.data_agendamento && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                  <span>{formatadores.dataHoraCurta(ordem.data_agendamento)}</span>
                </div>
              )}

              {tecnicoNome && (
                <div className="flex items-center gap-1.5 truncate">
                  <HardHat className="h-3 w-3 shrink-0 text-muted-foreground/70" />
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
