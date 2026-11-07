'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { Equipamento } from '@/src/types/equipamento';

interface OrdemModalLaudoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipamento: Equipamento | null;
  textoLaudo: string;
  onTextoLaudoChange: (val: string) => void;
  onSalvar: () => void | Promise<void>;
  salvando: boolean;
}

export function OrdemModalLaudo({
  open,
  onOpenChange,
  equipamento,
  textoLaudo,
  onTextoLaudoChange,
  onSalvar,
  salvando,
}: OrdemModalLaudoProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Laudo Técnico do Equipamento</DialogTitle>
          <DialogDescription>
            {equipamento ? (
              <span>
                {equipamento.marca} ({equipamento.btus} BTUs) — Local:{' '}
                {equipamento.local_instalacao}
              </span>
            ) : (
              'Selecione um equipamento.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Label htmlFor="laudo-texto">Descrição do Laudo Técnico</Label>
          <textarea
            id="laudo-texto"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            rows={5}
            placeholder="Descreva o estado, testes realizados e parecer técnico..."
            value={textoLaudo}
            onChange={(e) => onTextoLaudoChange(e.target.value)}
            disabled={salvando}
          />
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
            disabled={!equipamento || !textoLaudo.trim() || salvando}
          >
            {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {salvando ? 'Salvando...' : 'Salvar Laudo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
