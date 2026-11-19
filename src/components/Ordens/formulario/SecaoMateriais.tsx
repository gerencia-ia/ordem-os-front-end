'use client';

import { useMemo, useState } from 'react';
import { Check, Package, Plus, Trash2 } from 'lucide-react';
import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { Badge } from '@/src/components/Ui/badge';
import { Field, FieldGroup, FieldLabel } from '@/src/components/Ui/field';
import {
  ComboboxSingle,
  type ComboboxOption,
} from '@/src/components/Ui/combobox';
import type { Material, MaterialOrdemInput } from '@/src/types/material';

interface SecaoMateriaisProps {
  materiais: Material[];
  itens: MaterialOrdemInput[];
  loading: boolean;
  onAdicionar: (item: MaterialOrdemInput) => void;
  onRemover: (indice: number) => void;
}

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);

export function SecaoMateriais({
  materiais,
  itens,
  loading,
  onAdicionar,
  onRemover,
}: SecaoMateriaisProps) {
  const [materialId, setMaterialId] = useState('avulso');
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  const materialSelecionado = useMemo(
    () => materiais.find((material) => String(material.id) === materialId),
    [materiais, materialId],
  );

  const materialOptions: ComboboxOption[] = useMemo(
    () => [
      {
        value: 'avulso',
        label: 'Lançamento avulso',
        description: 'Digitar nome e valor manualmente',
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

  const selecionar = (id: string) => {
    const proximoId = id || 'avulso';
    setMaterialId(proximoId);
    const material = materiais.find((item) => String(item.id) === proximoId);
    setNome(material?.nome ?? '');
    setValor(
      material?.valor_referencia == null
        ? ''
        : String(material.valor_referencia),
    );
  };

  const adicionar = () => {
    const valorNumerico = Number(valor);
    if (
      !nome.trim() ||
      valor.trim() === '' ||
      !Number.isFinite(valorNumerico) ||
      valorNumerico < 0
    ) {
      return;
    }
    onAdicionar({
      material_id: materialSelecionado?.id ?? null,
      nome_material: nome.trim(),
      valor: valorNumerico,
    });
    selecionar('avulso');
  };

  const total = itens.reduce((sum, item) => sum + Number(item.valor || 0), 0);

  return (
    <CardColapsavel
      titulo={
        <span className="flex items-center gap-2">
          <span>4. Materiais e Peças</span>
          <span className="text-muted-foreground hidden text-xs font-normal sm:inline">
            ({itens.length} lançado(s))
          </span>
        </span>
      }
      icone={<Package className="size-4 text-primary" />}
      resumo={`${itens.length} lançado(s) • ${formatarMoeda(total)}`}
      defaultOpenMobile={false}
      headerAction={
        <div className="hidden text-right sm:block">
          <span className="text-muted-foreground mr-1.5 text-xs">
            Subtotal:
          </span>
          <span className="text-success text-sm font-bold tabular-nums">
            {formatarMoeda(total)}
          </span>
        </div>
      }
      className="bg-card/40 border-border/70"
      contentClassName="flex flex-col gap-4"
    >
      <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_130px_auto] lg:items-end">
        <Field>
          <FieldLabel htmlFor="os-material-catalogo">
            Material do catálogo
          </FieldLabel>
          <ComboboxSingle
            id="os-material-catalogo"
            options={materialOptions}
            value={materialId}
            onValueChange={selecionar}
            placeholder="Selecione ou lance avulso"
            searchPlaceholder="Buscar material..."
            emptyMessage="Nenhum material encontrado."
            disabled={loading}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="os-material-nome">Nome do material</FieldLabel>
          <Input
            id="os-material-nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            placeholder="Ex.: Tubulação de cobre"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="os-material-valor">Valor (R$)</FieldLabel>
          <Input
            id="os-material-valor"
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={valor}
            onChange={(event) => setValor(event.target.value)}
            placeholder="0,00"
          />
        </Field>

        <Button
          type="button"
          variant="outline"
          onClick={adicionar}
          disabled={
            !nome.trim() ||
            valor.trim() === '' ||
            !Number.isFinite(Number(valor)) ||
            Number(valor) < 0
          }
          className="w-full gap-1.5 sm:col-span-2 lg:col-span-1 lg:w-auto"
        >
          <Plus data-icon="inline-start" />
          Adicionar
        </Button>
      </FieldGroup>

      {loading && (
        <p className="text-muted-foreground text-xs">
          Carregando catálogo de materiais...
        </p>
      )}

      {itens.length > 0 ? (
        <div className="divide-y rounded-md border">
          {itens.map((item, index) => (
            <div
              key={`${item.material_id ?? 'avulso'}-${index}`}
              className="flex items-center justify-between gap-3 px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-2">
                <Check className="size-4 shrink-0 text-primary" />
                <span className="truncate text-sm">{item.nome_material}</span>
                {item.material_id && (
                  <Badge variant="outline" className="text-[10px]">
                    Catálogo
                  </Badge>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-medium tabular-nums">
                  {formatarMoeda(Number(item.valor))}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  onClick={() => onRemover(index)}
                  aria-label={`Remover ${item.nome_material}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-xs">
          Você pode selecionar um material cadastrado ou lançar qualquer
          material avulso.
        </p>
      )}
    </CardColapsavel>
  );
}
