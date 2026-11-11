import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createEquipamento } from "@/lib/api/equipamentos"

interface CadastrarEquipamentoProps {
  open: boolean
  setOpen: (open: boolean) => void
  clienteId?: number
  onSalvarEquipamento?: (equip: any) => void // Novo: callback para salvar em memória
}

export function CadastrarEquipamento({ open, setOpen, clienteId, onSalvarEquipamento }: CadastrarEquipamentoProps) {
  const [savingEquip, setSavingEquip] = useState(false)
  const [novoEquipamento, setNovoEquipamento] = useState({
    marca: "",
    btus: "",
    inverter: false,
    local_instalacao: "",
    observacao: "",
    cliente_id: clienteId,
  })

  const resetNovoEquipamento = () => setNovoEquipamento({
    marca: "",
    btus: "",
    inverter: false,
    local_instalacao: "",
    observacao: "",
    cliente_id: clienteId,
  })

  const handleAddEquipamento = async () => {
    if (onSalvarEquipamento) {
      // Salva em memória, não envia ao backend
      onSalvarEquipamento({ ...novoEquipamento })
      resetNovoEquipamento()
      setOpen(false)
      return
    }
    // Fluxo antigo: salvar direto no backend
    if (!novoEquipamento.cliente_id) return
    try {
      setSavingEquip(true)
      await createEquipamento(novoEquipamento)
      resetNovoEquipamento()
      setOpen(false)
    } catch (e) {
      alert("Erro ao cadastrar equipamento")
    } finally {
      setSavingEquip(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Cadastrar Equipamento</DialogTitle>
          <DialogDescription>Preencha os dados do equipamento para o cliente</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Marca</label>
              <Input
                value={novoEquipamento.marca}
                onChange={(e) => setNovoEquipamento((s) => ({ ...s, marca: e.target.value }))}
                placeholder="Ex: LG"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">BTUs</label>
              <Input
                value={novoEquipamento.btus}
                onChange={(e) => setNovoEquipamento((s) => ({ ...s, btus: e.target.value }))}
                placeholder="Ex: 9000"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="equipamento-inverter">Tecnologia Inverter</label>
              <select
                id="equipamento-inverter"
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={novoEquipamento.inverter ? "true" : "false"}
                onChange={(e) => setNovoEquipamento((s) => ({ ...s, inverter: e.target.value === "true" }))}
              >
                <option value="false">Não</option>
                <option value="true">Sim</option>
              </select>
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Local de Instalação</label>
              <Input
                value={novoEquipamento.local_instalacao}
                onChange={(e) => setNovoEquipamento((s) => ({ ...s, local_instalacao: e.target.value }))}
                placeholder="Ex: Sala 101"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Observação</label>
            <Input
              value={novoEquipamento.observacao}
              onChange={(e) => setNovoEquipamento((s) => ({ ...s, observacao: e.target.value }))}
              placeholder="Observações do equipamento"
            />
          </div>
          <Button
            className="w-full"
            type="button"
            onClick={handleAddEquipamento}
            disabled={savingEquip}
          >
            {savingEquip ? "Salvando..." : "Cadastrar Equipamento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
