'use client';

import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { Search, Layers, X } from 'lucide-react';

interface AndarFiltrosProps {
  busca: string;
  onBuscaChange: (val: string) => void;
  totalAndares: number;
}

export function AndarFiltros({
  busca,
  onBuscaChange,
  totalAndares,
}: AndarFiltrosProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Buscar andar por descrição..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {busca && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onBuscaChange('')}
            className="absolute right-1 top-1/2 -translate-y-1/2 size-7 text-muted-foreground hover:text-foreground"
            aria-label="Limpar busca"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Layers className="size-3.5" />
          <span>{totalAndares} andar(es)</span>
        </div>
      </div>
    </div>
  );
}
