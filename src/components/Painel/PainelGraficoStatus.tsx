'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/Ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

interface DadoStatusPie {
  name: string;
  value: number;
  color: string;
}

interface PainelGraficoStatusProps {
  dados: DadoStatusPie[];
}

export function PainelGraficoStatus({ dados }: PainelGraficoStatusProps) {
  const temDados = dados.length > 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <PieIcon className="size-4 text-muted-foreground" />
          Distribuição por Status
        </CardTitle>
        <CardDescription>
          Proporção das ordens de serviço no período selecionado
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center">
        {temDados ? (
          <div className="flex flex-col gap-4">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie
                  data={dados}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {dados.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
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
              </PieChart>
            </ResponsiveContainer>

            {/* Legenda Customizada */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-border/40">
              {dados.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>
                    {item.name}: <strong>{item.value}</strong>
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
