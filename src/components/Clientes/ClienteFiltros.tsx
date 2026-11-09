'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { Badge } from '@/src/components/Ui/badge';

interface ClienteFiltrosProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
  filtroMarcador: string | null;
  onFiltroMarcadorChange: (marcador: string | null) => void;
  totalClientes: number;
  totalFiltrados: number;
}

export function ClienteFiltros({
  busca,
  onBuscaChange,
  filtroMarcador,
  onFiltroMarcadorChange,
  totalClientes,
  totalFiltrados,
}: ClienteFiltrosProps) {
  const temFiltroAtivo = busca.trim() !== '' || filtroMarcador !== null;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, email, telefone, rua..."
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

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground mr-1">
          Filtros:
        </span>
        <Badge
          variant={filtroMarcador === null ? 'default' : 'outline'}
          className="cursor-pointer select-none transition-colors"
          onClick={() => onFiltroMarcadorChange(null)}
        >
          Todos ({totalClientes})
        </Badge>
        <Badge
          variant={filtroMarcador === 'com_visita' ? 'default' : 'outline'}
          className="cursor-pointer select-none transition-colors"
          onClick={() =>
            onFiltroMarcadorChange(
              filtroMarcador === 'com_visita' ? null : 'com_visita',
            )
          }
        >
          Com Visita
        </Badge>
        <Badge
          variant={filtroMarcador === 'sem_visita' ? 'default' : 'outline'}
          className="cursor-pointer select-none transition-colors"
          onClick={() =>
            onFiltroMarcadorChange(
              filtroMarcador === 'sem_visita' ? null : 'sem_visita',
            )
          }
        >
          Sem Visita
        </Badge>

        {temFiltroAtivo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onBuscaChange('');
              onFiltroMarcadorChange(null);
            }}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar ({totalFiltrados} resultados)
          </Button>
        )}
      </div>
    </div>
  );
}
