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
import type { CategoriaServico } from '@/src/types/categoria';
import { useCategoriaForm } from '@/src/hooks/useCategoriaForm';

interface CategoriaModalFormProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  categoria?: CategoriaServico | null;
  onSucesso: () => void;
}

export function CategoriaModalForm({
  aberto,
  onOpenChange,
  categoria = null,
  onSucesso,
}: CategoriaModalFormProps) {
  const isEdicao = Boolean(categoria);

  const { form, salvando, onSubmit } = useCategoriaForm({
    categoriaAtual: categoria,
    onSucesso: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const inputId = isEdicao ? 'edit-categoria-descricao' : 'categoria-descricao';

  return (
    <ModalFormulario open={aberto} onOpenChange={onOpenChange} tamanho="sm">
      <ModalFormularioHeader
        title={
          isEdicao ? 'Editar Categoria de Serviço' : 'Nova Categoria de Serviço'
        }
        description={
          isEdicao
            ? 'Atualize a descrição da categoria selecionada.'
            : 'Crie uma categoria para agrupar e organizar os serviços oferecidos.'
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
                Descrição da Categoria{' '}
                <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id={inputId}
                placeholder="Ex: Instalação, Manutenção Preventiva, Limpeza..."
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
                : 'Cadastrar Categoria'}
          </Button>
        </ModalFormularioFooter>
      </form>
    </ModalFormulario>
  );
}
