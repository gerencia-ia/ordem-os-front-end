'use client';

import type { CategoriaServico } from '@/src/types/categoria';
import { CategoriaModalForm } from './CategoriaModalForm';

interface CategoriaModalEditarProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  categoria: CategoriaServico | null;
  onSucesso: () => void;
}

export function CategoriaModalEditar({
  aberto,
  onOpenChange,
  categoria,
  onSucesso,
}: CategoriaModalEditarProps) {
  return (
    <CategoriaModalForm
      aberto={aberto}
      onOpenChange={onOpenChange}
      categoria={categoria}
      onSucesso={onSucesso}
    />
  );
}
