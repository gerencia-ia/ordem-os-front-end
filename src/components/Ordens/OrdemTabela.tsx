'use client';

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import type { OrdemServico } from '@/src/types/ordem';
import type { Usuario } from '@/src/types/usuario';
import { usePermissions } from '@/src/hooks/usePermissions';
import { Eye, Trash2, ClipboardList, Phone } from 'lucide-react';

interface OrdemTabelaProps {
  ordens: OrdemServico[];
  loading: boolean;
  onExcluir: (ordem: OrdemServico) => void;
  onLimparFiltros: () => void;
}

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function getBadgeStatus(status?: string | null) {
  const norm = normalizar(status);
  const cores: Record<string, string> = {
    aberta:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 border-yellow-300',
    'em andamento':
      'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-300',
    concluida:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300',
    concluido:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300',
    cancelada:
      'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border-red-300',
  };
  return cores[norm] || 'bg-muted text-muted-foreground';
}

function getBadgePrioridade(prioridade?: string | null) {
  const norm = normalizar(prioridade);
  const cores: Record<string, string> = {
    critica: 'bg-red-600 text-white hover:bg-red-700',
    alta: 'bg-orange-500 text-white hover:bg-orange-600',
    media: 'bg-amber-500 text-white hover:bg-amber-600',
    baixa: 'bg-blue-500 text-white hover:bg-blue-600',
  };
  return cores[norm] || 'bg-muted text-muted-foreground';
}

export function OrdemTabela({
  ordens,
  loading,
  onExcluir,
  onLimparFiltros,
}: OrdemTabelaProps) {
  const { isTecnico } = usePermissions();

  const formatarMoeda = (valor: string | number) => {
    const num = Number(valor) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(num);
  };

  const formatarData = (dataStr?: string | null) => {
    if (!dataStr) return '-';
    try {
      return new Date(dataStr).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return dataStr;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
        <p className="text-sm text-muted-foreground">
          Carregando ordens de serviço...
        </p>
      </div>
    );
  }

  if (ordens.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-card/50">
        <ClipboardList className="h-10 w-10 text-muted-foreground mb-3" />
        <h3 className="font-semibold text-foreground">
          Nenhuma ordem de serviço encontrada
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Ajuste os filtros de busca ou crie uma nova ordem de serviço.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={onLimparFiltros}
        >
          Limpar Filtros
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[110px]">Número</TableHead>
            <TableHead className="w-[140px]">Agendamento</TableHead>
            <TableHead className="w-[220px]">Cliente</TableHead>
            <TableHead className="w-[130px]">Status</TableHead>
            <TableHead className="w-[110px]">Prioridade</TableHead>
            <TableHead className="w-[160px]">Técnico</TableHead>
            {!isTecnico && (
              <TableHead className="w-[120px]">Valor Total</TableHead>
            )}
            <TableHead className="w-[110px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordens.map((ordem) => {
            const statusTexto =
              ordem.status?.nome || ordem.status_descricao || '-';
            const prioridadeTexto =
              ordem.prioridade?.descricao || ordem.prioridade_descricao || '-';

            const tecnicosLista: Usuario[] = Array.isArray(ordem.tecnicos)
              ? ordem.tecnicos
              : ordem.tecnicos &&
                  typeof ordem.tecnicos === 'object' &&
                  'id' in ordem.tecnicos
                ? [ordem.tecnicos as Usuario]
                : [];

            const nomesTecnicos =
              tecnicosLista.length > 0
                ? tecnicosLista.map((t) => t.nome).join(', ')
                : ordem.tecnico_responsavel?.nome || '-';

            return (
              <TableRow key={ordem.id} className="hover:bg-muted/30">
                {/* Número */}
                <TableCell className="font-mono font-bold text-primary text-xs">
                  #{ordem.numero_ordem || ordem.id}
                </TableCell>

                {/* Agendamento */}
                <TableCell className="text-xs text-muted-foreground">
                  {formatarData(ordem.data_agendamento)}
                </TableCell>

                {/* Cliente */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground text-xs">
                      {ordem.cliente?.nome || '-'}
                    </span>
                    {ordem.cliente?.telefones?.[0]?.numero && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Phone className="h-2.5 w-2.5 shrink-0" />
                        {ordem.cliente.telefones[0].numero}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs font-normal border ${getBadgeStatus(statusTexto)}`}
                  >
                    {statusTexto}
                  </Badge>
                </TableCell>

                {/* Prioridade */}
                <TableCell>
                  <Badge
                    className={`text-[11px] font-normal ${getBadgePrioridade(prioridadeTexto)}`}
                  >
                    {prioridadeTexto}
                  </Badge>
                </TableCell>

                {/* Técnicos */}
                <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">
                  {nomesTecnicos}
                </TableCell>

                {/* Valor Total (Oculto para Técnicos conforme RBAC) */}
                {!isTecnico && (
                  <TableCell className="text-xs font-semibold text-emerald-600">
                    {formatarMoeda(
                      ordem.valor_total || ordem.custo_estimado || 0,
                    )}
                  </TableCell>
                )}

                {/* Ações */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/ordens/${ordem.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Ver detalhes da ordem"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    {/* Exclusão visível apenas para Admin e Secretaria */}
                    {!isTecnico && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onExcluir(ordem)}
                        title="Excluir ordem"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
export default OrdemTabela;
