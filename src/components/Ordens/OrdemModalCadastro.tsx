'use client';

import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Button } from '@/src/components/Ui/button';
import { Spinner } from '@/src/components/Ui/spinner';
import { useOrdemForm } from '@/src/hooks/useOrdemForm';
import { SecaoClienteEndereco } from './formulario/SecaoClienteEndereco';
import { SecaoEquipamentos } from './formulario/SecaoEquipamentos';
import { SecaoServicos } from './formulario/SecaoServicos';
import { SecaoMateriais } from './formulario/SecaoMateriais';
import { SecaoAgendamentoEquipe } from './formulario/SecaoAgendamentoEquipe';
import { SecaoDescricao } from './formulario/SecaoDescricao';
import { PlusCircle } from 'lucide-react';

interface OrdemModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);

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
    osServicosSelecionados,
    equipamentoIdsSelecionados,
    tecnicoIdsSelecionados,
    valorTotalServicos,
    valorTotalItens,
    materiais,
    materiaisSelecionados,
    adicionarMaterial,
    removerMaterial,
    onClienteChange,
    setEquipamentosSelecionados,
    setServicosPorEquipamento,
    atualizarQuantidadeServico,
    setTecnicosSelecionados,
    adicionarNovoEquipamento,
    onSubmit,
  } = useOrdemForm({
    onSuccess: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  const clienteId = Number(form.watch('cliente_id')) || 0;
  const equipamentosSelecionados = equipamentos.filter((eq) =>
    equipamentoIdsSelecionados.includes(Number(eq.id)),
  );

  return (
    <ModalFormulario open={aberto} onOpenChange={onOpenChange} tamanho="xl">
      <ModalFormularioHeader
        icon={<PlusCircle className="size-5" />}
        title="Nova Ordem de Serviço"
        description="Preencha as informações para registrar e agendar a ordem de serviço."
      />

      <form
        onSubmit={onSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <ModalFormularioBody className="flex flex-col gap-4">
          <SecaoClienteEndereco
            form={form}
            clientes={clientes}
            clienteAtual={clienteAtual}
            loadingClientes={loadingDados}
            onClienteChange={onClienteChange}
          />

          <SecaoEquipamentos
            clienteId={clienteId}
            equipamentos={equipamentos}
            equipamentoIdsSelecionados={equipamentoIdsSelecionados}
            loadingEquipamentos={loadingEquipamentos}
            onChangeEquipamentos={setEquipamentosSelecionados}
            onAdicionarEquipamento={adicionarNovoEquipamento}
          />

          <SecaoServicos
            servicos={servicos}
            equipamentosSelecionados={equipamentosSelecionados}
            osServicosSelecionados={osServicosSelecionados}
            valorTotal={valorTotalServicos}
            loadingServicos={loadingDados}
            onChangeServicosEquipamento={setServicosPorEquipamento}
            onAlterarQuantidade={atualizarQuantidadeServico}
          />

          <SecaoMateriais
            materiais={materiais}
            itens={materiaisSelecionados}
            loading={loadingDados}
            onAdicionar={adicionarMaterial}
            onRemover={removerMaterial}
          />

          <SecaoAgendamentoEquipe
            form={form}
            statusList={statusList}
            prioridadesList={prioridadesList}
            tecnicos={tecnicos}
            tecnicoIdsSelecionados={tecnicoIdsSelecionados}
            loadingDados={loadingDados}
            onChangeTecnicos={setTecnicosSelecionados}
          />

          <SecaoDescricao form={form} />
        </ModalFormularioBody>

        <ModalFormularioFooter
          leftSlot={
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground text-xs font-medium">
                Total Estimado:
              </span>
              <span className="text-success text-base font-bold tabular-nums">
                {formatarMoeda(valorTotalItens)}
              </span>
            </div>
          }
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={salvando}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando || loadingDados}>
            {salvando && <Spinner data-icon="inline-start" />}
            Criar Ordem de Serviço
          </Button>
        </ModalFormularioFooter>
      </form>
    </ModalFormulario>
  );
}
