'use client';

import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/Ui/field';
import { Spinner } from '@/src/components/Ui/spinner';
import type { Andar } from '@/src/types/andar';
import { useAndarForm } from '@/src/hooks/useAndarForm';

interface AndarModalFormProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  andar?: Andar | null;
  onSucesso: () => void;
}

export function AndarModalForm({
  aberto,
  onOpenChange,
  andar = null,
  onSucesso,
}: AndarModalFormProps) {
  const isEdicao = Boolean(andar);

  const { form, salvando, onSubmit } = useAndarForm({
    andarAtual: andar,
    onSucesso: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const inputId = isEdicao ? 'edit-andar-descricao' : 'andar-descricao';

  return (
    <ModalFormulario open={aberto} onOpenChange={onOpenChange} tamanho="sm">
      <ModalFormularioHeader
        title={isEdicao ? 'Editar Andar' : 'Novo Andar'}
        description={
          isEdicao
            ? 'Atualize a descrição do andar selecionado.'
            : 'Cadastre um andar ou pavimento para vincular equipamentos e definir valores de serviços.'
        }
      />

      <form
        onSubmit={onSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <ModalFormularioBody>
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.descricao)}>
              <FieldLabel htmlFor={inputId}>
                Descrição do Andar <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id={inputId}
                placeholder="Ex: Térreo, 1º Andar, Cobertura..."
                aria-invalid={Boolean(errors.descricao)}
                {...register('descricao')}
                disabled={salvando}
              />
              <FieldError errors={[errors.descricao]} />
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
          <Button type="submit" disabled={salvando}>
            {salvando && <Spinner data-icon="inline-start" />}
            {salvando
              ? 'Salvando...'
              : isEdicao
                ? 'Salvar Alterações'
                : 'Cadastrar Andar'}
          </Button>
        </ModalFormularioFooter>
      </form>
    </ModalFormulario>
  );
}
