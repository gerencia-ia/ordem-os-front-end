'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface NaoEncontradoProps {
  titulo?: string;
  descricao?: string;
  acao?: {
    texto: string;
    onClick: () => void;
  };
}

export function NaoEncontrado({
  titulo = 'Nenhum resultado encontrado',
  descricao = 'Tente ajustar seus filtros ou critérios de busca.',
  acao,
}: NaoEncontradoProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-center">{titulo}</h3>
      <p className="text-muted-foreground text-center text-sm mt-2">
        {descricao}
      </p>
      {acao && (
        <Button onClick={acao.onClick} className="mt-6">
          {acao.texto}
        </Button>
      )}
    </div>
  );
}
