'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/src/components/Ui/card';
import { Label } from '@/src/components/Ui/label';
import { Textarea } from '@/src/components/Ui/textarea';
import type { UseFormReturn } from 'react-hook-form';
import type { CriarOrdemFormData } from '@/src/types/ordem';
import { FileText } from 'lucide-react';

interface SecaoDescricaoProps {
  form: UseFormReturn<CriarOrdemFormData>;
}

export function SecaoDescricao({ form }: SecaoDescricaoProps) {
  const { register } = form;

  return (
    <Card className="bg-card/40 border-border/70 py-4 gap-4">
      <CardHeader className="px-4 pb-2 border-b">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <span>5. Detalhes e Observações</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="os-descricao">
              Descrição do Problema / Serviço
            </Label>
            <Textarea
              id="os-descricao"
              placeholder="Descreva a solicitação do cliente..."
              rows={3}
              {...register('descricao')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="os-observacao">Observações Internas</Label>
            <Textarea
              id="os-observacao"
              placeholder="Instruções de acesso, ferramentas especiais, etc."
              rows={3}
              {...register('observacao')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
