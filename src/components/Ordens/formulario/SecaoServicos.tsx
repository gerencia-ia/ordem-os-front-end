'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from '@/src/components/Ui/card';
import { Badge } from '@/src/components/Ui/badge';
import type { Equipamento } from '@/src/types/equipamento';
import type { OsServicoInput } from '@/src/types/ordem';
import type { Servico } from '@/src/types/servico';
import { Wrench, Check, Loader2, Cpu } from 'lucide-react';

interface SecaoServicosProps {
  servicos: Servico[];
  equipamentosSelecionados: Equipamento[];
  osServicosSelecionados: OsServicoInput[];
  valorTotal: number;
  loadingServicos: boolean;
  onToggleServicoEquipamento: (
    equipamentoId: number,
    valorPorAndarId: number,
  ) => void;
}

export function SecaoServicos({
  servicos,
  equipamentosSelecionados,
  osServicosSelecionados,
  valorTotal,
  loadingServicos,
  onToggleServicoEquipamento,
}: SecaoServicosProps) {
  const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);

  return (
    <Card className="bg-card/40 border-border/70 py-4 gap-4">
      <CardHeader className="px-4 pb-2 border-b">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Wrench className="size-4 text-primary" />
          <span>3. Serviços e Mão de Obra</span>
          <span className="text-xs text-muted-foreground font-normal">
            ({osServicosSelecionados.length} selecionado(s))
          </span>
        </CardTitle>

        <CardAction>
          <div className="text-right">
            <span className="text-xs text-muted-foreground mr-1.5">
              Total Estimado:
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {formatarMoeda(valorTotal)}
            </span>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="px-4 flex flex-col gap-3">
        {loadingServicos ? (
          <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            Carregando catálogo de serviços...
          </div>
        ) : equipamentosSelecionados.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2">
            Selecione ao menos um equipamento na seção anterior para escolher os
            serviços conforme o andar.
          </p>
        ) : servicos.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2">
            Nenhum serviço disponível no catálogo.
          </p>
        ) : (
          <div className="flex flex-col gap-3 pt-1">
            {equipamentosSelecionados.map((eq) => {
              const eqId = Number(eq.id);
              const andarId = Number(eq.andar_id);

              return (
                <div
                  key={eq.id}
                  className="rounded-md border border-border/70 bg-background/60 p-3 flex flex-col gap-2.5"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <Cpu className="size-3.5 text-primary shrink-0" />
                    <span className="font-semibold">{eq.marca}</span>
                    <span className="text-muted-foreground">({eq.btus})</span>
                    <span className="text-muted-foreground">
                      • {eq.local_instalacao}
                    </span>
                    {eq.andar?.descricao && (
                      <Badge variant="secondary" className="text-[10px] py-0">
                        {eq.andar.descricao}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {servicos.map((servico) => {
                      const valorPorAndar = servico.valores_por_andares?.find(
                        (v) => Number(v.andar_id) === andarId,
                      );

                      if (!valorPorAndar) {
                        return (
                          <Badge
                            key={`${eqId}-${servico.id}`}
                            variant="outline"
                            className="opacity-45 cursor-not-allowed gap-1.5 py-1.5 px-3 text-xs font-normal"
                            title="Serviço sem valor cadastrado para o andar deste equipamento"
                          >
                            <span>{servico.nome}</span>
                            <span className="text-[10px]">
                              • Sem preço p/ andar
                            </span>
                          </Badge>
                        );
                      }

                      const selecionado = osServicosSelecionados.some(
                        (item) =>
                          item.equipamento_id === eqId &&
                          item.valor_por_andar_id === valorPorAndar.id,
                      );

                      return (
                        <Badge
                          key={`${eqId}-${servico.id}`}
                          variant={selecionado ? 'default' : 'outline'}
                          className="cursor-pointer gap-1.5 py-1.5 px-3 text-xs font-normal transition-all hover:border-primary"
                          onClick={() =>
                            onToggleServicoEquipamento(eqId, valorPorAndar.id)
                          }
                        >
                          {selecionado && <Check className="size-3" />}
                          <span className="font-medium">{servico.nome}</span>
                          <span className="text-[11px] font-semibold opacity-90">
                            {formatarMoeda(Number(valorPorAndar.valor) || 0)}
                          </span>
                          {servico.tempo_servico ? (
                            <span className="text-[10px] opacity-60">
                              • {servico.tempo_servico} min
                            </span>
                          ) : null}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
