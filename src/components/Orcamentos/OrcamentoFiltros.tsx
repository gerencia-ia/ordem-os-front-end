'use client';

import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import {
  ORCAMENTO_STATUS_LABELS,
  type OrcamentoStatus,
} from '@/src/types/orcamento';
import { Search, X } from 'lucide-react';

interface OrcamentoFiltrosProps {
  busca: string;
  filtroStatus: string;
  totalOrcamentos: number;
  totalFiltrados: number;
  onBuscaChange: (valor: string) => void;
  onStatusChange: (valor: string) => void;
  onLimparFiltros: () => void;
}

const STATUS_OPTIONS: OrcamentoStatus[] = [
  'rascunho',
  'enviado',
  'aprovado',
  'recusado',
  'expirado',
  'convertido',
];

export function OrcamentoFiltros({
  busca,
  filtroStatus,
  totalOrcamentos,
  totalFiltrados,
  onBuscaChange,
  onStatusChange,
  onLimparFiltros,
}: OrcamentoFiltrosProps) {
  const temFiltroAtivo = Boolean(busca.trim() || filtroStatus !== 'todos');

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, cliente ou observação..."
            value={busca}
            onChange={(e) => onBuscaChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={filtroStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {STATUS_OPTIONS.map((st) => (
              <SelectItem key={st} value={st}>
                {ORCAMENTO_STATUS_LABELS[st]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {temFiltroAtivo && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onLimparFiltros}
            className="gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
            Limpar
          </Button>
        )}
      </div>

      <span className="text-xs text-muted-foreground">
        Exibindo {totalFiltrados} de {totalOrcamentos} orçamento(s)
      </span>
    </div>
  );
}
