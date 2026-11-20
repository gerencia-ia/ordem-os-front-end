'use client';

import { Controller, useWatch } from 'react-hook-form';
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/Ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { Spinner } from '@/src/components/Ui/spinner';
import type { Servico } from '@/src/types/servico';
import type { CategoriaServico } from '@/src/types/categoria';
import { useServicoForm } from '@/src/hooks/useServicoForm';
import { formatarDuracaoHHMM } from '@/src/utils/date';
import { ServicoValoresPorAndarCampos } from './ServicoValoresPorAndarCampos';

interface ServicoModalFormProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  servico?: Servico | null;
  categorias: CategoriaServico[];
  onSucesso: () => void;
}

export function ServicoModalForm({
  aberto,
  onOpenChange,
  servico = null,
  categorias,
  onSucesso,
}: ServicoModalFormProps) {
  const isEdicao = Boolean(servico);

  const {
    form,
    salvando,
    andares,
    carregandoAndares,
    valoresFields,
    adicionarValorPorAndar,
    removerValorPorAndar,
    onSubmit,
  } = useServicoForm({
    servicoAtual: servico,
    aberto,
    onSucesso: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  const tempoObservado = useWatch({ control, name: 'tempo_servico' });
  const tempoFormatado = formatarDuracaoHHMM(tempoObservado);

  return (
    <ModalFormulario open={aberto} onOpenChange={onOpenChange} tamanho="md">
      <ModalFormularioHeader
        title={isEdicao ? 'Editar Serviço' : 'Novo Serviço'}
        description={
          isEdicao
            ? 'Atualize as informações do serviço selecionado.'
            : 'Cadastre um novo serviço para inclusão no catálogo e nas ordens de serviço.'
        }
      />

      <form
        onSubmit={onSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <ModalFormularioBody>
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.nome)}>
              <FieldLabel htmlFor="servico-nome">
                Nome do Serviço <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="servico-nome"
                placeholder="Ex: Instalação de Split 9000 BTUs"
                aria-invalid={Boolean(errors.nome)}
                {...register('nome')}
                disabled={salvando}
              />
              <FieldError errors={[errors.nome]} />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="servico-categoria">Categoria</FieldLabel>
                <Controller
                  control={control}
                  name="categorias_servico_id"
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : 'nenhuma'}
                      onValueChange={(val) =>
                        field.onChange(val === 'nenhuma' ? null : Number(val))
                      }
                      disabled={salvando}
                    >
                      <SelectTrigger id="servico-categoria" className="w-full">
                        <SelectValue placeholder="Selecione (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="nenhuma">
                            Nenhuma (opcional)
                          </SelectItem>
                          {categorias.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                              {cat.descricao}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field data-invalid={Boolean(errors.tempo_servico)}>
                <FieldLabel htmlFor="servico-tempo">
                  Tempo Estimado (min)
                </FieldLabel>
                <Input
                  id="servico-tempo"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  placeholder="Ex: 60"
                  aria-invalid={Boolean(errors.tempo_servico)}
                  {...register('tempo_servico')}
                  disabled={salvando}
                />
                {tempoFormatado !== '—' && (
                  <FieldDescription className="text-xs tabular-nums">
                    Equivale a {tempoFormatado} (hh:mm)
                  </FieldDescription>
                )}
                <FieldError errors={[errors.tempo_servico]} />
              </Field>
            </div>

            <ServicoValoresPorAndarCampos
              control={control}
              register={register}
              errors={errors}
              fields={valoresFields}
              andares={andares}
              carregandoAndares={carregandoAndares}
              salvando={salvando}
              onAdicionar={adicionarValorPorAndar}
              onRemover={removerValorPorAndar}
            />
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
                : 'Cadastrar Serviço'}
          </Button>
        </ModalFormularioFooter>
      </form>
    </ModalFormulario>
  );
}
