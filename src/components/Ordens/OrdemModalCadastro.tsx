'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/Ui/dialog';
import { Button } from '@/src/components/Ui/button';
import { useOrdemForm } from '@/src/hooks/useOrdemForm';
import { SecaoClienteEndereco } from './formulario/SecaoClienteEndereco';
import { SecaoEquipamentos } from './formulario/SecaoEquipamentos';
import { SecaoServicos } from './formulario/SecaoServicos';
import { SecaoAgendamentoEquipe } from './formulario/SecaoAgendamentoEquipe';
import { SecaoDescricao } from './formulario/SecaoDescricao';
import { Loader2, PlusCircle } from 'lucide-react';

interface OrdemModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}

export function OrdemModalCadastro({
  aberto,
  onOpenChange,
  onSucesso,
}: OrdemModalCadastroProps) {
  const {
    form,
    salvando,
    loadingDados,
    loadingEquipamentos,
    clientes,
    clienteAtual,
    tecnicos,
    servicos,
    statusList,
    prioridadesList,
    equipamentos,
    servicoIdsSelecionados,
    equipamentoIdsSelecionados,
    tecnicoIdsSelecionados,
    valorTotalServicos,
    onClienteChange,
    toggleServico,
    toggleEquipamento,
    toggleTecnico,
    adicionarNovoEquipamento,
    onSubmit,
  } = useOrdemForm({
    onSuccess: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  const clienteId = Number(form.watch('cliente_id')) || 0;

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <PlusCircle className="size-5 text-primary" />
            <DialogTitle>Nova Ordem de Serviço</DialogTitle>
          </div>
          <DialogDescription>
            Preencha as informações para registrar e agendar a ordem de serviço.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          {/* Seção 1: Cliente e Endereço */}
          <SecaoClienteEndereco
            form={form}
            clientes={clientes}
            clienteAtual={clienteAtual}
            loadingClientes={loadingDados}
            onClienteChange={onClienteChange}
          />

          {/* Seção 2: Equipamentos Vinculados */}
          <SecaoEquipamentos
            clienteId={clienteId}
            equipamentos={equipamentos}
            equipamentoIdsSelecionados={equipamentoIdsSelecionados}
            loadingEquipamentos={loadingEquipamentos}
            onToggleEquipamento={toggleEquipamento}
            onAdicionarEquipamento={adicionarNovoEquipamento}
          />

          {/* Seção 3: Serviços e Valores */}
          <SecaoServicos
            servicos={servicos}
            servicoIdsSelecionados={servicoIdsSelecionados}
            valorTotal={valorTotalServicos}
            loadingServicos={loadingDados}
            onToggleServico={toggleServico}
          />

          {/* Seção 4: Agendamento e Técnicos */}
          <SecaoAgendamentoEquipe
            form={form}
            statusList={statusList}
            prioridadesList={prioridadesList}
            tecnicos={tecnicos}
            tecnicoIdsSelecionados={tecnicoIdsSelecionados}
            loadingDados={loadingDados}
            onToggleTecnico={toggleTecnico}
          />

          {/* Seção 5: Descrição e Observações */}
          <SecaoDescricao form={form} />

          <DialogFooter className="pt-4 border-t sticky bottom-0 bg-background/95 backdrop-blur-sm -mx-6 -mb-6 p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={salvando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando || loadingDados}>
              {salvando && <Loader2 className="mr-2 size-4 animate-spin" />}
              Criar Ordem de Serviço
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
