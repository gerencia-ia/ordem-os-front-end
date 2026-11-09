'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { Badge } from '@/src/components/Ui/badge';
import type { FiltroPerfilTipo } from '@/src/hooks/useUsuarios';

interface UsuarioFiltrosProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
  totalUsuarios: number;
  totalFiltrados: number;
  filtroPerfil?: FiltroPerfilTipo;
  onFiltroPerfilChange?: (filtro: FiltroPerfilTipo) => void;
  exibirFiltrosPerfil?: boolean;
  placeholder?: string;
}

const OPCOES_FILTRO_PERFIL: { id: FiltroPerfilTipo; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'admin', label: 'Administrador' },
  { id: 'secretaria', label: 'Secretaria' },
  { id: 'tecnico', label: 'Técnico' },
];

export function UsuarioFiltros({
  busca,
  onBuscaChange,
  totalUsuarios,
  totalFiltrados,
  filtroPerfil = 'todos',
  onFiltroPerfilChange,
  exibirFiltrosPerfil = true,
  placeholder = 'Buscar por nome, CPF, e-mail ou telefone...',
}: UsuarioFiltrosProps) {
  const temFiltroAtivo = busca.trim() !== '' || filtroPerfil !== 'todos';

  return (
    <div className="space-y-3">
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

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            Exibindo <strong>{totalFiltrados}</strong> de {totalUsuarios}{' '}
            usuários
          </span>
          {temFiltroAtivo && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onBuscaChange('');
                onFiltroPerfilChange?.('todos');
              }}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {exibirFiltrosPerfil && onFiltroPerfilChange && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-xs text-muted-foreground mr-1">Função:</span>
          {OPCOES_FILTRO_PERFIL.map((opcao) => {
            const ativo = filtroPerfil === opcao.id;
            return (
              <Badge
                key={opcao.id}
                variant={ativo ? 'default' : 'outline'}
                className="cursor-pointer text-xs font-normal transition-colors"
                onClick={() => onFiltroPerfilChange(opcao.id)}
              >
                {opcao.label}
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
