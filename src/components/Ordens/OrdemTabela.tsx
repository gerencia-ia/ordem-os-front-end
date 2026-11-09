'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/Ui/table';
import { Button } from '@/src/components/Ui/button';
import { Skeleton } from '@/src/components/Ui/skeleton';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/Ui/empty';
import { StatusBadge, PrioridadeBadge } from '@/src/components/Ui/status-badge';
import type { OrdemServico } from '@/src/types/ordem';
import type { Usuario } from '@/src/types/usuario';
import { usePermissions } from '@/src/hooks/usePermissions';
import { Eye, Trash2, ClipboardList, Phone } from 'lucide-react';

interface OrdemTabelaProps {
  ordens: OrdemServico[];
  loading: boolean;
  onExcluir: (ordem: OrdemServico) => void;
  onLimparFiltros: () => void;
}

export function OrdemTabela({
  ordens,
  loading,
  onExcluir,
  onLimparFiltros,
}: OrdemTabelaProps) {
  const { isTecnico } = usePermissions();

  const formatarMoeda = (valor: string | number) => {
    const num = Number(valor) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const formatarData = (dataStr?: string | null) => {
    if (!dataStr) return '-';
    try {
      return new Date(dataStr).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return dataStr;
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[110px]">OS</TableHead>
              <TableHead className="min-w-[180px]">Cliente</TableHead>
              <TableHead className="w-[140px]">Data / Prazo</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
              <TableHead className="w-[110px]">Prioridade</TableHead>
              <TableHead className="w-[140px]">Técnico</TableHead>
              {!isTecnico && (
                <TableHead className="w-[120px]">Valor</TableHead>
              )}
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                {!isTecnico && (
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (ordens.length === 0) {
    return (
      <Empty className="border rounded-lg bg-card/40 my-4">
        <EmptyMedia variant="icon">
          <ClipboardList className="size-5 text-muted-foreground" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Nenhuma ordem de serviço encontrada</EmptyTitle>
          <EmptyDescription>
            Ajuste os filtros de busca ou crie uma nova ordem de serviço.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            size="sm"
            onClick={onLimparFiltros}
            className="text-xs"
          >
            Limpar todos os filtros
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[110px]">Número</TableHead>
            <TableHead className="w-[140px]">Agendamento</TableHead>
            <TableHead className="w-[220px]">Cliente</TableHead>
            <TableHead className="w-[130px]">Status</TableHead>
            <TableHead className="w-[110px]">Prioridade</TableHead>
            <TableHead className="w-[160px]">Técnico</TableHead>
            {!isTecnico && (
              <TableHead className="w-[120px]">Valor Total</TableHead>
            )}
            <TableHead className="w-[110px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordens.map((ordem) => {
            const statusTexto =
              ordem.status?.nome || ordem.status_descricao || '-';
            const prioridadeTexto =
              ordem.prioridade?.descricao || ordem.prioridade_descricao || '-';

            const tecnicosLista: Usuario[] = Array.isArray(ordem.tecnicos)
              ? ordem.tecnicos
              : [];

            const nomesTecnicos =
              tecnicosLista.length > 0
                ? tecnicosLista.map((t) => t.nome).join(', ')
                : ordem.tecnico_responsavel?.nome || '-';

            return (
              <TableRow key={ordem.id} className="hover:bg-muted/30">
                {/* Número */}
                <TableCell className="font-mono font-bold text-primary text-xs">
                  #{ordem.numero_ordem || ordem.id}
                </TableCell>

                {/* Agendamento */}
                <TableCell className="text-xs text-muted-foreground">
                  {formatarData(ordem.data_agendamento)}
                </TableCell>

                {/* Cliente */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground text-xs">
                      {ordem.cliente?.nome || '-'}
                    </span>
                    {ordem.cliente?.telefones?.[0]?.numero && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Phone className="h-2.5 w-2.5 shrink-0" />
                        {ordem.cliente.telefones[0].numero}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <StatusBadge status={statusTexto} className="text-xs" />
                </TableCell>

                {/* Prioridade */}
                <TableCell>
                  <PrioridadeBadge prioridade={prioridadeTexto} className="text-xs" />
                </TableCell>

                {/* Técnicos */}
                <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {nomesTecnicos}
                </TableCell>

                {/* Valor Total (Oculto para Técnicos conforme RBAC) */}
                {!isTecnico && (
                  <TableCell className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatarMoeda(
                      ordem.valor_total || ordem.custo_estimado || 0,
                    )}
                  </TableCell>
                )}

                {/* Ações */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/ordens/${ordem.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        aria-label="Ver detalhes da ordem"
                      >
                        <Eye className="size-4" />
                      </Button>
                    </Link>

                    {/* Exclusão visível apenas para Admin e Secretaria */}
                    {!isTecnico && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onExcluir(ordem)}
                        aria-label="Excluir ordem"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
