'use client';

import { useMemo } from 'react';
import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Separator } from '@/src/components/Ui/separator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { Input } from '@/src/components/Ui/input';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/Ui/field';
import {
  ComboboxMultiple,
  type ComboboxOption,
} from '@/src/components/Ui/combobox';
import type { UseFormReturn } from 'react-hook-form';
import type { CriarOrdemFormData, Status, Prioridade } from '@/src/types/ordem';
import type { Usuario } from '@/src/types/usuario';
import { Clock, UserCheck } from 'lucide-react';

interface SecaoAgendamentoEquipeProps {
  form: UseFormReturn<CriarOrdemFormData>;
  statusList: Status[];
  prioridadesList: Prioridade[];
  tecnicos: Usuario[];
  tecnicoIdsSelecionados: number[];
  loadingDados: boolean;
  onChangeTecnicos: (ids: number[]) => void;
}

export function SecaoAgendamentoEquipe({
  form,
  statusList,
  prioridadesList,
  tecnicos,
  tecnicoIdsSelecionados,
  loadingDados,
  onChangeTecnicos,
}: SecaoAgendamentoEquipeProps) {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = form;

  const statusId = watch('status_id');
  const prioridadeId = watch('prioridade_id');

  const tecnicosOptions: ComboboxOption[] = useMemo(
    () =>
      tecnicos.map((tec) => ({
        value: String(tec.id),
        label: tec.nome,
        meta: tec.telefone || undefined,
      })),
    [tecnicos],
  );

  const tecnicosSelecionadosStrings = useMemo(
    () => tecnicoIdsSelecionados.map(String),
    [tecnicoIdsSelecionados],
  );

  return (
    <CardColapsavel
      titulo="5. Planejamento, Agendamento e Equipe"
      icone={<Clock className="size-4 text-primary" />}
      resumo={`${tecnicoIdsSelecionados.length} técnico(s)`}
      defaultOpenMobile={false}
      hasError={Boolean(errors.status_id || errors.prioridade_id)}
      className="bg-card/40 border-border/70"
      contentClassName="flex flex-col gap-4"
    >
      <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field data-invalid={Boolean(errors.status_id)}>
          <FieldLabel htmlFor="os-status">
            Status Inicial <span className="text-destructive">*</span>
          </FieldLabel>
          <Select
            value={statusId ? String(statusId) : ''}
            onValueChange={(val) => {
              setValue('status_id', Number(val), { shouldValidate: true });
            }}
            disabled={loadingDados}
          >
            <SelectTrigger
              id="os-status"
              className="w-full"
              aria-invalid={Boolean(errors.status_id)}
            >
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {statusList.map((st) => (
                  <SelectItem key={st.id} value={String(st.id)}>
                    {st.nome}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError errors={[errors.status_id]} />
        </Field>

        <Field data-invalid={Boolean(errors.prioridade_id)}>
          <FieldLabel htmlFor="os-prioridade">
            Prioridade <span className="text-destructive">*</span>
          </FieldLabel>
          <Select
            value={prioridadeId ? String(prioridadeId) : ''}
            onValueChange={(val) => {
              setValue('prioridade_id', Number(val), {
                shouldValidate: true,
              });
            }}
            disabled={loadingDados}
          >
            <SelectTrigger
              id="os-prioridade"
              className="w-full"
              aria-invalid={Boolean(errors.prioridade_id)}
            >
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {prioridadesList.map((pr) => (
                  <SelectItem key={pr.id} value={String(pr.id)}>
                    {pr.descricao}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError errors={[errors.prioridade_id]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="os-data">Data de Agendamento</FieldLabel>
          <Input
            id="os-data"
            type="datetime-local"
            {...register('data_agendamento')}
          />
        </Field>
      </FieldGroup>

      <Separator />

      <Field>
        <FieldLabel htmlFor="os-tecnicos" className="flex items-center gap-1.5">
          <UserCheck className="size-3.5 text-primary" />
          <span>Técnicos Atribuídos</span>
          <span className="text-muted-foreground text-xs font-normal">
            ({tecnicoIdsSelecionados.length} selecionado(s))
          </span>
        </FieldLabel>

        {tecnicos.length === 0 ? (
          <p className="text-muted-foreground text-xs italic">
            Nenhum técnico cadastrado no sistema.
          </p>
        ) : (
          <ComboboxMultiple
            id="os-tecnicos"
            options={tecnicosOptions}
            value={tecnicosSelecionadosStrings}
            onValueChange={(vals) => onChangeTecnicos(vals.map(Number))}
            placeholder="Selecione um ou mais técnicos..."
            searchPlaceholder="Buscar técnico por nome ou telefone..."
            emptyMessage="Nenhum técnico encontrado."
            disabled={loadingDados}
          />
        )}
      </Field>
    </CardColapsavel>
  );
}
