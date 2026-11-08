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
import { Edit, Trash2, Wrench, Clock, Loader2 } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm">Carregando catálogo de serviços...</p>
      </div>
    );
  }

  if (servicos.length === 0) {
    return (
      <div className="text-center py-16 border rounded-lg bg-card/40 space-y-3">
        <div className="inline-flex p-3 rounded-full bg-muted">
          <Wrench className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-base">Nenhum serviço encontrado</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Nenhum serviço disponível ou correspondente aos filtros de busca
          aplicados.
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
              <TableHead>Nome do Serviço</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tempo Estimado</TableHead>
              <TableHead className="text-right">Valor Unitário</TableHead>
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
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEditar(servico)}
                        aria-label={`Editar ${servico.nome}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                        onClick={() => onExcluir(servico)}
                        aria-label={`Excluir ${servico.nome}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
