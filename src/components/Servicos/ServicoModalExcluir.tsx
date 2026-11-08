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
} from '@/src/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import type { Servico } from '@/src/types/servico';

interface ServicoModalExcluirProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  servico: Servico | null;
  onConfirmar: () => void | Promise<void>;
  excluindo: boolean;
}

export function ServicoModalExcluir({
  aberto,
  onOpenChange,
  servico,
  onConfirmar,
  excluindo,
}: ServicoModalExcluirProps) {
  return (
    <AlertDialog open={aberto} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o serviço{' '}
            <strong className="text-foreground">
              &quot;{servico?.nome}&quot;
            </strong>
            ? Esta ação removerá o serviço do catálogo.
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
            {excluindo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {excluindo ? 'Excluindo...' : 'Sim, excluir serviço'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
