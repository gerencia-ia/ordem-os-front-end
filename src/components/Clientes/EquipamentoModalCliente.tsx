'use client';

import { useEffect, useState } from 'react';
import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { Field, FieldGroup, FieldLabel } from '@/src/components/Ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { Spinner } from '@/src/components/Ui/spinner';
import { toast } from 'sonner';
import { getAndares } from '@/src/services/andares.service';
import {
  createEquipamento,
  updateEquipamento,
} from '@/src/services/equipamentos.service';
import type { Andar } from '@/src/types/andar';
import type { NovoEquipamentoData } from '@/src/types/cliente';

export type { NovoEquipamentoData };

export type EquipamentoEdicaoInput = NovoEquipamentoData & {
  id?: number | string;
};

interface EquipamentoModalClienteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  clienteId?: number;
  equipamentoParaEdicao?: EquipamentoEdicaoInput | null;
  onSalvarEquipamento?: (equip: NovoEquipamentoData) => void;
  onSucesso?: () => void;
}

function EquipamentoModalClienteInner({
  andares,
  carregandoAndares,
  clienteId,
  equipamentoParaEdicao,
  setOpen,
  onSalvarEquipamento,
  onSucesso,
}: {
  andares: Andar[];
  carregandoAndares: boolean;
  clienteId?: number;
  equipamentoParaEdicao?: EquipamentoEdicaoInput | null;
  setOpen: (open: boolean) => void;
  onSalvarEquipamento?: (equip: NovoEquipamentoData) => void;
  onSucesso?: () => void;
}) {
  const isEdicao = Boolean(equipamentoParaEdicao);
  const [savingEquip, setSavingEquip] = useState(false);
  const [formEquip, setFormEquip] = useState<NovoEquipamentoData>(() =>
    equipamentoParaEdicao
      ? {
          marca: equipamentoParaEdicao.marca || '',
          btus: equipamentoParaEdicao.btus || '',
          local_instalacao: equipamentoParaEdicao.local_instalacao || '',
          observacao: equipamentoParaEdicao.observacao || '',
          cliente_id: equipamentoParaEdicao.cliente_id ?? clienteId,
          andar_id: equipamentoParaEdicao.andar_id,
        }
      : {
          marca: '',
          btus: '',
          local_instalacao: '',
          observacao: '',
          cliente_id: clienteId,
          andar_id: undefined,
        },
  );

  const handleSalvar = async () => {
    if (!formEquip.andar_id) {
      toast.error('Selecione o andar do equipamento.');
      return;
    }

    if (onSalvarEquipamento) {
      onSalvarEquipamento({ ...formEquip });
      setOpen(false);
      return;
    }

    if (isEdicao && equipamentoParaEdicao?.id) {
      try {
        setSavingEquip(true);
        await updateEquipamento(equipamentoParaEdicao.id, {
          marca: formEquip.marca,
          btus: formEquip.btus,
          local_instalacao: formEquip.local_instalacao,
          observacao: formEquip.observacao,
          andar_id: Number(formEquip.andar_id),
        });
        toast.success('Equipamento atualizado com sucesso!');
        setOpen(false);
        onSucesso?.();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Erro ao atualizar equipamento';
        toast.error(msg);
      } finally {
        setSavingEquip(false);
      }
      return;
    }

    if (!formEquip.cliente_id) return;

    try {
      setSavingEquip(true);
      await createEquipamento({
        marca: formEquip.marca,
        btus: formEquip.btus,
        local_instalacao: formEquip.local_instalacao,
        observacao: formEquip.observacao,
        cliente_id: formEquip.cliente_id,
        andar_id: Number(formEquip.andar_id),
      });
      toast.success('Equipamento cadastrado com sucesso!');
      setOpen(false);
      onSucesso?.();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao cadastrar equipamento';
      toast.error(msg);
    } finally {
      setSavingEquip(false);
    }
  };

  return (
    <>
      <ModalFormularioBody>
        <FieldGroup className="gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="equip-marca">Marca</FieldLabel>
              <Input
                id="equip-marca"
                value={formEquip.marca}
                onChange={(e) =>
                  setFormEquip((s) => ({ ...s, marca: e.target.value }))
                }
                placeholder="Ex: LG, Daikin, Midea"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="equip-btus">BTUs</FieldLabel>
              <Input
                id="equip-btus"
                value={formEquip.btus}
                onChange={(e) =>
                  setFormEquip((s) => ({ ...s, btus: e.target.value }))
                }
                placeholder="Ex: 9000, 12000"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="equip-local">Local de Instalação</FieldLabel>
              <Input
                id="equip-local"
                value={formEquip.local_instalacao}
                onChange={(e) =>
                  setFormEquip((s) => ({
                    ...s,
                    local_instalacao: e.target.value,
                  }))
                }
                placeholder="Ex: Sala de Reunião 101"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="equip-andar">
                Andar <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={formEquip.andar_id ? String(formEquip.andar_id) : ''}
                onValueChange={(val) =>
                  setFormEquip((s) => ({
                    ...s,
                    andar_id: Number(val),
                  }))
                }
                disabled={savingEquip || carregandoAndares}
              >
                <SelectTrigger id="equip-andar" className="w-full">
                  <SelectValue
                    placeholder={
                      carregandoAndares
                        ? 'Carregando andares...'
                        : 'Selecione o andar'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {andares.map((andar) => (
                      <SelectItem key={andar.id} value={String(andar.id)}>
                        {andar.descricao}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="equip-obs">Observação</FieldLabel>
            <Input
              id="equip-obs"
              value={formEquip.observacao}
              onChange={(e) =>
                setFormEquip((s) => ({
                  ...s,
                  observacao: e.target.value,
                }))
              }
              placeholder="Ex: Condensadora na fachada externa"
            />
          </Field>
        </FieldGroup>
      </ModalFormularioBody>

      <ModalFormularioFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={savingEquip}
        >
          Cancelar
        </Button>
        <Button type="button" onClick={handleSalvar} disabled={savingEquip}>
          {savingEquip && <Spinner data-icon="inline-start" />}
          {savingEquip
            ? 'Salvando...'
            : isEdicao
              ? 'Salvar Alterações'
              : 'Cadastrar Equipamento'}
        </Button>
      </ModalFormularioFooter>
    </>
  );
}

export function EquipamentoModalCliente({
  open,
  setOpen,
  clienteId,
  equipamentoParaEdicao = null,
  onSalvarEquipamento,
  onSucesso,
}: EquipamentoModalClienteProps) {
  const [andares, setAndares] = useState<Andar[]>([]);
  const [carregandoAndares, setCarregandoAndares] = useState(false);

  useEffect(() => {
    if (!open) return;
    let ativo = true;

    async function carregarAndares() {
      try {
        const lista = await getAndares();
        if (ativo) setAndares(lista);
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar andares';
          toast.error(msg);
        }
      } finally {
        if (ativo) setCarregandoAndares(false);
      }
    }

    void carregarAndares();

    return () => {
      ativo = false;
    };
  }, [open]);

  const isEdicao = Boolean(equipamentoParaEdicao);
  const formKey = `${open}-${equipamentoParaEdicao?.id ?? equipamentoParaEdicao?.marca ?? 'novo'}`;

  return (
    <ModalFormulario open={open} onOpenChange={setOpen} tamanho="md">
      <ModalFormularioHeader
        title={isEdicao ? 'Editar Equipamento' : 'Cadastrar Equipamento'}
        description={
          isEdicao
            ? 'Atualize os dados do equipamento vinculado ao cliente.'
            : 'Preencha os dados do equipamento para o cliente.'
        }
      />

      <EquipamentoModalClienteInner
        key={formKey}
        andares={andares}
        carregandoAndares={carregandoAndares}
        clienteId={clienteId}
        equipamentoParaEdicao={equipamentoParaEdicao}
        setOpen={setOpen}
        onSalvarEquipamento={onSalvarEquipamento}
        onSucesso={onSucesso}
      />
    </ModalFormulario>
  );
}
