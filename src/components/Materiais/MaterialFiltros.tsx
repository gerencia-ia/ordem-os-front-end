'use client';

import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { Package, Search, X } from 'lucide-react';

interface MaterialFiltrosProps {
  busca: string;
  onBuscaChange: (val: string) => void;
  totalMateriais: number;
}

export function MaterialFiltros({
  busca,
  onBuscaChange,
  totalMateriais,
}: MaterialFiltrosProps) {
  return (
    <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
      <div className="relative max-w-md flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          placeholder="Buscar material por nome ou descrição..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="pr-9 pl-9"
        />
        {busca && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onBuscaChange('')}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 size-7 -translate-y-1/2"
            aria-label="Limpar busca"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Package className="size-3.5" />
          <span>{totalMateriais} material(is)</span>
        </div>
      </div>
    </div>
  );
}
