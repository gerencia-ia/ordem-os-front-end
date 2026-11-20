'use client';

import { useMemo } from 'react';
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
import { Calendar, Plus, Search } from 'lucide-react';
import { MESES, gerarAnosDisponiveis } from '@/src/lib/constants';

interface KanbanFiltrosProps {
  filtroAno: number;
  onFiltroAnoChange: (ano: number) => void;
  filtroMes: string;
  onFiltroMesChange: (mes: string) => void;
  busca: string;
  onBuscaChange: (val: string) => void;
  onNovaOrdem: () => void;
}

export function KanbanFiltros({
  filtroAno,
  onFiltroAnoChange,
  filtroMes,
  onFiltroMesChange,
  busca,
  onBuscaChange,
  onNovaOrdem,
}: KanbanFiltrosProps) {
  const anosDisponiveis = useMemo(() => gerarAnosDisponiveis(), []);

  return (
    <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-col items-stretch gap-3 sm:max-w-2xl sm:flex-row sm:items-center">
        {/* Busca textual */}
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por cliente, OS # ou descrição..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            className="pl-9"
          />
        </div>
        {/* Filtros de Ano e Mês */}
        <div className="grid grid-cols-[110px_1fr] gap-2.5 sm:flex sm:items-center">
          <Select
            value={String(filtroAno)}
            onValueChange={(val) => onFiltroAnoChange(Number(val))}
          >
            <SelectTrigger
              className="w-full sm:w-[110px]"
              aria-label="Filtrar por ano"
            >
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {anosDisponiveis.map((ano) => (
                  <SelectItem key={ano} value={String(ano)}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={filtroMes} onValueChange={onFiltroMesChange}>
            <SelectTrigger
              className="w-full sm:w-[170px]"
              aria-label="Filtrar por mês"
            >
              <span className="flex items-center gap-2 truncate">
                <Calendar className="text-muted-foreground size-4 shrink-0" />
                <SelectValue placeholder="Mês" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {MESES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={onNovaOrdem} className="gap-2">
        <Plus className="size-4" />
        Nova Ordem
      </Button>
    </div>
  );
}
