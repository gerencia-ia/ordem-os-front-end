'use client';

import type { Usuario } from '@/src/types/usuario';
import { UsuarioModalForm } from './UsuarioModalForm';

interface UsuarioModalEdicaoProps {
  usuario: Usuario | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
  titulo?: string;
}

export function UsuarioModalEdicao({
  usuario,
  aberto,
  onOpenChange,
  onSucesso,
  titulo = 'Editar Usuário',
}: UsuarioModalEdicaoProps) {
  if (!usuario) return null;

  return (
    <UsuarioModalForm
      key={usuario.id}
      aberto={aberto}
      onOpenChange={onOpenChange}
      usuario={usuario}
      titulo={titulo}
      onSucesso={onSucesso}
    />
  );
}
