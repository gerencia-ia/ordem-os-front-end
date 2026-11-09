'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/Ui/button';
import { StatusBadge, PrioridadeBadge } from '@/src/components/Ui/status-badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
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
          <ArrowLeft className="size-4" />
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
            <PrioridadeBadge prioridade={prioridadeNomeAtual} />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={statusNomeAtual} />
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
            <Select
              value={statusIdAtual ? String(statusIdAtual) : undefined}
              onValueChange={(val) => onStatusChange(Number(val))}
              disabled={acaoLoading}
            >
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statusList.map((st) => (
                    <SelectItem key={st.id} value={String(st.id)}>
                      {st.nome}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

        {concluido ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 rounded-md text-sm font-medium">
            <CheckCircle className="size-4" />
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
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <PlayCircle className="size-4" />
                )}
                <span>Iniciar Atendimento</span>
              </Button>
            )}

            {emAtendimento && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 rounded-md text-sm font-medium">
                <Clock className="size-4 animate-pulse" />
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
              <CheckCircle className="size-4 text-emerald-600" />
              <span>Finalizar</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
