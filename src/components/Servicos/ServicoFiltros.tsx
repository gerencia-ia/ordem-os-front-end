'use client';

import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Search, Plus, FilterX, Wrench } from 'lucide-react';
import type { CategoriaServico } from '@/src/types/categoria';

interface ServicoFiltrosProps {
  busca: string;
  onBuscaChange: (val: string) => void;
  filtroCategoria: string;
  onCategoriaChange: (val: string) => void;
  categorias: CategoriaServico[];
  onNovoServico: () => void;
  onLimparFiltros: () => void;
  totalServicos: number;
}

export function ServicoFiltros({
  busca,
  onBuscaChange,
  filtroCategoria,
  onCategoriaChange,
  categorias,
  onNovoServico,
  onLimparFiltros,
  totalServicos,
}: ServicoFiltrosProps) {
  const temFiltroAtivo = busca.trim() !== '' || filtroCategoria !== 'todas';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
        {/* Busca textual */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome do serviço..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filtro por categoria */}
        <select
          value={filtroCategoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring sm:w-52"
        >
          <option value="todas">Todas as categorias</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={String(cat.id)}>
              {cat.descricao}
            </option>
          ))}
        </select>

        {temFiltroAtivo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLimparFiltros}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-9"
          >
            <FilterX className="h-3.5 w-3.5" />
            Limpar
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
          <Wrench className="h-3.5 w-3.5" />
          <span>{totalServicos} serviço(s)</span>
        </div>

        <Button onClick={onNovoServico} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Serviço
        </Button>
      </div>
    </div>
  );
}
