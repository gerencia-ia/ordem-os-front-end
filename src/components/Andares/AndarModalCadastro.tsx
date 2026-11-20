'use client';

import { AndarModalForm } from './AndarModalForm';

interface AndarModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}

export function AndarModalCadastro({
  aberto,
  onOpenChange,
  onSucesso,
}: AndarModalCadastroProps) {
  return (
    <AndarModalForm
      aberto={aberto}
      onOpenChange={onOpenChange}
      andar={null}
      onSucesso={onSucesso}
    />
  );
}
