import { Spinner } from '@/src/components/ui/spinner';

interface CarregamentoProps {
  mensagem?: string;
  tamanho?: 'sm' | 'md' | 'lg';
}

export function Carregamento({
  mensagem = 'Carregando...',
  tamanho = 'md',
}: CarregamentoProps) {
  const tamanhos = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner className={tamanhos[tamanho]} />
      <p className="text-muted-foreground mt-4">{mensagem}</p>
    </div>
  );
}
