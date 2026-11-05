import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { createEquipamento } from '@/src/lib/api/equipamentos';

export interface NovoEquipamentoData {
  marca: string;
  btus: string;
  local_instalacao: string;
  observacao: string;
  cliente_id?: number;
}

interface CadastrarEquipamentoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  clienteId?: number;
  onSalvarEquipamento?: (equip: NovoEquipamentoData) => void; // Novo: callback para salvar em memória
}

export function CadastrarEquipamento({
  open,
  setOpen,
  clienteId,
  onSalvarEquipamento,
}: CadastrarEquipamentoProps) {
  const [savingEquip, setSavingEquip] = useState(false);
  const [novoEquipamento, setNovoEquipamento] = useState({
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
      // Salva em memória, não envia ao backend
      onSalvarEquipamento({ ...novoEquipamento });
      resetNovoEquipamento();
      setOpen(false);
      return;
    }
    // Fluxo antigo: salvar direto no backend
    if (!novoEquipamento.cliente_id) return;
    try {
      setSavingEquip(true);
      await createEquipamento(novoEquipamento);
      resetNovoEquipamento();
      setOpen(false);
    } catch {
      alert('Erro ao cadastrar equipamento');
    } finally {
      setSavingEquip(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Cadastrar Equipamento</DialogTitle>
          <DialogDescription>
            Preencha os dados do equipamento para o cliente
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Marca</label>
              <Input
                value={novoEquipamento.marca}
                onChange={(e) =>
                  setNovoEquipamento((s) => ({ ...s, marca: e.target.value }))
                }
                placeholder="Ex: LG"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">BTUs</label>
              <Input
                value={novoEquipamento.btus}
                onChange={(e) =>
                  setNovoEquipamento((s) => ({ ...s, btus: e.target.value }))
                }
                placeholder="Ex: 9000"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Local de Instalação</label>
              <Input
                value={novoEquipamento.local_instalacao}
                onChange={(e) =>
                  setNovoEquipamento((s) => ({
                    ...s,
                    local_instalacao: e.target.value,
                  }))
                }
                placeholder="Ex: Sala 101"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Observação</label>
            <Input
              value={novoEquipamento.observacao}
              onChange={(e) =>
                setNovoEquipamento((s) => ({
                  ...s,
                  observacao: e.target.value,
                }))
              }
              placeholder="Observações do equipamento"
            />
          </div>
          <Button
            className="w-full"
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
