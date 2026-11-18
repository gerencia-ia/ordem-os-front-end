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
import { Loader2 } from 'lucide-react';
import type { Andar } from '@/src/types/andar';

interface AndarModalExcluirProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  andar: Andar | null;
  onConfirmar: () => void | Promise<void>;
  excluindo: boolean;
}

export function AndarModalExcluir({
  aberto,
  onOpenChange,
  andar,
  onConfirmar,
  excluindo,
}: AndarModalExcluirProps) {
  return (
    <AlertDialog open={aberto} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Andar</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o andar{' '}
            <strong className="text-foreground">
              &quot;{andar?.descricao}&quot;
            </strong>
            ? Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={excluindo}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              void onConfirmar();
            }}
            disabled={excluindo}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {excluindo && <Loader2 className="mr-2 size-4 animate-spin" />}
            {excluindo ? 'Excluindo...' : 'Sim, excluir andar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
