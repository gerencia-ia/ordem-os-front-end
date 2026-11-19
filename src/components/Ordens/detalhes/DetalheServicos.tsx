'use client';

import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Button } from '@/src/components/Ui/button';
import { Separator } from '@/src/components/Ui/separator';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/src/components/Ui/empty';
import { Badge } from '@/src/components/Ui/badge';
import { Wrench, Plus, Trash2, Clock } from 'lucide-react';
import type { OsEquipamentoItem, OsServico } from '@/src/types/ordem';

interface DetalheServicosProps {
  servicos?: OsServico[] | null;
  equipamentos?: OsEquipamentoItem[] | null;
  statusId?: number;
  podeAlterarServicos: boolean;
  podeVerMetricasFinanceiras: boolean;
  onAdicionarServico: () => void;
  onRemoverServico: (servicoId: number | string) => void | Promise<void>;
  removendoId: number | string | null;
}

export function DetalheServicos({
  servicos,
  equipamentos,
  statusId,
  podeAlterarServicos,
  podeVerMetricasFinanceiras,
  onAdicionarServico,
  onRemoverServico,
  removendoId,
}: DetalheServicosProps) {
  const lista = servicos || [];
  const listaEquipamentos = equipamentos || [];
  const concluido = statusId === 3;

  const tempoTotalMinutos = lista.reduce(
    (sum, s) => sum + (s.tempo_servico || 0) * (s.quantidade || 1),
    0,
  );

  const valorTotalServicos = lista.reduce(
    (sum, s) => sum + Number(s.valor || 0) * (s.quantidade || 1),
    0,
  );

  const resumoMobile = podeVerMetricasFinanceiras
    ? `R$ ${valorTotalServicos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    : `${lista.length} item(ns)`;

  return (
    <CardColapsavel
      titulo={
        <span className="text-base sm:text-lg">Serviços ({lista.length})</span>
      }
      icone={<Wrench className="text-muted-foreground size-5" />}
      resumo={resumoMobile}
      defaultOpenMobile={false}
      headerAction={
        !concluido && podeAlterarServicos ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onAdicionarServico}
            className="gap-1.5"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Adicionar Serviço</span>
            <span className="sm:hidden">Adicionar</span>
          </Button>
        ) : undefined
      }
      contentClassName="flex flex-col gap-4"
    >
      {lista.length > 0 ? (
        <>
          <div className="divide-y border rounded-lg overflow-hidden">
            {lista.map((servico) => {
              const qtd = servico.quantidade || 1;
              const valorTotalItem = Number(servico.valor || 0) * qtd;
              const equipAssociado = listaEquipamentos.find(
                (eq) =>
                  Number(eq.equipamento_id || eq.id) ===
                  Number(servico.equipamento_id),
              );

              return (
                <div
                  key={servico.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 hover:bg-muted/30 transition-colors"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">
                        {servico.nome}
                      </span>
                      {servico.andar?.descricao && (
                        <Badge variant="outline" className="text-[11px] py-0">
                          {servico.andar.descricao}
                        </Badge>
                      )}
                      {qtd > 1 && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">
                          x{qtd}
                        </span>
                      )}
                    </div>
                    {equipAssociado && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Equipamento: {equipAssociado.marca} (
                        {equipAssociado.local_instalacao})
                      </p>
                    )}
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
            <EmptyTitle className="text-sm font-medium">
              Nenhum serviço vinculado
            </EmptyTitle>
            <EmptyDescription className="text-xs">
              Esta ordem de serviço ainda não possui serviços adicionados.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </CardColapsavel>
  );
}
