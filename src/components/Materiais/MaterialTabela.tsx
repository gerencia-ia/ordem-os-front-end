'use client';

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
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/Ui/empty';
import { Edit, Package, Trash2 } from 'lucide-react';
import type { Material } from '@/src/types/material';

interface MaterialTabelaProps {
  materiais: Material[];
  loading: boolean;
  onEditar: (material: Material) => void;
  onExcluir: (material: Material) => void;
}

const moeda = (valor: number | string | null) =>
  valor == null || valor === ''
    ? '—'
    : Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

export function MaterialTabela({
  materiais,
  loading,
  onEditar,
  onExcluir,
}: MaterialTabelaProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Material</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[160px] text-right">
                Valor de referência
              </TableHead>
              <TableHead className="w-[120px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-56" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-4 w-20" />
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

  if (materiais.length === 0) {
    return (
      <Empty className="bg-card/40 my-4 rounded-lg border">
        <EmptyMedia variant="icon">
          <Package className="text-muted-foreground size-5" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Nenhum material encontrado</EmptyTitle>
          <EmptyDescription>
            Nenhum material cadastrado ou correspondente aos termos de busca.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>Material</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="w-[160px] text-right">
              Valor de referência
            </TableHead>
            <TableHead className="w-[120px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materiais.map((material) => (
            <TableRow key={material.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{material.nome}</TableCell>
              <TableCell className="text-muted-foreground">
                {material.descricao || '—'}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {moeda(material.valor_referencia)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground size-8"
                    onClick={() => onEditar(material)}
                    aria-label={`Editar ${material.nome}`}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 size-8"
                    onClick={() => onExcluir(material)}
                    aria-label={`Excluir ${material.nome}`}
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
