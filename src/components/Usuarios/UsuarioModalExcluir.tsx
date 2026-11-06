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
import type { User } from '@/src/types/user';

interface UsuarioModalExcluirProps {
  user: User | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onConfirmar: (id: string | number) => Promise<void>;
  excluindo: boolean;
}

export function UsuarioModalExcluir({
  user,
  aberto,
  onOpenChange,
  onConfirmar,
  excluindo,
}: UsuarioModalExcluirProps) {
  if (!user) return null;

  const handleConfirmar = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onConfirmar(user.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={aberto} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o usuário{' '}
            <strong className="text-foreground">{user.nome}</strong> (Função:{' '}
            {user.role?.nome || 'Sem função'})? Esta ação não pode ser desfeita.
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
