'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/Ui/alert-dialog';
import { Spinner } from '@/src/components/Ui/spinner';
import type { Equipamento } from '@/src/types/equipamento';

interface EquipamentoModalExcluirProps {
  equipamento: Equipamento | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onConfirmar: (equipamento: Equipamento) => Promise<void>;
  excluindo: boolean;
}

export function EquipamentoModalExcluir({
  equipamento,
  aberto,
  onOpenChange,
  onConfirmar,
  excluindo,
}: EquipamentoModalExcluirProps) {
  if (!equipamento) return null;

  return (
    <AlertDialog open={aberto} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Equipamento</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o equipamento{' '}
            <strong className="text-foreground">
              {equipamento.marca} ({equipamento.btus} BTUs)
            </strong>{' '}
            localizado em {equipamento.local_instalacao}? Esta ação não poderá
            ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={excluindo}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={excluindo}
            onClick={(e) => {
              e.preventDefault();
              void onConfirmar(equipamento);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {excluindo && <Spinner data-icon="inline-start" />}
            Confirmar Exclusão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
