'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/Ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
import { Label, Pie, PieChart } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

export interface DadoStatusPie {
  status: string;
  label: string;
  value: number;
  fill: string;
}

interface PainelGraficoStatusProps {
  dados: DadoStatusPie[];
  totalOrdens: number;
}

const chartConfig = {
  value: {
    label: 'Ordens',
  },
  agendadas: {
    label: 'Agendadas',
    color: 'var(--status-pending)',
  },
  em_progresso: {
    label: 'Em Progresso',
    color: 'var(--status-in-progress)',
  },
  concluidas: {
    label: 'Concluídas',
    color: 'var(--status-completed)',
  },
  canceladas: {
    label: 'Canceladas',
    color: 'var(--status-cancelled)',
  },
} satisfies ChartConfig;

export function PainelGraficoStatus({
  dados,
  totalOrdens,
}: PainelGraficoStatusProps) {
  const temDados = dados.length > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <PieIcon className="text-muted-foreground size-4" />
          Distribuição por Status
        </CardTitle>
        <CardDescription>
          Proporção das ordens de serviço no período selecionado
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-center">
        {temDados ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[280px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="status" />}
              />
              <Pie
                data={dados}
                dataKey="value"
                nameKey="status"
                innerRadius={62}
                outerRadius={92}
                strokeWidth={4}
                paddingAngle={2}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold tabular-nums"
                          >
                            {totalOrdens.toLocaleString('pt-BR')}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 22}
                            className="fill-muted-foreground text-xs"
                          >
                            Ordens
                          </tspan>
                        </text>
                      );
                    }
                    return null;
                  }}
                />
              </Pie>
              <ChartLegend
                content={
                  <ChartLegendContent
                    nameKey="status"
                    className="-translate-y-1 flex-wrap gap-3 [&>*]:basis-auto"
                  />
                }
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <Empty className="min-h-[240px] border">
            <EmptyMedia variant="icon">
              <PieIcon className="text-muted-foreground size-5" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle className="text-sm">Sem ordens no período</EmptyTitle>
              <EmptyDescription className="text-xs">
                Nenhuma ordem registrada para o filtro selecionado.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
