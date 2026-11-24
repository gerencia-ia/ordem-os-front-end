'use client';

import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Textarea } from '@/src/components/Ui/textarea';
import { Field, FieldGroup, FieldLabel } from '@/src/components/Ui/field';
import type { UseFormReturn } from 'react-hook-form';
import type { CriarOrdemFormData } from '@/src/types/ordem';
import { FileText } from 'lucide-react';

interface SecaoDescricaoProps {
  form: UseFormReturn<CriarOrdemFormData>;
}

export function SecaoDescricao({ form }: SecaoDescricaoProps) {
  const { register } = form;

  return (
    <CardColapsavel
      titulo="6. Detalhes e Observações"
      icone={<FileText className="size-4 text-primary" />}
      resumo="Descrição e observações internas"
      defaultOpenMobile={false}
      className="bg-card/40 border-border/70"
    >
      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="os-descricao">
            Descrição do Problema / Serviço
          </FieldLabel>
          <Textarea
            id="os-descricao"
            placeholder="Descreva a solicitação do cliente..."
            rows={3}
            {...register('descricao')}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="os-observacao">Observações Internas</FieldLabel>
          <Textarea
            id="os-observacao"
            placeholder="Instruções de acesso, ferramentas especiais, etc."
            rows={3}
            {...register('observacao')}
          />
        </Field>
      </FieldGroup>
    </CardColapsavel>
  );
}
