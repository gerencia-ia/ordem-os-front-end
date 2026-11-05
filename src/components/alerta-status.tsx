import {
  AlertCircle,
  CheckCircle,
  InfoIcon,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface AlertaStatusProps {
  tipo: 'sucesso' | 'erro' | 'aviso' | 'info';
  titulo: string;
  mensagem?: string;
  className?: string;
}

export function AlertaStatus({
  tipo,
  titulo,
  mensagem,
  className,
}: AlertaStatusProps) {
  const estilos = {
    sucesso: {
      container:
        'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900',
      titulo: 'text-green-900 dark:text-green-100',
      mensagem: 'text-green-800 dark:text-green-200',
      icon: CheckCircle,
      corIcon: 'text-green-600 dark:text-green-400',
    },
    erro: {
      container:
        'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900',
      titulo: 'text-red-900 dark:text-red-100',
      mensagem: 'text-red-800 dark:text-red-200',
      icon: AlertCircle,
      corIcon: 'text-red-600 dark:text-red-400',
    },
    aviso: {
      container:
        'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900',
      titulo: 'text-yellow-900 dark:text-yellow-100',
      mensagem: 'text-yellow-800 dark:text-yellow-200',
      icon: AlertTriangle,
      corIcon: 'text-yellow-600 dark:text-yellow-400',
    },
    info: {
      container:
        'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900',
      titulo: 'text-blue-900 dark:text-blue-100',
      mensagem: 'text-blue-800 dark:text-blue-200',
      icon: InfoIcon,
      corIcon: 'text-blue-600 dark:text-blue-400',
    },
  };

  const estilo = estilos[tipo];
  const Icon = estilo.icon;

  return (
    <div
      className={cn(
        'border rounded-lg p-4 flex gap-3',
        estilo.container,
        className,
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', estilo.corIcon)} />
      <div>
        <p className={cn('font-semibold text-sm', estilo.titulo)}>{titulo}</p>
        {mensagem && (
          <p className={cn('text-sm mt-1', estilo.mensagem)}>{mensagem}</p>
        )}
      </div>
    </div>
  );
}
