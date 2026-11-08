'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import { Edit, Trash2, Tag, Loader2 } from 'lucide-react';
import type { CategoriaServico } from '@/src/types/categoria';

interface CategoriaTabelaProps {
  categorias: CategoriaServico[];
  loading: boolean;
  onEditar: (cat: CategoriaServico) => void;
  onExcluir: (cat: CategoriaServico) => void;
}

export function CategoriaTabela({
  categorias,
  loading,
  onEditar,
  onExcluir,
}: CategoriaTabelaProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Carregando categorias...</p>
      </div>
    );
  }

  if (categorias.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg bg-card/40 space-y-3">
        <div className="inline-flex p-3 rounded-full bg-muted">
          <Tag className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-base">
          Nenhuma categoria encontrada
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Nenhuma categoria de serviço cadastrada ou correspondente aos termos
          de busca.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[120px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categorias.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-muted-foreground">
                  #{cat.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-medium text-xs">
                      {cat.descricao}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEditar(cat)}
                      aria-label={`Editar ${cat.descricao}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                      onClick={() => onExcluir(cat)}
                      aria-label={`Excluir ${cat.descricao}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
