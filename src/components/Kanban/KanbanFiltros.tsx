'use client';

import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Search, Plus, Calendar } from 'lucide-react';

interface KanbanFiltrosProps {
  filtroMes: string;
  onFiltroMesChange: (val: string) => void;
  busca: string;
  onBuscaChange: (val: string) => void;
  onNovaOrdem: () => void;
}

export function KanbanFiltros({
  filtroMes,
  onFiltroMesChange,
  busca,
  onBuscaChange,
  onNovaOrdem,
}: KanbanFiltrosProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-xl">
        {/* Filtro de Mês/Ano */}
        <div className="relative sm:w-48">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="month"
            value={filtroMes}
            onChange={(e) => onFiltroMesChange(e.target.value)}
            className="pl-9 text-xs"
            aria-label="Filtrar por mês"
          />
        </div>

        {/* Busca textual */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, OS # ou descrição..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      <Button onClick={onNovaOrdem} className="gap-2">
        <Plus className="h-4 w-4" />
        Nova Ordem
      </Button>
    </div>
  );
}
