'use client';

import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { Textarea } from '@/src/components/Ui/textarea';
import { Field, FieldGroup, FieldLabel } from '@/src/components/Ui/field';
import { Spinner } from '@/src/components/Ui/spinner';

interface OrdemModalFinalizarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  valorFinal: string;
  onValorFinalChange: (val: string) => void;
  observacaoFinal: string;
  onObservacaoFinalChange: (val: string) => void;
  onSalvar: () => void | Promise<void>;
  salvando: boolean;
  podeVerMetricasFinanceiras: boolean;
}

export function OrdemModalFinalizar({
  open,
  onOpenChange,
  valorFinal,
  onValorFinalChange,
  observacaoFinal,
  onObservacaoFinalChange,
  onSalvar,
  salvando,
  podeVerMetricasFinanceiras,
}: OrdemModalFinalizarProps) {
  return (
    <ModalFormulario open={open} onOpenChange={onOpenChange} tamanho="sm">
      <ModalFormularioHeader
        title="Finalizar Atendimento"
        description="Conclua o atendimento preenchendo as informações finais de execução."
      />

      <ModalFormularioBody>
        <FieldGroup className="gap-4">
          {podeVerMetricasFinanceiras && (
            <Field>
              <FieldLabel htmlFor="input-valor-final">
                Valor Total Cobrado (R$)
              </FieldLabel>
              <Input
                id="input-valor-final"
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="Ex: 250.00"
                value={valorFinal}
                onChange={(e) => onValorFinalChange(e.target.value)}
                disabled={salvando}
              />
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="textarea-observacao-final">
              Observações Finais
            </FieldLabel>
            <Textarea
              id="textarea-observacao-final"
              rows={4}
              placeholder="Descreva detalhes da conclusão do serviço, peças utilizadas, etc..."
              value={observacaoFinal}
              onChange={(e) => onObservacaoFinalChange(e.target.value)}
              disabled={salvando}
            />
          </Field>
        </FieldGroup>
      </ModalFormularioBody>

      <ModalFormularioFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={salvando}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="success"
          onClick={() => void onSalvar()}
          disabled={salvando}
        >
          {salvando && <Spinner data-icon="inline-start" />}
          {salvando ? 'Finalizando...' : 'Concluir Atendimento'}
        </Button>
      </ModalFormularioFooter>
    </ModalFormulario>
  );
}
