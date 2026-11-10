import * as React from 'react';
import { Badge } from '@/src/components/Ui/badge';
import { cn } from '@/src/lib/utils';

export interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
  status?: string | null;
}

export interface PrioridadeBadgeProps extends React.ComponentProps<
  typeof Badge
> {
  prioridade?: string | null;
}

function normalizar(val?: string | null): string {
  return (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Retorna classes CSS semânticas para o status de uma ordem de serviço
 */
export function getStatusClasses(status?: string | null): string {
  const norm = normalizar(status);

  if (norm.includes('nao iniciad') || norm.includes('pendente')) {
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300/70 dark:border-slate-700/50';
  }
  if (norm.includes('abert') || norm.includes('agendad')) {
    return 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300/70 dark:border-amber-700/50';
  }
  if (
    norm.includes('andamento') ||
    norm.includes('atendimento') ||
    norm.includes('progresso')
  ) {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300/70 dark:border-blue-700/50';
  }
  if (norm.includes('conclui')) {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/70 dark:border-emerald-700/50';
  }
  if (norm.includes('cancelad')) {
    return 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300/70 dark:border-rose-700/50';
  }

  return 'bg-muted text-muted-foreground border-border';
}

/**
 * Retorna classes CSS semânticas para a prioridade de uma ordem de serviço
 */
export function getPrioridadeClasses(prioridade?: string | null): string {
  const norm = normalizar(prioridade);

  if (norm.includes('critic')) {
    return 'bg-rose-600 text-white dark:bg-rose-700 hover:bg-rose-600 border-transparent';
  }
  if (norm.includes('alta')) {
    return 'bg-orange-500 text-white dark:bg-orange-600 hover:bg-orange-500 border-transparent';
  }
  if (norm.includes('media')) {
    return 'bg-amber-500 text-white dark:bg-amber-600 hover:bg-amber-500 border-transparent';
  }
  if (norm.includes('baixa')) {
    return 'bg-blue-500 text-white dark:bg-blue-600 hover:bg-blue-500 border-transparent';
  }

  return 'bg-muted text-muted-foreground border-border';
}

export function StatusBadge({
  status,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const texto = children || status || 'Sem status';
  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium shadow-2xs transition-colors',
        getStatusClasses(status),
        className,
      )}
      {...props}
    >
      {texto}
    </Badge>
  );
}

export function PrioridadeBadge({
  prioridade,
  className,
  children,
  ...props
}: PrioridadeBadgeProps) {
  const texto = children || prioridade || 'Normal';
  return (
    <Badge
      className={cn(
        'font-medium shadow-2xs transition-colors',
        getPrioridadeClasses(prioridade),
        className,
      )}
      {...props}
    >
      {texto}
    </Badge>
  );
}
