'use client';

import { useMemo } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { Button } from '@/src/components/Ui/button';
import { Calendar, RefreshCw } from 'lucide-react';
import { MESES, gerarAnosDisponiveis } from '@/src/lib/constants';
import { cn } from '@/src/lib/utils';

interface PainelFiltrosProps {
  filtroAno: number;
  onFiltroAnoChange: (ano: number) => void;
  filtroMes: string;
  onFiltroMesChange: (mes: string) => void;
  onRecarregar: () => void;
  loading: boolean;
}

export function PainelFiltros({
  filtroAno,
  onFiltroAnoChange,
  filtroMes,
  onFiltroMesChange,
  onRecarregar,
  loading,
}: PainelFiltrosProps) {
  const anosDisponiveis = useMemo(() => gerarAnosDisponiveis(), []);

  return (
    <div className="grid grid-cols-[110px_1fr_auto] items-center gap-2.5 sm:flex sm:items-center">
      <Select
        value={String(filtroAno)}
        onValueChange={(val) => onFiltroAnoChange(Number(val))}
        disabled={loading}
      >
        <SelectTrigger
          className="w-full sm:w-[110px]"
          aria-label="Filtrar métricas por ano"
        >
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {anosDisponiveis.map((ano) => (
              <SelectItem key={ano} value={String(ano)}>
                {ano}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={filtroMes}
        onValueChange={onFiltroMesChange}
        disabled={loading}
      >
        <SelectTrigger
          className="w-full sm:w-[170px]"
          aria-label="Filtrar métricas por mês"
        >
          <span className="flex items-center gap-2 truncate">
            <Calendar className="text-muted-foreground size-4 shrink-0" />
            <SelectValue placeholder="Mês" />
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {MESES.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={onRecarregar}
        disabled={loading}
        aria-label="Recarregar métricas"
      >
        <RefreshCw className={cn('size-4', loading && 'animate-spin')} />
      </Button>
    </div>
  );
}
