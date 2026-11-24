'use client';

import { useMemo } from 'react';
import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Button } from '@/src/components/Ui/button';
import { Skeleton } from '@/src/components/Ui/skeleton';
import { Field, FieldGroup, FieldLabel } from '@/src/components/Ui/field';
import {
  ComboboxSingle,
  type ComboboxOption,
} from '@/src/components/Ui/combobox';
import { Spinner } from '@/src/components/Ui/spinner';
import type { Usuario } from '@/src/types/usuario';

interface OrdemModalAdicionarTecnicoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tecnicos: Usuario[];
  loadingTecnicos: boolean;
  tecnicoId: string;
  onTecnicoIdChange: (val: string) => void;
  onSalvar: () => void | Promise<void>;
  salvando: boolean;
}

export function OrdemModalAdicionarTecnico({
  open,
  onOpenChange,
  tecnicos,
  loadingTecnicos,
  tecnicoId,
  onTecnicoIdChange,
  onSalvar,
  salvando,
}: OrdemModalAdicionarTecnicoProps) {
  const listaTecnicos = useMemo(
    () =>
      tecnicos.filter((u) => {
        const perfilNorm = (u.role?.nome || '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
        return perfilNorm === 'tecnico' || u.role_id === 2;
      }),
    [tecnicos],
  );

  const opcoesTecnico: ComboboxOption[] = useMemo(
    () =>
      listaTecnicos.map((tec) => ({
        value: String(tec.id),
        label: tec.nome,
        meta: tec.telefone || undefined,
      })),
    [listaTecnicos],
  );

  return (
    <ModalFormulario open={open} onOpenChange={onOpenChange} tamanho="sm">
      <ModalFormularioHeader
        title="Atribuir Técnico à Ordem"
        description="Selecione o profissional que será responsável pela execução dos serviços."
      />

      <ModalFormularioBody>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="select-tecnico">Técnico</FieldLabel>
            {loadingTecnicos ? (
              <Skeleton className="h-9 w-full" />
            ) : listaTecnicos.length > 0 ? (
              <ComboboxSingle
                id="select-tecnico"
                options={opcoesTecnico}
                value={tecnicoId}
                onValueChange={onTecnicoIdChange}
                placeholder="Selecione um técnico"
                searchPlaceholder="Buscar técnico por nome ou telefone..."
                emptyMessage="Nenhum técnico encontrado."
                disabled={salvando}
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                Nenhum técnico disponível no momento.
              </p>
            )}
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
          disabled={
            !tecnicoId.trim() ||
            salvando ||
            loadingTecnicos ||
            listaTecnicos.length === 0
          }
        >
          {salvando && <Spinner data-icon="inline-start" />}
          {salvando ? 'Atribuindo...' : 'Salvar Atribuição'}
        </Button>
      </ModalFormularioFooter>
    </ModalFormulario>
  );
}
