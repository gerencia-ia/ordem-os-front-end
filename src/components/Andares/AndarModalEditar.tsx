'use client';

import type { Andar } from '@/src/types/andar';
import { AndarModalForm } from './AndarModalForm';

interface AndarModalEditarProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  andar: Andar | null;
  onSucesso: () => void;
}

export function AndarModalEditar({
  aberto,
  onOpenChange,
  andar,
  onSucesso,
}: AndarModalEditarProps) {
  return (
    <AndarModalForm
      aberto={aberto}
      onOpenChange={onOpenChange}
      andar={andar}
      onSucesso={onSucesso}
    />
  );
}
