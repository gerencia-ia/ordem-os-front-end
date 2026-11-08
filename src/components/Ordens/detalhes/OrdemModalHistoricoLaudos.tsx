'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/Ui/dialog';
import { Button } from '@/src/components/Ui/button';
import { Badge } from '@/src/components/Ui/badge';
import { Loader2 } from 'lucide-react';
import type { Equipamento, HistoricoLaudo } from '@/src/types/equipamento';
import { formatarDataHoraCurta } from '@/src/utils/date';

interface OrdemModalHistoricoLaudosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipamento: Equipamento | null;
  laudos: HistoricoLaudo[];
  loading: boolean;
}

export function OrdemModalHistoricoLaudos({
  open,
  onOpenChange,
  equipamento,
  laudos,
  loading,
}: OrdemModalHistoricoLaudosProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Laudos do Equipamento</DialogTitle>
          <DialogDescription>
            {equipamento ? (
              <span>
                {equipamento.marca} ({equipamento.btus} BTUs) —{' '}
                {equipamento.local_instalacao}
              </span>
            ) : (
              'Selecione um equipamento.'
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm">Carregando histórico...</p>
          </div>
        ) : laudos.length > 0 ? (
          <div className="mt-4 border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-muted/50 border-b text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="text-left py-3 px-4">Data Fechamento</th>
                    <th className="text-left py-3 px-4">Parecer do Laudo</th>
                    <th className="text-left py-3 px-4">OS</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {laudos.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30">
                      <td className="py-3 px-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {item.ordem_servico?.data_fechamento
                          ? formatarDataHoraCurta(
                              item.ordem_servico.data_fechamento,
                            )
                          : formatarDataHoraCurta(item.created_at)}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs leading-relaxed line-clamp-3">
                          {item.laudo}
                        </p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-xs font-semibold">
                          #{item.ordem_servico?.id || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Badge variant="outline" className="text-xs">
                          {item.ordem_servico?.status || 'Registrado'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-12 text-sm text-muted-foreground">
            Nenhum laudo anterior registrado para este equipamento.
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
