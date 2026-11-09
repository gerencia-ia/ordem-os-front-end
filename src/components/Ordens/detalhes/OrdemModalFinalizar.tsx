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
import { Input } from '@/src/components/Ui/input';
import { Label } from '@/src/components/Ui/label';
import { Textarea } from '@/src/components/Ui/textarea';
import { Loader2 } from 'lucide-react';

interface OrdemModalFinalizarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  valorFinal: string;
  onValorFinalChange: (val: string) => void;
  observacaoFinal: string;
  onObservacaoFinalChange: (val: string) => void;
  onSalvar: () => void | Promise<void>;
  salvando: boolean;
  podeVerMetricasFinanceiras: boolean;
}

export function OrdemModalFinalizar({
  open,
  onOpenChange,
  valorFinal,
  onValorFinalChange,
  observacaoFinal,
  onObservacaoFinalChange,
  onSalvar,
  salvando,
  podeVerMetricasFinanceiras,
}: OrdemModalFinalizarProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finalizar Atendimento</DialogTitle>
          <DialogDescription>
            Conclua o atendimento preenchendo as informações finais de execução.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {podeVerMetricasFinanceiras && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="input-valor-final">
                Valor Total Cobrado (R$)
              </Label>
              <Input
                id="input-valor-final"
                type="number"
                step="0.01"
                placeholder="Ex: 250.00"
                value={valorFinal}
                onChange={(e) => onValorFinalChange(e.target.value)}
                disabled={salvando}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="textarea-observacao-final">
              Observações Finais
            </Label>
            <Textarea
              id="textarea-observacao-final"
              rows={4}
              placeholder="Descreva detalhes da conclusão do serviço, peças utilizadas, etc..."
              value={observacaoFinal}
              onChange={(e) => onObservacaoFinalChange(e.target.value)}
              disabled={salvando}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={salvando}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => void onSalvar()}
            disabled={salvando}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {salvando && <Loader2 className="mr-2 size-4 animate-spin" />}
            {salvando ? 'Finalizando...' : 'Concluir Atendimento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
