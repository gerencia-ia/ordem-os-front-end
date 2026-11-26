'use client';

import { useParams } from 'next/navigation';
import { OrcamentoDetalhe } from '@/src/components/Orcamentos/OrcamentoDetalhe';

export default function PaginaDetalheOrcamento() {
  const params = useParams();
  const orcamentoId = params.id as string;

  return <OrcamentoDetalhe orcamentoId={orcamentoId} />;
}
