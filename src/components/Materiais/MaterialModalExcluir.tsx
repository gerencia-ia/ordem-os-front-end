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
import type { Material } from '@/src/types/material';

interface MaterialModalExcluirProps {
  material: Material | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onConfirmar: (material: Material) => Promise<void>;
  excluindo: boolean;
}

export function MaterialModalExcluir({
  material,
  aberto,
  onOpenChange,
  onConfirmar,
  excluindo,
}: MaterialModalExcluirProps) {
  if (!material) return null;

  return (
    <AlertDialog open={aberto} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Material</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o material{' '}
            <strong className="text-foreground">{material.nome}</strong> do
            catálogo? Os lançamentos existentes na OS serão mantidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={excluindo}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            disabled={excluindo}
            onClick={(e) => {
              e.preventDefault();
              void onConfirmar(material);
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
