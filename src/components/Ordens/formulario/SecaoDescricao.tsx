'use client';

import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import type { CriarOrdemFormData } from '@/src/types/ordem';
import { FileText } from 'lucide-react';

interface SecaoDescricaoProps {
  form: UseFormReturn<CriarOrdemFormData>;
}

export function SecaoDescricao({ form }: SecaoDescricaoProps) {
  const { register } = form;

  return (
    <div className="space-y-4 rounded-lg border bg-card/40 p-4">
      <div className="flex items-center gap-2 border-b pb-2 text-sm font-semibold text-foreground">
        <FileText className="h-4 w-4 text-primary" />
        <span>5. Detalhes e Observações</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="os-descricao">Descrição do Problema / Serviço</Label>
          <Textarea
            id="os-descricao"
            placeholder="Descreva a solicitação do cliente..."
            rows={3}
            {...register('descricao')}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="os-observacao">Observações Internas</Label>
          <Textarea
            id="os-observacao"
            placeholder="Instruções de acesso, ferramentas especiais, etc."
            rows={3}
            {...register('observacao')}
          />
        </div>
      </div>
    </div>
  );
}
