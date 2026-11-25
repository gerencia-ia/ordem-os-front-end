'use client';

import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Button } from '@/src/components/Ui/button';
import { Badge } from '@/src/components/Ui/badge';
import { Separator } from '@/src/components/Ui/separator';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '@/src/components/Ui/empty';
import {
  AirVent,
  History,
  FileEdit,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';
import type { OsEquipamentoItem } from '@/src/types/ordem';

interface DetalheEquipamentosProps {
  equipamentos?: OsEquipamentoItem[] | null;
  statusId?: number;
  onAbrirLaudo: (equipamento: OsEquipamentoItem) => void;
  onAbrirHistorico: (equipamento: OsEquipamentoItem) => void;
  podePreencherLaudo: boolean;
  podeAdicionarEquipamento?: boolean;
  onAdicionarEquipamento?: () => void;
  onRemoverEquipamento?: (
    equipamentoId: number | string,
  ) => void | Promise<void>;
  removendoEquipamentoId?: number | string | null;
}

export function DetalheEquipamentos({
  equipamentos,
  statusId,
  onAbrirLaudo,
  onAbrirHistorico,
  podePreencherLaudo,
  podeAdicionarEquipamento = false,
  onAdicionarEquipamento,
  onRemoverEquipamento,
  removendoEquipamentoId,
}: DetalheEquipamentosProps) {
  const lista = equipamentos || [];
  const concluido = statusId === 3;

  return (
    <CardColapsavel
      titulo={
        <span className="text-base sm:text-lg">
          Equipamentos ({lista.length})
        </span>
      }
      icone={<AirVent className="text-muted-foreground size-5" />}
      resumo={`${lista.length} aparelho(s) vinculado(s)`}
      defaultOpenMobile={false}
      headerAction={
        !concluido && podeAdicionarEquipamento && onAdicionarEquipamento ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onAdicionarEquipamento}
            className="gap-1.5"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Adicionar Equipamento</span>
            <span className="sm:hidden">Adicionar</span>
          </Button>
        ) : undefined
      }
      contentClassName="flex flex-col gap-4"
    >
      {lista.length > 0 ? (
        <div className="flex flex-col gap-3">
          {lista.map((equip) => {
            const temLaudo = Boolean(equip.laudo && equip.laudo.trim());

            return (
              <div
                key={equip.id}
                className="p-4 border rounded-lg bg-card hover:border-primary/40 transition-colors flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {equip.marca}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {equip.btus} BTUs
                      </Badge>
                      {equip.andar?.descricao && (
                        <Badge variant="outline" className="text-xs">
                          {equip.andar.descricao}
                        </Badge>
                      )}
                      {temLaudo && (
                        <Badge
                          variant="outline"
                          className="border-success/40 bg-success/10 text-success gap-1 text-xs"
                        >
                          <CheckCircle2 className="size-3" />
                          Laudo Preenchido
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Local de Instalação: {equip.local_instalacao}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onAbrirHistorico(equip)}
                      className="gap-1.5 text-xs h-8"
                    >
                      <History className="size-3.5" />
                      Histórico
                    </Button>

                    {podePreencherLaudo && (
                      <Button
                        type="button"
                        variant={temLaudo ? 'secondary' : 'default'}
                        size="sm"
                        onClick={() => onAbrirLaudo(equip)}
                        className="gap-1.5 text-xs h-8"
                      >
                        <FileEdit className="size-3.5" />
                        {temLaudo ? 'Editar Laudo' : 'Adicionar Laudo'}
                      </Button>
                    )}

                    {!concluido &&
                      podeAdicionarEquipamento &&
                      onRemoverEquipamento && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() =>
                            onRemoverEquipamento(
                              equip.equipamento_id || equip.id,
                            )
                          }
                          disabled={
                            removendoEquipamentoId ===
                            (equip.equipamento_id || equip.id)
                          }
                          aria-label={`Remover equipamento ${equip.marca}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                  </div>
                </div>

                {temLaudo && (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <Separator />
                    <div className="text-xs bg-muted/30 p-2.5 rounded border border-border/50">
                      <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1">
                        Laudo atual registrado:
                      </span>
                      <p className="italic text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        &quot;{equip.laudo}&quot;
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <Empty className="py-6 border rounded-lg">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AirVent className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="text-sm font-medium">
              Nenhum equipamento vinculado
            </EmptyTitle>
            <EmptyDescription className="text-xs">
              Esta ordem de serviço não possui equipamentos associados.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </CardColapsavel>
  );
}
