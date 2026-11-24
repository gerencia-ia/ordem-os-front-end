'use client';

import { useAndares } from '@/src/hooks/useAndares';
import { Card, CardContent, CardHeader } from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { AndarFiltros } from './AndarFiltros';
import { AndarTabela } from './AndarTabela';
import { AndarModalCadastro } from './AndarModalCadastro';
import { AndarModalEditar } from './AndarModalEditar';
import { AndarModalExcluir } from './AndarModalExcluir';
import { Layers, Plus } from 'lucide-react';

export function AndarLista() {
  const {
    andares,
    totalAndares,
    loading,
    busca,
    setBusca,
    recarregar,
    modalCadastroAberta,
    modalEditarAberta,
    modalExcluirAberta,
    andarSelecionado,
    excluindo,
    abrirModalCadastro,
    fecharModalCadastro,
    abrirModalEditar,
    fecharModalEditar,
    abrirModalExcluir,
    fecharModalExcluir,
    confirmarExcluir,
  } = useAndares();

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Andares</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie os andares utilizados para localizar equipamentos e
            precificar serviços.
          </p>
        </div>

        <Button onClick={abrirModalCadastro} className="gap-1.5 shadow-sm">
          <Plus className="size-4" /> Novo Andar
        </Button>
      </div>

      {/* Card Principal com Filtros e Tabela */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
          <AndarFiltros
            busca={busca}
            onBuscaChange={setBusca}
            totalAndares={totalAndares}
          />
        </CardHeader>
        <CardContent>
          <AndarTabela
            andares={andares}
            loading={loading}
            onEditar={abrirModalEditar}
            onExcluir={abrirModalExcluir}
          />
        </CardContent>
      </Card>

      {/* Modal de Cadastro */}
      <AndarModalCadastro
        aberto={modalCadastroAberta}
        onOpenChange={fecharModalCadastro}
        onSucesso={recarregar}
      />

      {/* Modal de Edição */}
      <AndarModalEditar
        aberto={modalEditarAberta}
        onOpenChange={fecharModalEditar}
        andar={andarSelecionado}
        onSucesso={recarregar}
      />

      {/* Modal de Exclusão */}
      <AndarModalExcluir
        aberto={modalExcluirAberta}
        onOpenChange={fecharModalExcluir}
        andar={andarSelecionado}
        onConfirmar={confirmarExcluir}
        excluindo={excluindo}
      />
    </div>
  );
}
