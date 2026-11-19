'use client';

import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Separator } from '@/src/components/Ui/separator';
import type { OrdemServico } from '@/src/types/ordem';
import { formatarDataHoraCurta } from '@/src/utils/date';
import { Calendar, FileText, DollarSign, MessageSquare } from 'lucide-react';

interface DetalheInfoGeralProps {
  ordem: OrdemServico;
  podeVerMetricasFinanceiras: boolean;
}

export function DetalheInfoGeral({
  ordem,
  podeVerMetricasFinanceiras,
}: DetalheInfoGeralProps) {
  return (
    <CardColapsavel
      titulo={<span className="text-base sm:text-lg">Informações Gerais</span>}
      icone={<FileText className="text-muted-foreground size-5" />}
      resumo={formatarDataHoraCurta(ordem.data_agendamento)}
      defaultOpenMobile={true}
      contentClassName="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Calendar className="size-3.5" />
            Data de Agendamento
          </span>
          <p className="text-sm font-medium">
            {formatarDataHoraCurta(ordem.data_agendamento)}
          </p>
        </div>

        {ordem.data_fechamento && (
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Calendar className="text-success size-3.5" />
              Data de Fechamento
            </span>
            <p className="text-success text-sm font-medium">
              {formatarDataHoraCurta(ordem.data_fechamento)}
            </p>
          </div>
        )}
      </div>

      {/* Descrição */}
      {ordem.descricao && (
        <div className="flex flex-col gap-2">
          <Separator />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mt-2">
            Descrição do Serviço
          </span>
          <div className="text-sm bg-muted/50 p-3.5 rounded-lg whitespace-pre-wrap leading-relaxed">
            {ordem.descricao}
          </div>
        </div>
      )}

      {/* Observações */}
      {ordem.observacao && (
        <div className="flex flex-col gap-2">
          <Separator />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mt-2">
            <MessageSquare className="size-3.5" />
            Observações Finais / Parecer
          </span>
          <div className="text-sm bg-muted/40 p-3.5 rounded-lg border border-border whitespace-pre-wrap leading-relaxed">
            {ordem.observacao}
          </div>
        </div>
      )}

      {/* Custos e Valores (Apenas para Administrador e Secretaria) */}
      {podeVerMetricasFinanceiras &&
        (ordem.custo_estimado || ordem.valor_total) && (
          <div className="flex flex-col gap-3">
            <Separator />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
              <DollarSign className="size-3.5 text-primary" />
              Resumo Financeiro
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-3.5 rounded-lg border">
              {ordem.custo_estimado && (
                <div>
                  <span className="text-xs text-muted-foreground block">
                    Custo Estimado
                  </span>
                  <span className="text-base font-semibold">
                    R${' '}
                    {Number(ordem.custo_estimado).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}

              {ordem.valor_total && (
                <div>
                  <span className="text-muted-foreground block text-xs">
                    Valor Total Cobrado
                  </span>
                  <span className="text-success text-lg font-bold tabular-nums">
                    R${' '}
                    {Number(ordem.valor_total).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
    </CardColapsavel>
  );
}
