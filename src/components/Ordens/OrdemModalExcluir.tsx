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
import type { OrdemServico } from '@/src/types/ordem';
import { Loader2 } from 'lucide-react';

interface OrdemModalExcluirProps {
  ordem: OrdemServico | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onConfirmar: (id: string | number) => Promise<void>;
  excluindo: boolean;
}

export function OrdemModalExcluir({
  ordem,
  aberto,
  onOpenChange,
  onConfirmar,
  excluindo,
}: OrdemModalExcluirProps) {
  if (!ordem) return null;

  return (
    <AlertDialog open={aberto} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Ordem de Serviço</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a ordem de serviço{' '}
            <strong className="text-foreground">
              #{ordem.numero_ordem || ordem.id}
            </strong>
            {ordem.cliente?.nome ? ` do cliente ${ordem.cliente.nome}` : ''}?
            Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={excluindo}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={excluindo}
            onClick={(e) => {
              e.preventDefault();
              void onConfirmar(ordem.id);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {excluindo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar Exclusão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
