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
import { createEquipamento } from '@/src/services/equipamentos.service';
import type { Andar } from '@/src/types/andar';
import type { NovoEquipamentoData } from '@/src/types/cliente';

export type { NovoEquipamentoData };

interface EquipamentoModalClienteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  clienteId?: number;
  onSalvarEquipamento?: (equip: NovoEquipamentoData) => void;
  onSucesso?: () => void;
}

export function EquipamentoModalCliente({
  open,
  setOpen,
  clienteId,
  onSalvarEquipamento,
  onSucesso,
}: EquipamentoModalClienteProps) {
  const [savingEquip, setSavingEquip] = useState(false);
  const [andares, setAndares] = useState<Andar[]>([]);
  const [carregandoAndares, setCarregandoAndares] = useState(false);
  const [novoEquipamento, setNovoEquipamento] = useState<NovoEquipamentoData>({
    marca: '',
    btus: '',
    local_instalacao: '',
    observacao: '',
    cliente_id: clienteId,
    andar_id: undefined,
  });

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

  const resetNovoEquipamento = () =>
    setNovoEquipamento({
      marca: '',
      btus: '',
      local_instalacao: '',
      observacao: '',
      cliente_id: clienteId,
      andar_id: undefined,
    });

  const handleAddEquipamento = async () => {
    if (!novoEquipamento.andar_id) {
      toast.error('Selecione o andar do equipamento.');
      return;
    }

    if (onSalvarEquipamento) {
      onSalvarEquipamento({ ...novoEquipamento });
      resetNovoEquipamento();
      setOpen(false);
      return;
    }

    if (!novoEquipamento.cliente_id) return;

    try {
      setSavingEquip(true);
      await createEquipamento({
        marca: novoEquipamento.marca,
        btus: novoEquipamento.btus,
        local_instalacao: novoEquipamento.local_instalacao,
        observacao: novoEquipamento.observacao,
        cliente_id: novoEquipamento.cliente_id,
        andar_id: Number(novoEquipamento.andar_id),
      });
      toast.success('Equipamento cadastrado com sucesso!');
      resetNovoEquipamento();
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
    <ModalFormulario open={open} onOpenChange={setOpen} tamanho="md">
      <ModalFormularioHeader
        title="Cadastrar Equipamento"
        description="Preencha os dados do equipamento para o cliente."
      />

      <ModalFormularioBody>
        <FieldGroup className="gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="equip-marca">Marca</FieldLabel>
              <Input
                id="equip-marca"
                value={novoEquipamento.marca}
                onChange={(e) =>
                  setNovoEquipamento((s) => ({ ...s, marca: e.target.value }))
                }
                placeholder="Ex: LG, Daikin, Midea"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="equip-btus">BTUs</FieldLabel>
              <Input
                id="equip-btus"
                value={novoEquipamento.btus}
                onChange={(e) =>
                  setNovoEquipamento((s) => ({ ...s, btus: e.target.value }))
                }
                placeholder="Ex: 9000, 12000"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="equip-local">Local de Instalação</FieldLabel>
              <Input
                id="equip-local"
                value={novoEquipamento.local_instalacao}
                onChange={(e) =>
                  setNovoEquipamento((s) => ({
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
                value={
                  novoEquipamento.andar_id
                    ? String(novoEquipamento.andar_id)
                    : ''
                }
                onValueChange={(val) =>
                  setNovoEquipamento((s) => ({
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
              value={novoEquipamento.observacao}
              onChange={(e) =>
                setNovoEquipamento((s) => ({
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
        <Button
          type="button"
          onClick={handleAddEquipamento}
          disabled={savingEquip}
        >
          {savingEquip && <Spinner data-icon="inline-start" />}
          {savingEquip ? 'Salvando...' : 'Cadastrar Equipamento'}
        </Button>
      </ModalFormularioFooter>
    </ModalFormulario>
  );
}
