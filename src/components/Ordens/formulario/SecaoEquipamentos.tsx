'use client';

import { useMemo, useState } from 'react';
import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Button } from '@/src/components/Ui/button';
import { Skeleton } from '@/src/components/Ui/skeleton';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/src/components/Ui/empty';
import { Field, FieldLabel } from '@/src/components/Ui/field';
import {
  ComboboxMultiple,
  type ComboboxOption,
} from '@/src/components/Ui/combobox';
import type { Equipamento } from '@/src/types/equipamento';
import { EquipamentoModalCadastro } from '../EquipamentoModalCadastro';
import { Cpu, Plus } from 'lucide-react';

interface SecaoEquipamentosProps {
  clienteId: number;
  equipamentos: Equipamento[];
  equipamentoIdsSelecionados: number[];
  loadingEquipamentos: boolean;
  onChangeEquipamentos: (ids: number[]) => void;
  onAdicionarEquipamento: (equipamento: Equipamento) => void;
}

export function SecaoEquipamentos({
  clienteId,
  equipamentos,
  equipamentoIdsSelecionados,
  loadingEquipamentos,
  onChangeEquipamentos,
  onAdicionarEquipamento,
}: SecaoEquipamentosProps) {
  const [modalNovoEquipamentoAberto, setModalNovoEquipamentoAberto] =
    useState(false);

  const equipamentosOptions: ComboboxOption[] = useMemo(
    () =>
      equipamentos.map((eq) => ({
        value: String(eq.id),
        label: `${eq.marca} (${eq.btus})`,
        description: eq.local_instalacao,
        meta: eq.andar?.descricao || undefined,
      })),
    [equipamentos],
  );

  const selectedValues = useMemo(
    () => equipamentoIdsSelecionados.map(String),
    [equipamentoIdsSelecionados],
  );

  return (
    <CardColapsavel
      titulo={
        <span className="flex items-center gap-2">
          <span>2. Equipamentos Vinculados</span>
          <span className="text-muted-foreground hidden text-xs font-normal sm:inline">
            ({equipamentoIdsSelecionados.length} selecionado(s))
          </span>
        </span>
      }
      icone={<Cpu className="size-4 text-primary" />}
      resumo={`${equipamentoIdsSelecionados.length} selecionado(s)`}
      defaultOpenMobile={false}
      headerAction={
        clienteId > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setModalNovoEquipamentoAberto(true)}
            className="h-7 gap-1 border-dashed text-xs"
          >
            <Plus className="size-3.5" /> Novo
            <span className="hidden sm:inline">Equipamento</span>
          </Button>
        ) : undefined
      }
      className="bg-card/40 border-border/70"
      contentClassName="flex flex-col gap-3"
    >
      {!clienteId ? (
        <p className="text-muted-foreground py-2 text-xs italic">
          Selecione um cliente acima para visualizar e vincular equipamentos.
        </p>
      ) : loadingEquipamentos ? (
        <Skeleton className="h-10 w-full" />
      ) : equipamentos.length === 0 ? (
        <Empty className="gap-3 border py-5 md:p-6">
          <EmptyHeader>
            <EmptyTitle className="text-sm">
              Nenhum equipamento cadastrado
            </EmptyTitle>
            <EmptyDescription className="text-xs">
              Este cliente ainda não possui aparelhos vinculados.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalNovoEquipamentoAberto(true)}
              className="gap-1.5"
            >
              <Plus className="size-3.5" />
              Cadastrar primeiro equipamento
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <Field>
          <FieldLabel htmlFor="os-equipamentos" className="sr-only">
            Equipamentos vinculados
          </FieldLabel>
          <ComboboxMultiple
            id="os-equipamentos"
            options={equipamentosOptions}
            value={selectedValues}
            onValueChange={(vals) => onChangeEquipamentos(vals.map(Number))}
            placeholder="Selecione um ou mais equipamentos..."
            searchPlaceholder="Buscar por marca, BTUs, local ou andar..."
            emptyMessage="Nenhum equipamento encontrado."
          />
        </Field>
      )}

      {clienteId > 0 && (
        <EquipamentoModalCadastro
          aberto={modalNovoEquipamentoAberto}
          onOpenChange={setModalNovoEquipamentoAberto}
          clienteId={clienteId}
          onSucesso={onAdicionarEquipamento}
        />
      )}
    </CardColapsavel>
  );
}
