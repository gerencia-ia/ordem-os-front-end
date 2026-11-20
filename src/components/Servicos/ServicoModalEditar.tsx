'use client';

import type { Servico } from '@/src/types/servico';
import type { CategoriaServico } from '@/src/types/categoria';
import { ServicoModalForm } from './ServicoModalForm';

interface ServicoModalEditarProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  servico: Servico | null;
  categorias: CategoriaServico[];
  onSucesso: () => void;
}

export function ServicoModalEditar({
  aberto,
  onOpenChange,
  servico,
  categorias,
  onSucesso,
}: ServicoModalEditarProps) {
  return (
    <ServicoModalForm
      aberto={aberto}
      onOpenChange={onOpenChange}
      servico={servico}
      categorias={categorias}
      onSucesso={onSucesso}
    />
  );
}
