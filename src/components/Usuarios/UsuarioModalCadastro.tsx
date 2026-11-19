'use client';

import { UsuarioModalForm } from './UsuarioModalForm';

interface UsuarioModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
  roleIdPadrao?: number;
  titulo?: string;
}

export function UsuarioModalCadastro({
  aberto,
  onOpenChange,
  onSucesso,
  roleIdPadrao,
  titulo = 'Cadastrar Novo Usuário',
}: UsuarioModalCadastroProps) {
  return (
    <UsuarioModalForm
      aberto={aberto}
      onOpenChange={onOpenChange}
      usuario={null}
      roleIdPadrao={roleIdPadrao}
      titulo={titulo}
      onSucesso={onSucesso}
    />
  );
}
