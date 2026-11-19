'use client';

import type { CategoriaServico } from '@/src/types/categoria';
import { ServicoModalForm } from './ServicoModalForm';

interface ServicoModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  categorias: CategoriaServico[];
  onSucesso: () => void;
}

export function ServicoModalCadastro({
  aberto,
  onOpenChange,
  categorias,
  onSucesso,
}: ServicoModalCadastroProps) {
  return (
    <ServicoModalForm
      aberto={aberto}
      onOpenChange={onOpenChange}
      servico={null}
      categorias={categorias}
      onSucesso={onSucesso}
    />
  );
}
