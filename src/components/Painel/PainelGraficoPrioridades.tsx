'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/Ui/card';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface DadoPrioridadeBar {
  prioridade: string;
  total: number;
  fill: string;
}

interface PainelGraficoPrioridadesProps {
  dados: DadoPrioridadeBar[];
}

export function PainelGraficoPrioridades({
  dados,
}: PainelGraficoPrioridadesProps) {
  const temDados = dados.some((item) => item.total > 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="size-4 text-muted-foreground" />
          Ordens por Prioridade
        </CardTitle>
        <CardDescription>
          Volume de atendimentos distribuídos pelo nível de criticidade
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center">
        {temDados ? (
          <div className="flex flex-col gap-4">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart
                data={dados}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border) / 0.5)"
                />
                <XAxis
                  dataKey="prioridade"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    `${typeof value === 'number' || typeof value === 'string' ? value : 0} ordem(ns)`,
                    'Quantidade',
                  ]}
                  contentStyle={{
                    borderRadius: '8px',
                    fontSize: '12px',
                    border: '1px solid hsl(var(--border))',
                    backgroundColor: 'hsl(var(--card))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {dados.map((entry, index) => (
                    <Cell key={`cell-bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Resumo por Prioridade */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 border-t border-border/40">
              {dados.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span>
                    {item.prioridade}: <strong>{item.total}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[240px] text-xs text-muted-foreground italic border border-dashed rounded-lg">
            Nenhuma ordem registrada para este período.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
