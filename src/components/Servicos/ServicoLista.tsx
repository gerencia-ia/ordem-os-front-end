'use client';

import { useServicos } from '@/src/hooks/useServicos';
import { Card, CardContent, CardHeader } from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { ServicoFiltros } from './ServicoFiltros';
import { ServicoTabela } from './ServicoTabela';
import { ServicoModalCadastro } from './ServicoModalCadastro';
import { ServicoModalEditar } from './ServicoModalEditar';
import { ServicoModalExcluir } from './ServicoModalExcluir';
import { Wrench, Plus } from 'lucide-react';

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
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Catálogo de Serviços
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie os serviços, valores unitários, tempos estimados e suas
            respectivas categorias.
          </p>
        </div>

        <Button
          onClick={abrirModalCadastro}
          className="gap-1.5 shadow-sm"
        >
          <Plus className="size-4" /> Novo Serviço
        </Button>
      </div>

      {/* Card Principal com Filtros e Tabela */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
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
        </CardHeader>
        <CardContent>
          <ServicoTabela
            servicos={servicos}
            loading={loading}
            onEditar={abrirModalEditar}
            onExcluir={abrirModalExcluir}
          />
        </CardContent>
      </Card>

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
