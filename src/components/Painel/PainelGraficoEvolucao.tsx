'use client';

import { useState } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/Ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/src/components/Ui/chart';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/Ui/empty';
import { ToggleGroup, ToggleGroupItem } from '@/src/components/Ui/toggle-group';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

export interface DadoEvolucaoPeriodo {
  periodo: string;
  ordens: number;
  faturamento: number;
}

interface PainelGraficoEvolucaoProps {
  dados: DadoEvolucaoPeriodo[];
  filtroAno: number;
  filtroMes: string;
  podeVerMetricasFinanceiras: boolean;
}

const chartConfig = {
  ordens: {
    label: 'Ordens',
    color: 'var(--chart-1)',
  },
  faturamento: {
    label: 'Faturamento',
    color: 'var(--status-completed)',
  },
} satisfies ChartConfig;

export function PainelGraficoEvolucao({
  dados,
  filtroAno,
  filtroMes,
  podeVerMetricasFinanceiras,
}: PainelGraficoEvolucaoProps) {
  const [metricaAtiva, setMetricaAtiva] = useState<'ordens' | 'faturamento'>(
    'ordens',
  );

  const metrica =
    !podeVerMetricasFinanceiras && metricaAtiva === 'faturamento'
      ? 'ordens'
      : metricaAtiva;

  const temDados = dados.some((d) => d.ordens > 0 || d.faturamento > 0);
  const titulo =
    filtroMes === 'todos'
      ? `Evolução Mensal (${filtroAno})`
      : 'Evolução Diária no Mês';

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="text-muted-foreground size-4" />
          {titulo}
        </CardTitle>
        <CardDescription>
          {filtroMes === 'todos'
            ? 'Distribuição de ordens e faturamento ao longo dos 12 meses'
            : 'Distribuição diária de ordens e faturamento no mês selecionado'}
        </CardDescription>

        {podeVerMetricasFinanceiras && (
          <CardAction>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={metrica}
              onValueChange={(val) => {
                if (val === 'ordens' || val === 'faturamento') {
                  setMetricaAtiva(val);
                }
              }}
            >
              <ToggleGroupItem value="ordens" className="w-auto flex-none px-3 text-xs">
                Ordens
              </ToggleGroupItem>
              <ToggleGroupItem value="faturamento" className="w-auto flex-none px-3 text-xs">
                Faturamento
              </ToggleGroupItem>
            </ToggleGroup>
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        {temDados ? (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <AreaChart
              accessibilityLayer
              data={dados}
              margin={{ left: 12, right: 12, top: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillOrdens" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-ordens)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-ordens)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
                <linearGradient
                  id="fillFaturamento"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-faturamento)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-faturamento)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="periodo"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={16}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value) => {
                      const num = Number(value) || 0;
                      if (metrica === 'faturamento') {
                        return (
                          <span className="font-mono font-semibold tabular-nums">
                            {num.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        );
                      }
                      return (
                        <span className="font-mono font-semibold tabular-nums">
                          {num} ordem(ns)
                        </span>
                      );
                    }}
                  />
                }
              />
              <Area
                dataKey={metrica}
                type="monotone"
                fill={
                  metrica === 'faturamento'
                    ? 'url(#fillFaturamento)'
                    : 'url(#fillOrdens)'
                }
                stroke={
                  metrica === 'faturamento'
                    ? 'var(--color-faturamento)'
                    : 'var(--color-ordens)'
                }
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <Empty className="min-h-[220px] border">
            <EmptyMedia variant="icon">
              <TrendingUp className="text-muted-foreground size-5" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="text-sm">Sem dados para exibir</EmptyTitle>
              <EmptyDescription className="text-xs">
                Nenhuma ordem registrada para o período selecionado.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
