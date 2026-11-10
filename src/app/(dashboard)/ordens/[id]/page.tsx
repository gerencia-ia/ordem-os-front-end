'use client';

import { useParams } from 'next/navigation';
import { OrdemDetalhe } from '@/src/components/Ordens/OrdemDetalhe';

export default function PaginaDetalheOrdem() {
  const params = useParams();
  const ordemId = params.id as string;

  return <OrdemDetalhe ordemId={ordemId} />;
}
