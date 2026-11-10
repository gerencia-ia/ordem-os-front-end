'use client';

import { useCategorias } from '@/src/hooks/useCategorias';
import { Card, CardContent, CardHeader } from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { CategoriaFiltros } from './CategoriaFiltros';
import { CategoriaTabela } from './CategoriaTabela';
import { CategoriaModalCadastro } from './CategoriaModalCadastro';
import { CategoriaModalEditar } from './CategoriaModalEditar';
import { CategoriaModalExcluir } from './CategoriaModalExcluir';
import { Tag, Plus } from 'lucide-react';

export function CategoriaLista() {
  const {
    categorias,
    totalCategorias,
    loading,
    busca,
    setBusca,
    recarregar,
    modalCadastroAberta,
    modalEditarAberta,
    modalExcluirAberta,
    categoriaSelecionada,
    excluindo,
    abrirModalCadastro,
    fecharModalCadastro,
    abrirModalEditar,
    fecharModalEditar,
    abrirModalExcluir,
    fecharModalExcluir,
    confirmarExcluir,
  } = useCategorias();

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Categorias de Serviços
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie as categorias utilizadas para classificar e organizar o
            catálogo de serviços.
          </p>
        </div>

        <Button onClick={abrirModalCadastro} className="gap-1.5 shadow-sm">
          <Plus className="size-4" /> Nova Categoria
        </Button>
      </div>

      {/* Card Principal com Filtros e Tabela */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
          <CategoriaFiltros
            busca={busca}
            onBuscaChange={setBusca}
            onNovaCategoria={abrirModalCadastro}
            totalCategorias={totalCategorias}
          />
        </CardHeader>
        <CardContent>
          <CategoriaTabela
            categorias={categorias}
            loading={loading}
            onEditar={abrirModalEditar}
            onExcluir={abrirModalExcluir}
          />
        </CardContent>
      </Card>

      {/* Modal de Cadastro */}
      <CategoriaModalCadastro
        aberto={modalCadastroAberta}
        onOpenChange={fecharModalCadastro}
        onSucesso={recarregar}
      />

      {/* Modal de Edição */}
      <CategoriaModalEditar
        aberto={modalEditarAberta}
        onOpenChange={fecharModalEditar}
        categoria={categoriaSelecionada}
        onSucesso={recarregar}
      />

      {/* Modal de Exclusão */}
      <CategoriaModalExcluir
        aberto={modalExcluirAberta}
        onOpenChange={fecharModalExcluir}
        categoria={categoriaSelecionada}
        onConfirmar={confirmarExcluir}
        excluindo={excluindo}
      />
    </div>
  );
}
