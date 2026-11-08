'use client';

import { useCategorias } from '@/src/hooks/useCategorias';
import { CategoriaFiltros } from './CategoriaFiltros';
import { CategoriaTabela } from './CategoriaTabela';
import { CategoriaModalCadastro } from './CategoriaModalCadastro';
import { CategoriaModalEditar } from './CategoriaModalEditar';
import { CategoriaModalExcluir } from './CategoriaModalExcluir';
import { Tag } from 'lucide-react';

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
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            Categorias de Serviços
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie as categorias utilizadas para classificar e organizar o
            catálogo de serviços.
          </p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <CategoriaFiltros
        busca={busca}
        onBuscaChange={setBusca}
        onNovaCategoria={abrirModalCadastro}
        totalCategorias={totalCategorias}
      />

      {/* Tabela de Categorias */}
      <CategoriaTabela
        categorias={categorias}
        loading={loading}
        onEditar={abrirModalEditar}
        onExcluir={abrirModalExcluir}
      />

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
