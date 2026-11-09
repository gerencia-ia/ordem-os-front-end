'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/components/Ui/dialog';
import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { Label } from '@/src/components/Ui/label';
import { toast } from 'sonner';
import { createEquipamento } from '@/src/services/equipamentos.service';
import type { NovoEquipamentoData } from '@/src/types/cliente';

export type { NovoEquipamentoData };

interface EquipamentoModalClienteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  clienteId?: number;
  onSalvarEquipamento?: (equip: NovoEquipamentoData) => void;
}

export function EquipamentoModalCliente({
  open,
  setOpen,
  clienteId,
  onSalvarEquipamento,
}: EquipamentoModalClienteProps) {
  const [savingEquip, setSavingEquip] = useState(false);
  const [novoEquipamento, setNovoEquipamento] = useState<NovoEquipamentoData>({
    marca: '',
    btus: '',
    local_instalacao: '',
    observacao: '',
    cliente_id: clienteId,
  });

  const resetNovoEquipamento = () =>
    setNovoEquipamento({
      marca: '',
      btus: '',
      local_instalacao: '',
      observacao: '',
      cliente_id: clienteId,
    });

  const handleAddEquipamento = async () => {
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
      });
      toast.success('Equipamento cadastrado com sucesso!');
      resetNovoEquipamento();
      setOpen(false);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao cadastrar equipamento';
      toast.error(msg);
    } finally {
      setSavingEquip(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Cadastrar Equipamento</DialogTitle>
          <DialogDescription>
            Preencha os dados do equipamento para o cliente
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="equip-marca" className="text-xs">
                Marca
              </Label>
              <Input
                id="equip-marca"
                value={novoEquipamento.marca}
                onChange={(e) =>
                  setNovoEquipamento((s) => ({ ...s, marca: e.target.value }))
                }
                placeholder="Ex: LG, Daikin, Midea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="equip-btus" className="text-xs">
                BTUs
              </Label>
              <Input
                id="equip-btus"
                value={novoEquipamento.btus}
                onChange={(e) =>
                  setNovoEquipamento((s) => ({ ...s, btus: e.target.value }))
                }
                placeholder="Ex: 9000, 12000"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="equip-local" className="text-xs">
                Local de Instalação
              </Label>
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
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="equip-obs" className="text-xs">
              Observação
            </Label>
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
          </div>
          <Button
            className="w-full mt-2"
            type="button"
            onClick={handleAddEquipamento}
            disabled={savingEquip}
          >
            {savingEquip ? 'Salvando...' : 'Cadastrar Equipamento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
