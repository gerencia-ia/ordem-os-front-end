'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/Ui/table';
import { Badge } from '@/src/components/Ui/badge';
import { Button } from '@/src/components/Ui/button';
import { Skeleton } from '@/src/components/Ui/skeleton';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/Ui/empty';
import { Edit, Trash2, Wrench, Clock } from 'lucide-react';
import type { Servico } from '@/src/types/servico';

interface ServicoTabelaProps {
  servicos: Servico[];
  loading: boolean;
  onEditar: (servico: Servico) => void;
  onExcluir: (servico: Servico) => void;
}

export function ServicoTabela({
  servicos,
  loading,
  onEditar,
  onExcluir,
}: ServicoTabelaProps) {
  if (loading) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Nome do Serviço</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="w-[140px]">Tempo Estimado</TableHead>
              <TableHead className="w-[140px] text-right">
                Valor Unitário
              </TableHead>
              <TableHead className="w-[120px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-4 w-24 ml-auto" />
                </TableCell>
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

  if (servicos.length === 0) {
    return (
      <Empty className="border rounded-lg bg-card/40 my-4">
        <EmptyMedia variant="icon">
          <Wrench className="size-5 text-muted-foreground" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Nenhum serviço encontrado</EmptyTitle>
          <EmptyDescription>
            Nenhum serviço disponível ou correspondente aos filtros de busca
            aplicados.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Nome do Serviço</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="w-[140px]">Tempo Estimado</TableHead>
            <TableHead className="w-[140px] text-right">
              Valor Unitário
            </TableHead>
            <TableHead className="w-[120px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicos.map((servico) => {
            const categoriaNome =
              servico.categoria?.descricao ||
              servico.categorias_servico?.descricao ||
              'Geral';

            return (
              <TableRow key={servico.id} className="hover:bg-muted/30">
                {/* Nome */}
                <TableCell className="font-medium text-sm">
                  {servico.nome}
                </TableCell>

                {/* Categoria */}
                <TableCell>
                  <Badge variant="outline" className="text-xs font-normal">
                    {categoriaNome}
                  </Badge>
                </TableCell>

                {/* Tempo */}
                <TableCell>
                  {servico.tempo_servico ? (
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {servico.tempo_servico} min
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Valor */}
                <TableCell className="text-right font-semibold text-sm">
                  R${' '}
                  {Number(servico.valor).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>

                {/* Ações */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEditar(servico)}
                      aria-label={`Editar ${servico.nome}`}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onExcluir(servico)}
                      aria-label={`Excluir ${servico.nome}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
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
