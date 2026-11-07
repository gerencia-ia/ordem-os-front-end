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
import type { Cliente } from '@/src/types/cliente';

interface ClienteModalExcluirProps {
  cliente: Cliente | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onConfirmar: (id: number) => Promise<void>;
  excluindo: boolean;
}

export function ClienteModalExcluir({
  cliente,
  aberto,
  onOpenChange,
  onConfirmar,
  excluindo,
}: ClienteModalExcluirProps) {
  if (!cliente) return null;

  const handleConfirmar = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onConfirmar(cliente.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={aberto} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o cliente{' '}
            <strong className="text-foreground">{cliente.nome}</strong>? Esta
            ação não pode ser desfeita e removerá os telefones e endereços
            vinculados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={excluindo}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmar}
            disabled={excluindo}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {excluindo ? 'Excluindo...' : 'Confirmar Exclusão'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
