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
import type { Material } from '@/src/types/material';

interface MaterialFormState {
  nome: string;
  descricao: string;
  valor_referencia: string;
}

interface MaterialModalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materialEditando: Material | null;
  form: MaterialFormState;
  onFormChange: (
    updater: (prev: MaterialFormState) => MaterialFormState,
  ) => void;
  onSalvar: () => void | Promise<void>;
  salvando: boolean;
}

export function MaterialModalForm({
  open,
  onOpenChange,
  materialEditando,
  form,
  onFormChange,
  onSalvar,
  salvando,
}: MaterialModalFormProps) {
  return (
    <ModalFormulario open={open} onOpenChange={onOpenChange} tamanho="md">
      <ModalFormularioHeader
        title={materialEditando ? 'Editar material' : 'Novo material'}
        description="O valor cadastrado serve como referência e pode ser alterado na ordem de serviço."
      />

      <ModalFormularioBody>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="material-nome">
              Nome <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="material-nome"
              value={form.nome}
              onChange={(e) =>
                onFormChange((f) => ({ ...f, nome: e.target.value }))
              }
              placeholder="Ex.: Cabo de cobre"
              disabled={salvando}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="material-valor">
              Valor de referência (R$)
            </FieldLabel>
            <Input
              id="material-valor"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={form.valor_referencia}
              onChange={(e) =>
                onFormChange((f) => ({
                  ...f,
                  valor_referencia: e.target.value,
                }))
              }
              placeholder="Opcional"
              disabled={salvando}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="material-descricao">
              Descrição (opcional)
            </FieldLabel>
            <Textarea
              id="material-descricao"
              value={form.descricao}
              onChange={(e) =>
                onFormChange((f) => ({ ...f, descricao: e.target.value }))
              }
              rows={3}
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
          onClick={() => void onSalvar()}
          disabled={salvando}
        >
          {salvando && <Spinner data-icon="inline-start" />}
          {salvando ? 'Salvando...' : 'Salvar material'}
        </Button>
      </ModalFormularioFooter>
    </ModalFormulario>
  );
}
