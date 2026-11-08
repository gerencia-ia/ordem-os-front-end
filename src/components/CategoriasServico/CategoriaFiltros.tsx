'use client';

import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Search, Plus, Tag } from 'lucide-react';

interface CategoriaFiltrosProps {
  busca: string;
  onBuscaChange: (val: string) => void;
  onNovaCategoria: () => void;
  totalCategorias: number;
}

export function CategoriaFiltros({
  busca,
  onBuscaChange,
  onNovaCategoria,
  totalCategorias,
}: CategoriaFiltrosProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar categoria por descrição..."
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
          <Tag className="h-3.5 w-3.5" />
          <span>{totalCategorias} categoria(s)</span>
        </div>

        <Button onClick={onNovaCategoria} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Categoria
        </Button>
      </div>
    </div>
  );
}
