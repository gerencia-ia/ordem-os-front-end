'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';

interface UsuarioFiltrosProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
  totalUsuarios: number;
  totalFiltrados: number;
  placeholder?: string;
}

export function UsuarioFiltros({
  busca,
  onBuscaChange,
  totalUsuarios,
  totalFiltrados,
  placeholder = 'Buscar por nome, CPF, e-mail ou telefone...',
}: UsuarioFiltrosProps) {
  const temFiltroAtivo = busca.trim() !== '';

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {busca && (
          <button
            type="button"
            onClick={() => onBuscaChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>
          Exibindo <strong>{totalFiltrados}</strong> de {totalUsuarios}{' '}
          usuários
        </span>
        {temFiltroAtivo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onBuscaChange('')}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar busca
          </Button>
        )}
      </div>
    </div>
  );
}
