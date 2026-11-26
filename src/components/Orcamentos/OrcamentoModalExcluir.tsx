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
import type { Orcamento } from '@/src/types/orcamento';

interface OrcamentoModalExcluirProps {
  orcamento: Orcamento | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onConfirmar: (id: number) => Promise<void>;
  excluindo: boolean;
}

export function OrcamentoModalExcluir({
  orcamento,
  aberto,
  onOpenChange,
  onConfirmar,
  excluindo,
}: OrcamentoModalExcluirProps) {
  return (
    <AlertDialog open={aberto} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Orçamento</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o orçamento{' '}
            <strong>#{orcamento?.numero_orcamento || orcamento?.id}</strong>{' '}
            {orcamento?.cliente?.nome ? `para ${orcamento.cliente.nome}` : ''}?
            Esta ação não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={excluindo}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              if (orcamento) {
                void onConfirmar(orcamento.id);
              }
            }}
            disabled={excluindo}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {excluindo && <Spinner data-icon="inline-start" />}
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
