'use client';

import { Badge } from '@/src/components/ui/badge';
import type { Servico } from '@/src/types/ordem';
import { Wrench, Check } from 'lucide-react';

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
    <div className="space-y-3 rounded-lg border bg-card/40 p-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Wrench className="h-4 w-4 text-primary" />
          <span>3. Serviços e Mão de Obra</span>
          <span className="text-xs text-muted-foreground font-normal">
            ({servicoIdsSelecionados.length} selecionado(s))
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-muted-foreground mr-1.5">
            Total Estimado:
          </span>
          <span className="text-sm font-bold text-emerald-600">
            {formatarMoeda(valorTotal)}
          </span>
        </div>
      </div>

      {loadingServicos ? (
        <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
                {selecionado && <Check className="h-3 w-3" />}
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
    </div>
  );
}
