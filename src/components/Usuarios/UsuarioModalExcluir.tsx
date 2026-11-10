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
import type { Usuario } from '@/src/types/usuario';

interface UsuarioModalExcluirProps {
  usuario: Usuario | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onConfirmar: (id: string | number) => Promise<void>;
  excluindo: boolean;
}

export function UsuarioModalExcluir({
  usuario,
  aberto,
  onOpenChange,
  onConfirmar,
  excluindo,
}: UsuarioModalExcluirProps) {
  if (!usuario) return null;

  const handleConfirmar = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onConfirmar(usuario.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={aberto} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o usuário{' '}
            <strong className="text-foreground">{usuario.nome}</strong> (Função:{' '}
            {usuario.role?.nome || 'Sem função'})? Esta ação não pode ser
            desfeita.
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
