'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from '@/src/components/Ui/card';
import { Badge } from '@/src/components/Ui/badge';
import type { Servico } from '@/src/types/servico';
import { Wrench, Check, Loader2 } from 'lucide-react';

interface SecaoServicosProps {
  servicos: Servico[];
  servicoIdsSelecionados: number[];
  valorTotal: number;
  loadingServicos: boolean;
  onToggleServico: (id: number) => void;
}

export function SecaoServicos({
  servicos,
  servicoIdsSelecionados,
  valorTotal,
  loadingServicos,
  onToggleServico,
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
            ({servicoIdsSelecionados.length} selecionado(s))
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
        ) : servicos.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2">
            Nenhum serviço disponível no catálogo.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {servicos.map((servico) => {
              const selecionado = servicoIdsSelecionados.includes(servico.id);
              return (
                <Badge
                  key={servico.id}
                  variant={selecionado ? 'default' : 'outline'}
                  className="cursor-pointer gap-1.5 py-1.5 px-3 text-xs font-normal transition-all hover:border-primary"
                  onClick={() => onToggleServico(servico.id)}
                >
                  {selecionado && <Check className="size-3" />}
                  <span className="font-medium">{servico.nome}</span>
                  <span className="text-[11px] font-semibold opacity-90">
                    {formatarMoeda(Number(servico.valor) || 0)}
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
        )}
      </CardContent>
    </Card>
  );
}
