'use client';

import { useMemo } from 'react';
import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { Field, FieldGroup, FieldLabel } from '@/src/components/Ui/field';
import {
  ComboboxSingle,
  type ComboboxOption,
} from '@/src/components/Ui/combobox';
import { Spinner } from '@/src/components/Ui/spinner';
import type { Material } from '@/src/types/material';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materiais: Material[];
  loading: boolean;
  materialId: string;
  nome: string;
  valor: string;
  onMaterialIdChange: (value: string) => void;
  onNomeChange: (value: string) => void;
  onValorChange: (value: string) => void;
  onSalvar: () => void;
  salvando: boolean;
}

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);

export function OrdemModalAdicionarMaterial({
  open,
  onOpenChange,
  materiais,
  loading,
  materialId,
  nome,
  valor,
  onMaterialIdChange,
  onNomeChange,
  onValorChange,
  onSalvar,
  salvando,
}: Props) {
  const materialOptions: ComboboxOption[] = useMemo(
    () => [
      {
        value: 'avulso',
        label: 'Lançamento avulso',
        description: 'Informar nome e valor manualmente',
      },
      ...materiais.map((m) => ({
        value: String(m.id),
        label: m.nome,
        meta:
          m.valor_referencia != null
            ? formatarMoeda(Number(m.valor_referencia))
            : undefined,
      })),
    ],
    [materiais],
  );

  return (
    <ModalFormulario open={open} onOpenChange={onOpenChange} tamanho="md">
      <ModalFormularioHeader
        title="Lançar material na OS"
        description="Selecione um item do catálogo ou informe um material avulso. O valor vale para esta ordem."
      />

      <ModalFormularioBody>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="material-os-catalogo">
              Material cadastrado
            </FieldLabel>
            <ComboboxSingle
              id="material-os-catalogo"
              options={materialOptions}
              value={materialId}
              onValueChange={(val) => onMaterialIdChange(val || 'avulso')}
              placeholder="Lançamento avulso"
              searchPlaceholder="Buscar material..."
              emptyMessage="Nenhum material encontrado."
              disabled={loading || salvando}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="material-os-nome">Nome</FieldLabel>
            <Input
              id="material-os-nome"
              value={nome}
              onChange={(event) => onNomeChange(event.target.value)}
              placeholder="Nome do material"
              disabled={salvando}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="material-os-valor">
              Valor lançado (R$)
            </FieldLabel>
            <Input
              id="material-os-valor"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={valor}
              onChange={(event) => onValorChange(event.target.value)}
              placeholder="0,00"
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
          onClick={onSalvar}
          disabled={
            !nome.trim() ||
            valor.trim() === '' ||
            !Number.isFinite(Number(valor)) ||
            Number(valor) < 0 ||
            salvando ||
            loading
          }
        >
          {salvando && <Spinner data-icon="inline-start" />}
          {salvando ? 'Adicionando...' : 'Adicionar material'}
        </Button>
      </ModalFormularioFooter>
    </ModalFormulario>
  );
}
