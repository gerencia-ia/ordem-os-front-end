'use client';

import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { Calendar, RefreshCw } from 'lucide-react';

interface PainelFiltrosProps {
  filtroMes: string;
  onFiltroMesChange: (val: string) => void;
  onRecarregar: () => void;
  loading: boolean;
}

export function PainelFiltros({
  filtroMes,
  onFiltroMesChange,
  onRecarregar,
  loading,
}: PainelFiltrosProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative w-48">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="month"
            value={filtroMes}
            onChange={(e) => onFiltroMesChange(e.target.value)}
            className="pl-9 text-xs"
            aria-label="Filtrar métricas por mês"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onRecarregar}
          disabled={loading}
          aria-label="Recarregar métricas"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
}
