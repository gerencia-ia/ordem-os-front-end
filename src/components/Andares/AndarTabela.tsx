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
import { Edit, Trash2, Layers } from 'lucide-react';
import type { Andar } from '@/src/types/andar';

interface AndarTabelaProps {
  andares: Andar[];
  loading: boolean;
  onEditar: (andar: Andar) => void;
  onExcluir: (andar: Andar) => void;
}

export function AndarTabela({
  andares,
  loading,
  onEditar,
  onExcluir,
}: AndarTabelaProps) {
  if (loading) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[120px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
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

  if (andares.length === 0) {
    return (
      <Empty className="border rounded-lg bg-card/40 my-4">
        <EmptyMedia variant="icon">
          <Layers className="size-5 text-muted-foreground" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Nenhum andar encontrado</EmptyTitle>
          <EmptyDescription>
            Nenhum andar cadastrado ou correspondente aos termos de busca.
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
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="w-[120px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {andares.map((andar) => (
            <TableRow key={andar.id} className="hover:bg-muted/30">
              <TableCell className="font-mono text-xs text-muted-foreground">
                #{andar.id}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-medium text-xs">
                  {andar.descricao}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEditar(andar)}
                    aria-label={`Editar ${andar.descricao}`}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onExcluir(andar)}
                    aria-label={`Excluir ${andar.descricao}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
