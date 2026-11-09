'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/Ui/card';
import { Activity } from 'lucide-react';
import type { OrdemServico } from '@/src/types/ordem';
import { formatarDataHoraCurta } from '@/src/utils/date';

interface DetalheHistoricoAtividadesProps {
  ordem: OrdemServico;
}

export function DetalheHistoricoAtividades({
  ordem,
}: DetalheHistoricoAtividadesProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="size-5 text-muted-foreground" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          {/* Ordem Criada */}
          <div className="flex gap-3">
            <div className="size-2.5 bg-primary rounded-full mt-1.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Ordem de Serviço Aberta</p>
              <p className="text-xs text-muted-foreground">
                {formatarDataHoraCurta(ordem.created_at)}
              </p>
            </div>
          </div>

          {/* Atendimento Iniciado */}
          {ordem.data_inicio_atendimento && (
            <div className="flex gap-3">
              <div className="size-2.5 bg-blue-500 dark:bg-blue-400 rounded-full mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Atendimento Iniciado</p>
                <p className="text-xs text-muted-foreground">
                  {formatarDataHoraCurta(ordem.data_inicio_atendimento)}
                </p>
              </div>
            </div>
          )}

          {/* Atendimento Finalizado */}
          {ordem.data_fim_atendimento && (
            <div className="flex gap-3">
              <div className="size-2.5 bg-purple-500 dark:bg-purple-400 rounded-full mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Atendimento Finalizado</p>
                <p className="text-xs text-muted-foreground">
                  {formatarDataHoraCurta(ordem.data_fim_atendimento)}
                </p>
              </div>
            </div>
          )}

          {/* Ordem Concluída */}
          {ordem.data_fechamento && (
            <div className="flex gap-3">
              <div className="size-2.5 bg-emerald-500 dark:bg-emerald-400 rounded-full mt-1.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Ordem Concluída</p>
                <p className="text-xs text-muted-foreground">
                  {formatarDataHoraCurta(ordem.data_fechamento)}
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
