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
import { useIsMobile } from '@/src/hooks/use-mobile';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

export interface DadoPrioridadeBar {
  nivel: string;
  prioridade: string;
  total: number;
  fill: string;
}

interface PainelGraficoPrioridadesProps {
  dados: DadoPrioridadeBar[];
}

const chartConfig = {
  total: {
    label: 'Ordens',
  },
  critica: {
    label: 'Crítica',
    color: 'var(--destructive)',
  },
  alta: {
    label: 'Alta',
    color: 'var(--chart-4)',
  },
  media: {
    label: 'Média',
    color: 'var(--chart-2)',
  },
  baixa: {
    label: 'Baixa',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function PainelGraficoPrioridades({
  dados,
}: PainelGraficoPrioridadesProps) {
  const isMobile = useIsMobile();
  const temDados = dados.some((item) => item.total > 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="text-muted-foreground size-4" />
          Ordens por Prioridade
        </CardTitle>
        <CardDescription>
          Volume de atendimentos distribuídos pelo nível de criticidade
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-center">
        {temDados ? (
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            {isMobile ? (
              <BarChart
                accessibilityLayer
                data={dados}
                layout="vertical"
                margin={{ left: 4, right: 28, top: 8, bottom: 8 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="nivel"
                  type="category"
                  tickLine={false}
                  tickMargin={8}
                  axisLine={false}
                  width={56}
                  tickFormatter={(value) =>
                    String(
                      chartConfig[value as keyof typeof chartConfig]?.label ??
                        value,
                    )
                  }
                />
                <XAxis dataKey="total" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="total" radius={6}>
                  <LabelList
                    dataKey="total"
                    position="right"
                    offset={8}
                    className="fill-foreground text-xs font-semibold tabular-nums"
                  />
                </Bar>
              </BarChart>
            ) : (
              <BarChart
                accessibilityLayer
                data={dados}
                margin={{ top: 24, right: 12, left: 12, bottom: 4 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="nivel"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) =>
                    String(
                      chartConfig[value as keyof typeof chartConfig]?.label ??
                        value,
                    )
                  }
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="total" radius={8}>
                  <LabelList
                    dataKey="total"
                    position="top"
                    offset={10}
                    className="fill-foreground text-xs font-semibold tabular-nums"
                  />
                </Bar>
              </BarChart>
            )}
          </ChartContainer>
        ) : (
          <Empty className="min-h-[240px] border">
            <EmptyMedia variant="icon">
              <BarChart3 className="text-muted-foreground size-5" />
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
