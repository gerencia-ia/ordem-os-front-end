'use client';

import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
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
    <CardColapsavel
      titulo={<span className="text-base sm:text-lg">Atividades Recentes</span>}
      icone={<Activity className="text-muted-foreground size-5" />}
      resumo={formatarDataHoraCurta(ordem.created_at)}
      defaultOpenMobile={false}
    >
      <div className="flex flex-col gap-4">
        {/* Ordem Criada */}
        <div className="flex gap-3">
          <div className="bg-primary mt-1.5 size-2.5 shrink-0 rounded-full" />
          <div>
            <p className="text-sm font-medium">Ordem de Serviço Aberta</p>
            <p className="text-muted-foreground text-xs">
              {formatarDataHoraCurta(ordem.created_at)}
            </p>
          </div>
        </div>

        {/* Atendimento Iniciado */}
        {ordem.data_inicio_atendimento && (
          <div className="flex gap-3">
            <div className="bg-warning mt-1.5 size-2.5 shrink-0 rounded-full" />
            <div>
              <p className="text-sm font-medium">Atendimento Iniciado</p>
              <p className="text-muted-foreground text-xs">
                {formatarDataHoraCurta(ordem.data_inicio_atendimento)}
              </p>
            </div>
          </div>
        )}

        {/* Atendimento Finalizado */}
        {ordem.data_fim_atendimento && (
          <div className="flex gap-3">
            <div className="bg-secondary mt-1.5 size-2.5 shrink-0 rounded-full" />
            <div>
              <p className="text-sm font-medium">Atendimento Finalizado</p>
              <p className="text-muted-foreground text-xs">
                {formatarDataHoraCurta(ordem.data_fim_atendimento)}
              </p>
            </div>
          </div>
        )}

        {/* Ordem Concluída */}
        {ordem.data_fechamento && (
          <div className="flex gap-3">
            <div className="bg-success mt-1.5 size-2.5 shrink-0 rounded-full" />
            <div>
              <p className="text-sm font-medium">Ordem Concluída</p>
              <p className="text-muted-foreground text-xs">
                {formatarDataHoraCurta(ordem.data_fechamento)}
              </p>
            </div>
          </div>
        )}
      </div>
    </CardColapsavel>
  );
}
