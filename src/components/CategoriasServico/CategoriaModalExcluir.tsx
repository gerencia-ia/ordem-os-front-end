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
import type { CategoriaServico } from '@/src/types/categoria';

interface CategoriaModalExcluirProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  categoria: CategoriaServico | null;
  onConfirmar: () => void | Promise<void>;
  excluindo: boolean;
}

export function CategoriaModalExcluir({
  aberto,
  onOpenChange,
  categoria,
  onConfirmar,
  excluindo,
}: CategoriaModalExcluirProps) {
  return (
    <AlertDialog open={aberto} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a categoria{' '}
            <strong className="text-foreground">
              &quot;{categoria?.descricao}&quot;
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
            {excluindo ? 'Excluindo...' : 'Sim, excluir categoria'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
