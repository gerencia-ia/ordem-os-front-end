'use client';

import { useOrdemDetalhe } from '@/src/hooks/useOrdemDetalhe';
import { usePermissions } from '@/src/hooks/usePermissions';
import { Button } from '@/src/components/Ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

import { DetalheCabecalho } from './detalhes/DetalheCabecalho';
import { DetalheInfoGeral } from './detalhes/DetalheInfoGeral';
import { DetalheServicos } from './detalhes/DetalheServicos';
import { DetalheMateriais } from './detalhes/DetalheMateriais';
import { DetalheEquipamentos } from './detalhes/DetalheEquipamentos';
import { DetalheCliente } from './detalhes/DetalheCliente';
import { DetalheTecnicos } from './detalhes/DetalheTecnicos';
import { DetalheHistoricoAtividades } from './detalhes/DetalheHistoricoAtividades';

import { OrdemModalLaudo } from './detalhes/OrdemModalLaudo';
import { OrdemModalHistoricoLaudos } from './detalhes/OrdemModalHistoricoLaudos';
import { OrdemModalAdicionarServico } from './detalhes/OrdemModalAdicionarServico';
import { OrdemModalAdicionarMaterial } from './detalhes/OrdemModalAdicionarMaterial';
import { OrdemModalAdicionarTecnico } from './detalhes/OrdemModalAdicionarTecnico';
import { OrdemModalFinalizar } from './detalhes/OrdemModalFinalizar';

interface OrdemDetalheProps {
  ordemId: string | number;
}

