'use client';

import { useServicos } from '@/src/hooks/useServicos';
import { ServicoFiltros } from './ServicoFiltros';
import { ServicoTabela } from './ServicoTabela';
import { ServicoModalCadastro } from './ServicoModalCadastro';
import { ServicoModalEditar } from './ServicoModalEditar';
import { ServicoModalExcluir } from './ServicoModalExcluir';
import { Wrench } from 'lucide-react';

export function ServicoLista() {
  const {
    servicos,
    totalServicos,
    categorias,
    loading,
    busca,
    setBusca,
    filtroCategoria,
    setFiltroCategoria,
    limparFiltros,
    recarregar,
    modalCadastroAberta,
    modalEditarAberta,
    modalExcluirAberta,
    servicoSelecionado,
    excluindo,
    abrirModalCadastro,
    fecharModalCadastro,
    abrirModalEditar,
    fecharModalEditar,
    abrirModalExcluir,
    fecharModalExcluir,
    confirmarExcluir,
  } = useServicos();

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            Catálogo de Serviços
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie os serviços, valores unitários, tempos estimados e suas
            respectivas categorias.
          </p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <ServicoFiltros
        busca={busca}
        onBuscaChange={setBusca}
        filtroCategoria={filtroCategoria}
        onCategoriaChange={setFiltroCategoria}
        categorias={categorias}
        onNovoServico={abrirModalCadastro}
        onLimparFiltros={limparFiltros}
        totalServicos={totalServicos}
      />

      {/* Tabela de Serviços */}
      <ServicoTabela
        servicos={servicos}
        loading={loading}
        onEditar={abrirModalEditar}
        onExcluir={abrirModalExcluir}
      />

      {/* Modal de Cadastro */}
      <ServicoModalCadastro
        aberto={modalCadastroAberta}
        onOpenChange={fecharModalCadastro}
        categorias={categorias}
        onSucesso={recarregar}
      />

      {/* Modal de Edição */}
      <ServicoModalEditar
        aberto={modalEditarAberta}
        onOpenChange={fecharModalEditar}
        servico={servicoSelecionado}
        categorias={categorias}
        onSucesso={recarregar}
      />

      {/* Modal de Exclusão */}
      <ServicoModalExcluir
        aberto={modalExcluirAberta}
        onOpenChange={fecharModalExcluir}
        servico={servicoSelecionado}
        onConfirmar={confirmarExcluir}
        excluindo={excluindo}
      />
    </div>
  );
}
