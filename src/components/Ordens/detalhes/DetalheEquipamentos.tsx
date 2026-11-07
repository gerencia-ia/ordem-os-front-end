'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { AirVent, History, FileEdit, CheckCircle2 } from 'lucide-react';
import type { Equipamento } from '@/src/types/equipamento';

interface DetalheEquipamentosProps {
  equipamentos?: Equipamento[] | null;
  onAbrirLaudo: (equipamento: Equipamento) => void;
  onAbrirHistorico: (equipamento: Equipamento) => void;
  podePreencherLaudo: boolean;
}

export function DetalheEquipamentos({
  equipamentos,
  onAbrirLaudo,
  onAbrirHistorico,
  podePreencherLaudo,
}: DetalheEquipamentosProps) {
  const lista = equipamentos || [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <AirVent className="h-5 w-5 text-muted-foreground" />
          Equipamentos ({lista.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {lista.length > 0 ? (
          <div className="space-y-3">
            {lista.map((equip) => {
              const temLaudo = Boolean(equip.laudo && equip.laudo.trim());

              return (
                <div
                  key={equip.id}
                  className="p-4 border rounded-lg bg-card hover:border-primary/40 transition-colors space-y-3"
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
                        {temLaudo && (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 text-xs gap-1"
                          >
                            <CheckCircle2 className="h-3 w-3" />
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
                        <History className="h-3.5 w-3.5" />
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
                          <FileEdit className="h-3.5 w-3.5" />
                          {temLaudo ? 'Editar Laudo' : 'Adicionar Laudo'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {temLaudo && (
                    <div className="pt-2 border-t text-xs bg-muted/30 p-2.5 rounded">
                      <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block mb-1">
                        Laudo atual registrado:
                      </span>
                      <p className="italic text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        &quot;{equip.laudo}&quot;
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhum equipamento vinculado a esta ordem de serviço.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
