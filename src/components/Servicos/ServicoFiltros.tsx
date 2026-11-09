'use client';

import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
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
        <Select value={filtroCategoria} onValueChange={onCategoriaChange}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.descricao}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

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
