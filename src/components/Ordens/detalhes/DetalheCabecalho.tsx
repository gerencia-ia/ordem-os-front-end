'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/Ui/button';
import { Badge } from '@/src/components/Ui/badge';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  PlayCircle,
  Loader2,
} from 'lucide-react';
import type { OrdemServico, Status } from '@/src/types/ordem';

interface DetalheCabecalhoProps {
  ordem: OrdemServico;
  statusList: Status[];
  onStatusChange: (novoStatusId: number) => void | Promise<void>;
  onIniciarAtendimento: () => void | Promise<void>;
  onFinalizarAtendimento: () => void;
  acaoLoading: boolean;
  podeAlterarStatus: boolean;
}

const normalizar = (val?: string | null) =>
  (val ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

function getBadgePrioridade(prioridade?: string | null) {
  const norm = normalizar(prioridade);
  const cores: Record<string, string> = {
    critica: 'bg-red-600 text-white border-transparent',
    alta: 'bg-orange-500 text-white border-transparent',
    media: 'bg-amber-500 text-white border-transparent',
    baixa: 'bg-blue-500 text-white border-transparent',
  };
  return cores[norm] || 'bg-muted text-muted-foreground';
}

function getBadgeStatus(status?: string | null) {
  const norm = normalizar(status);
  const cores: Record<string, string> = {
    agendado:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 border-yellow-300',
    aberta:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 border-yellow-300',
    'em progresso':
      'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-300',
    'em andamento':
      'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border-blue-300',
    concluido:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300',
    concluida:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-300',
    cancelado:
      'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border-red-300',
    cancelada:
      'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border-red-300',
  };
  return cores[norm] || 'bg-muted text-muted-foreground';
}

export function DetalheCabecalho({
  ordem,
  statusList,
  onStatusChange,
  onIniciarAtendimento,
  onFinalizarAtendimento,
  acaoLoading,
  podeAlterarStatus,
}: DetalheCabecalhoProps) {
  const router = useRouter();

  const statusIdAtual = Number(ordem.status?.id || ordem.status_id || 1);
  const statusNomeAtual =
    ordem.status?.nome || ordem.status_descricao || 'Agendado';
  const prioridadeNomeAtual =
    ordem.prioridade?.descricao || ordem.prioridade_descricao || 'Normal';

  const emAtendimento = statusIdAtual === 2 || statusIdAtual === 6;
  const concluido = statusIdAtual === 3;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              OS #{ordem.id}
            </h1>
            {ordem.numero_ordem && (
              <span className="text-sm text-muted-foreground font-mono">
                ({ordem.numero_ordem})
              </span>
            )}
            <Badge className={getBadgePrioridade(prioridadeNomeAtual)}>
              {prioridadeNomeAtual}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              variant="outline"
              className={getBadgeStatus(statusNomeAtual)}
            >
              {statusNomeAtual}
            </Badge>
          </div>
        </div>
      </div>

      {/* Ações e Atualização de Status */}
      <div className="flex flex-wrap items-center gap-3">
        {podeAlterarStatus && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Mudar status:
            </span>
            <select
              className="border rounded-md px-2.5 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={statusIdAtual}
              onChange={(e) => onStatusChange(Number(e.target.value))}
              disabled={acaoLoading}
            >
              {statusList.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        {concluido ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 rounded-md text-sm font-medium">
            <CheckCircle className="h-4 w-4" />
            <span>Atendimento Concluído</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {!emAtendimento && (
              <Button
                onClick={() => void onIniciarAtendimento()}
                disabled={acaoLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                size="sm"
              >
                {acaoLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PlayCircle className="h-4 w-4" />
                )}
                <span>Iniciar Atendimento</span>
              </Button>
            )}

            {emAtendimento && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 rounded-md text-sm font-medium">
                <Clock className="h-4 w-4 animate-pulse" />
                <span>Em Atendimento</span>
              </div>
            )}

            <Button
              variant="outline"
              onClick={onFinalizarAtendimento}
              disabled={acaoLoading}
              className="gap-2"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Finalizar</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
