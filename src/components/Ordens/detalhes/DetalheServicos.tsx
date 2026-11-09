'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { Separator } from '@/src/components/Ui/separator';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/src/components/Ui/empty';
import { Wrench, Plus, Trash2, Clock } from 'lucide-react';
import type { OsServico } from '@/src/types/ordem';

interface DetalheServicosProps {
  servicos?: OsServico[] | null;
  statusId?: number;
  podeAlterarServicos: boolean;
  podeVerMetricasFinanceiras: boolean;
  onAdicionarServico: () => void;
  onRemoverServico: (servicoId: number | string) => void | Promise<void>;
  removendoId: number | string | null;
}

export function DetalheServicos({
  servicos,
  statusId,
  podeAlterarServicos,
  podeVerMetricasFinanceiras,
  onAdicionarServico,
  onRemoverServico,
  removendoId,
}: DetalheServicosProps) {
  const lista = servicos || [];
  const concluido = statusId === 3;

  const tempoTotalMinutos = lista.reduce(
    (sum, s) => sum + (s.tempo_servico || 0) * (s.quantidade || 1),
    0,
  );

  const valorTotalServicos = lista.reduce(
    (sum, s) => sum + Number(s.valor || 0) * (s.quantidade || 1),
    0,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wrench className="size-5 text-muted-foreground" />
          Serviços ({lista.length})
        </CardTitle>
        {!concluido && podeAlterarServicos && (
          <Button
            size="sm"
            variant="outline"
            onClick={onAdicionarServico}
            className="gap-1.5"
          >
            <Plus className="size-4" />
            Adicionar Serviço
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {lista.length > 0 ? (
          <>
            <div className="divide-y border rounded-lg overflow-hidden">
              {lista.map((servico) => {
                const qtd = servico.quantidade || 1;
                const valorTotalItem = Number(servico.valor || 0) * qtd;

                return (
                  <div
                    key={servico.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 hover:bg-muted/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {servico.nome}
                        </span>
                        {qtd > 1 && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">
                            x{qtd}
                          </span>
                        )}
                      </div>
                      {servico.tempo_servico ? (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="size-3" />
                          <span>
                            {servico.tempo_servico} min
                            {qtd > 1 &&
                              ` (${servico.tempo_servico * qtd} min total)`}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      {podeVerMetricasFinanceiras && (
                        <div className="text-right">
                          <span className="text-sm font-semibold">
                            R${' '}
                            {valorTotalItem.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                          {qtd > 1 && (
                            <span className="text-xs text-muted-foreground block">
                              (R${' '}
                              {Number(servico.valor).toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })}{' '}
                              cada)
                            </span>
                          )}
                        </div>
                      )}

                      {!concluido && podeAlterarServicos && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onRemoverServico(servico.id)}
                          disabled={removendoId === servico.id}
                          aria-label={`Remover serviço ${servico.nome}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totais do Bloco */}
            <div className="flex flex-col gap-3">
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-2">
                <div className="text-muted-foreground flex items-center gap-1.5">
                  <Clock className="size-4" />
                  <span>Tempo total estimado:</span>
                  <span className="font-medium text-foreground">
                    {tempoTotalMinutos > 0 ? `${tempoTotalMinutos} min` : '—'}
                  </span>
                </div>

                {podeVerMetricasFinanceiras && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      Subtotal dos serviços:
                    </span>
                    <span className="font-bold text-base text-foreground">
                      R${' '}
                      {valorTotalServicos.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <Empty className="py-6 border rounded-lg">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Wrench className="size-5" />
              </EmptyMedia>
              <EmptyTitle className="text-sm font-medium">Nenhum serviço vinculado</EmptyTitle>
              <EmptyDescription className="text-xs">
                Esta ordem de serviço ainda não possui serviços adicionados.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
