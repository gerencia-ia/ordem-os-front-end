'use client';

import { CategoriaModalForm } from './CategoriaModalForm';

interface CategoriaModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}

export function CategoriaModalCadastro({
  aberto,
  onOpenChange,
  onSucesso,
}: CategoriaModalCadastroProps) {
  return (
    <CategoriaModalForm
      aberto={aberto}
      onOpenChange={onOpenChange}
      categoria={null}
      onSucesso={onSucesso}
    />
  );
}
