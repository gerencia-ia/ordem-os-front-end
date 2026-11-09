'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardDescription,
} from '@/src/components/Ui/card';
import { cn } from '@/src/lib/utils';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

interface PainelKpisProps {
  metricas: {
    total: number;
    agendadas: number;
    emProgresso: number;
    concluidas: number;
    canceladas: number;
    valorTotal: number;
    taxaConclusao: number;
  };
  podeVerMetricasFinanceiras: boolean;
}

export function PainelKpis({
  metricas,
  podeVerMetricasFinanceiras,
}: PainelKpisProps) {
  const cards = [
    {
      titulo: 'Total de Ordens',
      valor: metricas.total,
      subtexto: `${metricas.agendadas} agendada(s)`,
      icon: ClipboardList,
      corIcon: 'text-blue-600 dark:text-blue-400',
      bgIcon: 'bg-blue-50 dark:bg-blue-950/60',
    },
    {
      titulo: 'Em Atendimento',
      valor: metricas.emProgresso,
      subtexto: 'Em andamento na equipe',
      icon: Clock,
      corIcon: 'text-amber-600 dark:text-amber-400',
      bgIcon: 'bg-amber-50 dark:bg-amber-950/60',
    },
    {
      titulo: 'Concluídas',
      valor: metricas.concluidas,
      subtexto: `${metricas.canceladas} cancelada(s)`,
      icon: CheckCircle2,
      corIcon: 'text-emerald-600 dark:text-emerald-400',
      bgIcon: 'bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      titulo: 'Taxa de Conclusão',
      valor: `${metricas.taxaConclusao}%`,
      subtexto: 'Do total do período',
      icon: TrendingUp,
      corIcon: 'text-purple-600 dark:text-purple-400',
      bgIcon: 'bg-purple-50 dark:bg-purple-950/60',
    },
  ];

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${
        podeVerMetricasFinanceiras ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
      } gap-4`}
    >
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="hover:shadow-sm transition-shadow py-5 gap-3 bg-card">
            <CardHeader className="px-5 pb-0">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {card.titulo}
              </CardTitle>
              <CardAction>
                <div className={cn('p-2.5 rounded-lg flex items-center justify-center', card.bgIcon)}>
                  <Icon className={cn('size-5', card.corIcon)} />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent className="px-5 flex flex-col gap-1">
              <div className="text-2xl font-bold tracking-tight">
                {card.valor}
              </div>
              <CardDescription className="text-[11px]">
                {card.subtexto}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}

      {/* Card Financeiro Exclusivo (Admin / Secretaria) */}
      {podeVerMetricasFinanceiras && (
        <Card className="hover:shadow-sm transition-shadow py-5 gap-3 border-emerald-300/40 bg-emerald-50/20 dark:bg-emerald-950/20">
          <CardHeader className="px-5 pb-0">
            <CardTitle className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              Valor Total Cobrado
            </CardTitle>
            <CardAction>
              <div className="p-2.5 rounded-lg flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/60">
                <DollarSign className="size-5 text-emerald-700 dark:text-emerald-300" />
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className="px-5 flex flex-col gap-1">
            <div className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              R${' '}
              {metricas.valorTotal.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}
            </div>
            <CardDescription className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">
              Faturamento do período
            </CardDescription>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
