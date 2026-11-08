'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { useClientes } from '@/src/hooks/useClientes';
import { ClienteFiltros } from './ClienteFiltros';
import { ClienteTabela } from './ClienteTabela';
import { ClienteModalCadastro } from './ClienteModalCadastro';
import { ClienteModalEdicao } from './ClienteModalEdicao';
import { ClienteModalExcluir } from './ClienteModalExcluir';
import type { Cliente } from '@/src/types/cliente';
import { Plus, Users } from 'lucide-react';

export function ClienteLista() {
  const {
    clientes,
    clientesFiltrados,
    loading,
    busca,
    setBusca,
    filtroMarcador,
    setFiltroMarcador,
    recarregar,
    excluirCliente,
  } = useClientes();

  const [modalCadastroAberta, setModalCadastroAberta] = useState(false);
  const [clienteParaEdicao, setClienteParaEdicao] = useState<Cliente | null>(
    null,
  );
  const [clienteParaExclusao, setClienteParaExclusao] =
    useState<Cliente | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const handleConfirmarExclusao = async (id: number) => {
    try {
      setExcluindo(true);
      await excluirCliente(id);
    } finally {
      setExcluindo(false);
      setClienteParaExclusao(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gerencie o cadastro de clientes, endereços e histórico de contatos.
          </p>
        </div>

        <Button
          onClick={() => setModalCadastroAberta(true)}
          className="gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      {/* Card Principal */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
          <ClienteFiltros
            busca={busca}
            onBuscaChange={setBusca}
            filtroMarcador={filtroMarcador}
            onFiltroMarcadorChange={setFiltroMarcador}
            totalClientes={clientes.length}
            totalFiltrados={clientesFiltrados.length}
          />
        </CardHeader>
        <CardContent>
          <ClienteTabela
            clientes={clientesFiltrados}
            loading={loading}
            onEditar={(cli) => setClienteParaEdicao(cli)}
            onExcluir={(cli) => setClienteParaExclusao(cli)}
          />
        </CardContent>
      </Card>

      {/* Modais de Fluxo */}
      <ClienteModalCadastro
        aberto={modalCadastroAberta}
        onOpenChange={setModalCadastroAberta}
        onSucesso={recarregar}
      />

      <ClienteModalEdicao
        cliente={clienteParaEdicao}
        aberto={clienteParaEdicao !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setClienteParaEdicao(null);
        }}
        onSucesso={recarregar}
      />

      <ClienteModalExcluir
        cliente={clienteParaExclusao}
        aberto={clienteParaExclusao !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setClienteParaExclusao(null);
        }}
        onConfirmar={handleConfirmarExclusao}
        excluindo={excluindo}
      />
    </div>
  );
}
