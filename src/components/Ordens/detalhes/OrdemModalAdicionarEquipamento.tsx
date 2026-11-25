'use client';

import { useMemo, useState } from 'react';
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
import { EquipamentoModalCadastro } from '@/src/components/Ordens/EquipamentoModalCadastro';
import type { Equipamento } from '@/src/types/equipamento';
import type { OsEquipamentoItem } from '@/src/types/ordem';
import { Plus } from 'lucide-react';

interface OrdemModalAdicionarEquipamentoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteId?: number;
  equipamentosCliente: Equipamento[];
  equipamentosVinculados: OsEquipamentoItem[];
  loading: boolean;
  equipamentoId: string;
  onEquipamentoIdChange: (val: string) => void;
  onSalvar: (equipamentoIdOverride?: number | string) => void | Promise<void>;
  onNovoEquipamentoCadastrado: (equipamento: Equipamento) => void | Promise<void>;
  salvando: boolean;
}

export function OrdemModalAdicionarEquipamento({
  open,
  onOpenChange,
  clienteId,
  equipamentosCliente,
  equipamentosVinculados,
  loading,
  equipamentoId,
  onEquipamentoIdChange,
  onSalvar,
  onNovoEquipamentoCadastrado,
  salvando,
}: OrdemModalAdicionarEquipamentoProps) {
  const [modalCadastroAberta, setModalCadastroAberta] = useState(false);

  const idsVinculados = useMemo(
    () =>
      new Set(
        equipamentosVinculados.map((eq) => Number(eq.equipamento_id || eq.id)),
      ),
    [equipamentosVinculados],
  );

  const opcoesEquipamentos: ComboboxOption[] = useMemo(
    () =>
      equipamentosCliente.map((eq) => {
        const jaVinculado = idsVinculados.has(Number(eq.id));
        return {
          value: String(eq.id),
          label: `${eq.marca} (${eq.btus})`,
          description: eq.local_instalacao,
          meta: eq.andar?.descricao || undefined,
          disabled: jaVinculado,
          disabledReason: jaVinculado ? 'Já vinculado' : undefined,
        };
      }),
    [equipamentosCliente, idsVinculados],
  );

  return (
    <>
      <ModalFormulario open={open} onOpenChange={onOpenChange} tamanho="sm">
        <ModalFormularioHeader
          title="Adicionar Equipamento à Ordem"
          description="Selecione um equipamento do cliente ou cadastre um novo aparelho para vincular a esta OS."
        />

        <ModalFormularioBody>
          <FieldGroup className="gap-4">
            <Field>
              <div className="flex items-center justify-between gap-2">
                <FieldLabel htmlFor="select-equipamento-os">
                  Equipamento do Cliente
                </FieldLabel>
                {clienteId ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setModalCadastroAberta(true)}
                    disabled={salvando}
                    className="h-7 gap-1 border-dashed text-xs"
                  >
                    <Plus className="size-3.5" />
                    Novo Equipamento
                  </Button>
                ) : null}
              </div>

              {loading ? (
                <Skeleton className="h-9 w-full" />
              ) : equipamentosCliente.length > 0 ? (
                <ComboboxSingle
                  id="select-equipamento-os"
                  options={opcoesEquipamentos}
                  value={equipamentoId}
                  onValueChange={onEquipamentoIdChange}
                  placeholder="Selecione um equipamento..."
                  searchPlaceholder="Buscar por marca, BTUs, local ou andar..."
                  emptyMessage="Nenhum equipamento encontrado."
                  disabled={salvando}
                />
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-center flex flex-col items-center gap-2">
                  <p className="text-muted-foreground text-sm">
                    Este cliente ainda não possui equipamentos cadastrados.
                  </p>
                  {clienteId ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setModalCadastroAberta(true)}
                      disabled={salvando}
                      className="gap-1.5"
                    >
                      <Plus className="size-3.5" />
                      Cadastrar novo equipamento
                    </Button>
                  ) : null}
                </div>
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
              !equipamentoId.trim() ||
              salvando ||
              loading ||
              equipamentosCliente.length === 0
            }
          >
            {salvando && <Spinner data-icon="inline-start" />}
            {salvando ? 'Vinculando...' : 'Adicionar Equipamento'}
          </Button>
        </ModalFormularioFooter>
      </ModalFormulario>

      {clienteId ? (
        <EquipamentoModalCadastro
          aberto={modalCadastroAberta}
          onOpenChange={setModalCadastroAberta}
          clienteId={clienteId}
          onSucesso={(novoEquipamento) => {
            void onNovoEquipamentoCadastrado(novoEquipamento);
          }}
        />
      ) : null}
    </>
  );
}
