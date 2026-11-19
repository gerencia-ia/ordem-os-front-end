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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/Ui/popover';
import { ChevronDown, Edit, Trash2, Wrench, Clock } from 'lucide-react';
import type { Servico } from '@/src/types/servico';

const formatarMoeda = (valor: number | string) =>
  Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

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
              <TableHead className="w-[200px] text-right">
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
            <TableHead className="w-[200px] text-right">
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

                {/* Valores por Andar */}
                <TableCell className="text-right">
                  {(() => {
                    const valores = servico.valores_por_andares ?? [];
                    if (valores.length === 0) {
                      return (
                        <span className="text-muted-foreground text-xs">
                          Sem valores
                        </span>
                      );
                    }

                    if (valores.length === 1) {
                      const unico = valores[0];
                      return (
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-semibold tabular-nums">
                            {formatarMoeda(unico.valor)}
                          </span>
                          <span className="text-muted-foreground text-[11px]">
                            {unico.andar?.descricao ??
                              `Andar #${unico.andar_id}`}
                          </span>
                        </div>
                      );
                    }

                    const numericos = valores.map((v) => Number(v.valor) || 0);
                    const min = Math.min(...numericos);
                    const max = Math.max(...numericos);
                    const faixa =
                      min === max
                        ? formatarMoeda(min)
                        : `${formatarMoeda(min)} – ${formatarMoeda(max)}`;

                    return (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-sm font-semibold tabular-nums">
                          {faixa}
                        </span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-foreground h-6 gap-1 px-1.5 text-[11px] font-normal"
                            >
                              <span>{valores.length} andares</span>
                              <ChevronDown className="size-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end" className="w-60 p-3">
                            <div className="flex flex-col gap-2">
                              <p className="text-muted-foreground text-xs font-medium">
                                Valores por andar
                              </p>
                              <div className="divide-y rounded-md border">
                                {valores.map((v) => (
                                  <div
                                    key={v.id}
                                    className="flex items-center justify-between gap-3 px-2.5 py-1.5 text-xs"
                                  >
                                    <span className="text-muted-foreground truncate">
                                      {v.andar?.descricao ??
                                        `Andar #${v.andar_id}`}
                                    </span>
                                    <span className="font-semibold tabular-nums">
                                      {formatarMoeda(v.valor)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    );
                  })()}
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
