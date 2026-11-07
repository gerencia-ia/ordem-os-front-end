'use client';

import { Search, X, RotateCcw } from 'lucide-react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import type { Usuario } from '@/src/types/usuario';

interface OrdemFiltrosProps {
  busca: string;
  filtroStatus: string;
  filtroPrioridade: string;
  filtroTecnico: string;
  filtroData: string;
  tecnicos: Usuario[];
  totalOrdens: number;
  totalFiltradas: number;
  onBuscaChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onPrioridadeChange: (val: string) => void;
  onTecnicoChange: (val: string) => void;
  onDataChange: (val: string) => void;
  onLimparFiltros: () => void;
}

export function OrdemFiltros({
  busca,
  filtroStatus,
  filtroPrioridade,
  filtroTecnico,
  filtroData,
  tecnicos,
  totalOrdens,
  totalFiltradas,
  onBuscaChange,
  onStatusChange,
  onPrioridadeChange,
  onTecnicoChange,
  onDataChange,
  onLimparFiltros,
}: OrdemFiltrosProps) {
  const temFiltroAtivo =
    busca.trim() !== '' ||
    filtroStatus !== 'todos' ||
    filtroPrioridade !== 'todos' ||
    filtroTecnico !== 'todos' ||
    filtroData !== '';

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Busca Textual */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, número da OS ou descrição..."
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

        {/* Filtro Status */}
        <Select value={filtroStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Status</SelectItem>
            <SelectItem value="Aberta">Aberta</SelectItem>
            <SelectItem value="Em andamento">Em andamento</SelectItem>
            <SelectItem value="Concluída">Concluída</SelectItem>
            <SelectItem value="Cancelada">Cancelada</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro Prioridade */}
        <Select value={filtroPrioridade} onValueChange={onPrioridadeChange}>
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas Prioridades</SelectItem>
            <SelectItem value="Baixa">Baixa</SelectItem>
            <SelectItem value="Média">Média</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Crítica">Crítica</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro Técnico */}
        <Select value={filtroTecnico} onValueChange={onTecnicoChange}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Técnico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Técnicos</SelectItem>
            {tecnicos.map((tec) => (
              <SelectItem key={tec.id} value={String(tec.id)}>
                {tec.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro Data */}
        <div className="w-full lg:w-40">
          <Input
            type="date"
            value={filtroData}
            onChange={(e) => onDataChange(e.target.value)}
            className="text-xs"
          />
        </div>
      </div>

      {/* Barra de Status e Contadores */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
        <span>
          Exibindo <strong>{totalFiltradas}</strong> de {totalOrdens} ordens de
          serviço
        </span>

        {temFiltroAtivo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLimparFiltros}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <RotateCcw className="h-3 w-3" /> Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
}
