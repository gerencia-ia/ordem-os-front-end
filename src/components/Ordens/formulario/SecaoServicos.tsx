'use client';

import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Badge } from '@/src/components/Ui/badge';
import { Button } from '@/src/components/Ui/button';
import { Skeleton } from '@/src/components/Ui/skeleton';
import {
  ComboboxMultiple,
  type ComboboxOption,
} from '@/src/components/Ui/combobox';
import type { Equipamento } from '@/src/types/equipamento';
import type { OsServicoInput } from '@/src/types/ordem';
import type { Servico } from '@/src/types/servico';
import { Cpu, Minus, Plus, Trash2, Wrench } from 'lucide-react';

interface SecaoServicosProps {
  servicos: Servico[];
  equipamentosSelecionados: Equipamento[];
  osServicosSelecionados: OsServicoInput[];
  valorTotal: number;
  loadingServicos: boolean;
  onChangeServicosEquipamento: (
    equipamentoId: number,
    valorPorAndarIds: number[],
  ) => void;
  onAlterarQuantidade: (
    equipamentoId: number,
    valorPorAndarId: number,
    quantidade: number,
  ) => void;
}

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);

export function SecaoServicos({
  servicos,
  equipamentosSelecionados,
  osServicosSelecionados,
  valorTotal,
  loadingServicos,
  onChangeServicosEquipamento,
  onAlterarQuantidade,
}: SecaoServicosProps) {
  return (
    <CardColapsavel
      titulo={
        <span className="flex items-center gap-2">
          <span>3. Serviços e Mão de Obra</span>
          <span className="text-muted-foreground hidden text-xs font-normal sm:inline">
            ({osServicosSelecionados.length} selecionado(s))
          </span>
        </span>
      }
      icone={<Wrench className="size-4 text-primary" />}
      resumo={`${osServicosSelecionados.length} selecionado(s) • ${formatarMoeda(valorTotal)}`}
      defaultOpenMobile={false}
      headerAction={
        <div className="hidden text-right sm:block">
          <span className="text-muted-foreground mr-1.5 text-xs">
            Subtotal:
          </span>
          <span className="text-success text-sm font-bold tabular-nums">
            {formatarMoeda(valorTotal)}
          </span>
        </div>
      }
      className="bg-card/40 border-border/70"
      contentClassName="flex flex-col gap-3"
    >
      {loadingServicos ? (
        <Skeleton className="h-12 w-full" />
      ) : equipamentosSelecionados.length === 0 ? (
        <p className="text-muted-foreground py-2 text-xs italic">
          Selecione ao menos um equipamento na seção anterior para escolher os
          serviços conforme o andar.
        </p>
      ) : servicos.length === 0 ? (
        <p className="text-muted-foreground py-2 text-xs italic">
          Nenhum serviço disponível no catálogo.
        </p>
      ) : (
        <div className="flex flex-col gap-3 pt-1">
          {equipamentosSelecionados.map((eq) => {
            const eqId = Number(eq.id);
            const andarId = Number(eq.andar_id);

            const opcoesServico: ComboboxOption[] = servicos.map((servico) => {
              const vpa = servico.valores_por_andares?.find(
                (v) => Number(v.andar_id) === andarId,
              );

              if (!vpa) {
                return {
                  value: `sem-preco-${servico.id}`,
                  label: servico.nome,
                  disabled: true,
                  disabledReason: 'Sem preço p/ andar',
                };
              }

              const tempo = servico.tempo_servico
                ? ` • ${servico.tempo_servico} min`
                : '';

              return {
                value: String(vpa.id),
                label: servico.nome,
                meta: `${formatarMoeda(Number(vpa.valor) || 0)}${tempo}`,
              };
            });

            const selecionadosEquipamento = osServicosSelecionados.filter(
              (item) => Number(item.equipamento_id) === eqId,
            );

            const valoresSelecionados = selecionadosEquipamento.map((item) =>
              String(item.valor_por_andar_id),
            );

            return (
              <div
                key={eq.id}
                className="border-border/70 bg-background/60 flex flex-col gap-3 rounded-lg border p-3"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Cpu className="size-3.5 shrink-0 text-primary" />
                  <span className="font-semibold">{eq.marca}</span>
                  <span className="text-muted-foreground">({eq.btus})</span>
                  <span className="text-muted-foreground">
                    • {eq.local_instalacao}
                  </span>
                  {eq.andar?.descricao && (
                    <Badge variant="secondary" className="py-0 text-[10px]">
                      {eq.andar.descricao}
                    </Badge>
                  )}
                </div>

                <ComboboxMultiple
                  options={opcoesServico}
                  value={valoresSelecionados}
                  onValueChange={(vals) =>
                    onChangeServicosEquipamento(
                      eqId,
                      vals
                        .map(Number)
                        .filter((id) => Number.isFinite(id) && id > 0),
                    )
                  }
                  placeholder="Selecione os serviços para este equipamento..."
                  searchPlaceholder="Buscar serviço..."
                  emptyMessage="Nenhum serviço encontrado."
                />

                {selecionadosEquipamento.length > 0 && (
                  <div className="divide-y rounded-md border bg-card/50">
                    {selecionadosEquipamento.map((item) => {
                      const servico = servicos.find((s) =>
                        s.valores_por_andares?.some(
                          (v) =>
                            Number(v.id) === Number(item.valor_por_andar_id),
                        ),
                      );
                      const vpa = servico?.valores_por_andares?.find(
                        (v) => Number(v.id) === Number(item.valor_por_andar_id),
                      );
                      const valorUnit = Number(vpa?.valor) || 0;
                      const qtd = Number(item.quantidade) || 1;

                      return (
                        <div
                          key={`${eqId}-${item.valor_por_andar_id}`}
                          className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">
                              {servico?.nome ?? 'Serviço'}
                            </p>
                            <p className="text-muted-foreground tabular-nums">
                              {formatarMoeda(valorUnit)} un.
                              {servico?.tempo_servico
                                ? ` • ${servico.tempo_servico} min`
                                : ''}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-md border">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="size-7 rounded-none"
                                onClick={() =>
                                  onAlterarQuantidade(
                                    eqId,
                                    Number(item.valor_por_andar_id),
                                    qtd - 1,
                                  )
                                }
                                disabled={qtd <= 1}
                                aria-label="Diminuir quantidade"
                              >
                                <Minus className="size-3" />
                              </Button>
                              <span className="w-7 text-center font-medium tabular-nums">
                                {qtd}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="size-7 rounded-none"
                                onClick={() =>
                                  onAlterarQuantidade(
                                    eqId,
                                    Number(item.valor_por_andar_id),
                                    qtd + 1,
                                  )
                                }
                                aria-label="Aumentar quantidade"
                              >
                                <Plus className="size-3" />
                              </Button>
                            </div>

                            <span className="min-w-[74px] text-right font-semibold tabular-nums">
                              {formatarMoeda(valorUnit * qtd)}
                            </span>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              className="size-7 text-muted-foreground hover:text-destructive"
                              onClick={() =>
                                onChangeServicosEquipamento(
                                  eqId,
                                  valoresSelecionados
                                    .map(Number)
                                    .filter(
                                      (id) =>
                                        id !== Number(item.valor_por_andar_id),
                                    ),
                                )
                              }
                              aria-label={`Remover ${servico?.nome ?? 'serviço'}`}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </CardColapsavel>
  );
}