export function OrdemDetalhe({ ordemId }: OrdemDetalheProps) {
  const { perfil, pode } = usePermissions();

  const {
    ordem,
    loading,
    error,
    acaoLoading,
    recarregar,
    statusList,
    atualizarStatus,
    iniciarAtendimento,
    // Finalização
    modalFinalizarAberta,
    valorFinal,
    setValorFinal,
    observacaoFinal,
    setObservacaoFinal,
    finalizandoSalvo,
    abrirModalFinalizar,
    fecharModalFinalizar,
    salvarFinalizacao,
    // Laudos
    modalLaudoAberta,
    equipamentoSelecionado,
    textoLaudo,
    setTextoLaudo,
    laudoSaving,
    abrirModalLaudo,
    fecharModalLaudo,
    salvarLaudo,
    // Histórico de Laudos
    modalHistoricoAberta,
    laudosHistorico,
    historicoLoading,
    abrirModalHistorico,
    fecharModalHistorico,
    // Serviços
    servicosDisponiveis,
    servicosLoading,
    modalServicoAberta,
    servicoIdInput,
    setServicoIdInput,
    quantidadeInput,
    setQuantidadeInput,
    servicoSaving,
    remocaoServicoId,
    abrirModalAdicionarServico,
    fecharModalAdicionarServico,
    salvarServico,
    removerServico,
    materiaisDisponiveis,
    materiaisLoading,
    modalMaterialAberta,
    materialIdInput,
    materialNomeInput,
    materialValorInput,
    materialSaving,
    remocaoMaterialId,
    abrirModalAdicionarMaterial,
    fecharModalAdicionarMaterial,
    selecionarMaterial,
    setMaterialNomeInput,
    setMaterialValorInput,
    salvarMaterial,
    removerMaterial,
    // Técnicos
    usuariosDisponiveis,
    usuariosLoading,
    modalTecnicoAberta,
    tecnicoIdInput,
    setTecnicoIdInput,
    tecnicoSaving,
    abrirModalTecnico,
    fecharModalTecnico,
    salvarTecnico,
    removerTecnico,
    // Contato
    contatarClienteWhatsApp,
  } = useOrdemDetalhe(ordemId);

  // Capacidades RBAC
  const podeVerMetricasFinanceiras = perfil
    ? pode.verMetricasFinanceiras(perfil)
    : false;
  const podeAlterarServicos = perfil
    ? pode.alterarPrecosEServicos(perfil)
    : false;
  const podeAtribuirTecnicos = perfil ? pode.atribuirTecnicos(perfil) : false;
  const podePreencherLaudo = perfil ? pode.preencherLaudo(perfil) : false;
  const podeAlterarStatus = perfil
    ? pode.alterarStatusOperacional(perfil)
    : false;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Carregando dados da ordem de serviço...
        </p>
      </div>
    );
  }

  if (error || !ordem) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center flex flex-col items-center gap-4">
        <AlertCircle className="size-12 text-destructive" />
        <h2 className="text-xl font-semibold">Ordem não encontrada</h2>
        <p className="text-sm text-muted-foreground">
          {error ||
            'Não foi possível carregar os detalhes desta ordem de serviço.'}
        </p>
        <Button
          onClick={() => void recarregar()}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="size-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  const statusIdAtual = Number(ordem.status?.id || ordem.status_id || 1);

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Cabeçalho de Navegação e Ações Principais */}
      <DetalheCabecalho
        ordem={ordem}
        statusList={statusList}
        onStatusChange={atualizarStatus}
        onIniciarAtendimento={iniciarAtendimento}
        onFinalizarAtendimento={abrirModalFinalizar}
        acaoLoading={acaoLoading}
        podeAlterarStatus={podeAlterarStatus}
      />

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal: Informações Gerais, Serviços e Equipamentos */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <DetalheInfoGeral
            ordem={ordem}
            podeVerMetricasFinanceiras={podeVerMetricasFinanceiras}
          />

          <DetalheServicos
            servicos={ordem.servicos}
            statusId={statusIdAtual}
            podeAlterarServicos={podeAlterarServicos}
            podeVerMetricasFinanceiras={podeVerMetricasFinanceiras}
            onAdicionarServico={abrirModalAdicionarServico}
            onRemoverServico={removerServico}
            removendoId={remocaoServicoId}
          />

          <DetalheMateriais
            materiais={ordem.materiais}
            statusId={statusIdAtual}
            podeAlterarMateriais={podeAlterarServicos}
            podeVerMetricasFinanceiras={podeVerMetricasFinanceiras}
            onAdicionar={abrirModalAdicionarMaterial}
            onRemover={removerMaterial}
            removendoId={remocaoMaterialId}
          />

          <DetalheEquipamentos
            equipamentos={ordem.equipamentos}
            onAbrirLaudo={abrirModalLaudo}
            onAbrirHistorico={abrirModalHistorico}
            podePreencherLaudo={podePreencherLaudo}
          />
        </div>

        {/* Coluna Lateral: Cliente, Técnico e Atividades Recentes */}
        <div className="flex flex-col gap-6">
          <DetalheCliente
            cliente={ordem.cliente}
            endereco={ordem.endereco}
            onContatarWhatsApp={contatarClienteWhatsApp}
          />

          <DetalheTecnicos
            tecnicos={ordem.tecnicos}
            tecnicoResponsavel={ordem.tecnico_responsavel}
            podeAtribuirTecnicos={podeAtribuirTecnicos}
            onAtribuirTecnico={abrirModalTecnico}
            onRemoverTecnico={removerTecnico}
            salvando={tecnicoSaving}
          />

          <DetalheHistoricoAtividades ordem={ordem} />
        </div>
      </div>

      {/* Modais de Ação */}
      <OrdemModalLaudo
        open={modalLaudoAberta}
        onOpenChange={(aberta) => {
          if (!aberta) fecharModalLaudo();
        }}
        equipamento={equipamentoSelecionado}
        textoLaudo={textoLaudo}
        onTextoLaudoChange={setTextoLaudo}
        onSalvar={salvarLaudo}
        salvando={laudoSaving}
      />

      <OrdemModalHistoricoLaudos
        open={modalHistoricoAberta}
        onOpenChange={(aberta) => {
          if (!aberta) fecharModalHistorico();
        }}
        equipamento={equipamentoSelecionado}
        laudos={laudosHistorico}
        loading={historicoLoading}
      />

      <OrdemModalAdicionarServico
        open={modalServicoAberta}
        onOpenChange={(aberta) => {
          if (!aberta) fecharModalAdicionarServico();
        }}
        servicos={servicosDisponiveis}
        loadingServicos={servicosLoading}
        servicoId={servicoIdInput}
        onServicoIdChange={setServicoIdInput}
        quantidade={quantidadeInput}
        onQuantidadeChange={setQuantidadeInput}
        onSalvar={salvarServico}
        salvando={servicoSaving}
        podeVerMetricasFinanceiras={podeVerMetricasFinanceiras}
      />

      <OrdemModalAdicionarMaterial
        open={modalMaterialAberta}
        onOpenChange={(aberta) => {
          if (!aberta) fecharModalAdicionarMaterial();
        }}
        materiais={materiaisDisponiveis}
        loading={materiaisLoading}
        materialId={materialIdInput}
        nome={materialNomeInput}
        valor={materialValorInput}
        onMaterialIdChange={selecionarMaterial}
        onNomeChange={setMaterialNomeInput}
        onValorChange={setMaterialValorInput}
        onSalvar={salvarMaterial}
        salvando={materialSaving}
      />

      <OrdemModalAdicionarTecnico
        open={modalTecnicoAberta}
        onOpenChange={(aberta) => {
          if (!aberta) fecharModalTecnico();
        }}
        tecnicos={usuariosDisponiveis}
        loadingTecnicos={usuariosLoading}
        tecnicoId={tecnicoIdInput}
        onTecnicoIdChange={setTecnicoIdInput}
        onSalvar={salvarTecnico}
        salvando={tecnicoSaving}
      />

      <OrdemModalFinalizar
        open={modalFinalizarAberta}
        onOpenChange={(aberta) => {
          if (!aberta) fecharModalFinalizar();
        }}
        valorFinal={valorFinal}
        onValorFinalChange={setValorFinal}
        observacaoFinal={observacaoFinal}
        onObservacaoFinalChange={setObservacaoFinal}
        onSalvar={salvarFinalizacao}
        salvando={finalizandoSalvo}
        podeVerMetricasFinanceiras={podeVerMetricasFinanceiras}
      />
    </div>
  );
}
