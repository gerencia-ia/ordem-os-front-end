'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { useUsers } from '@/src/hooks/useUsers';
import { UsuarioFiltros } from './UsuarioFiltros';
import { UsuarioTabela } from './UsuarioTabela';
import { UsuarioModalCadastro } from './UsuarioModalCadastro';
import { UsuarioModalEdicao } from './UsuarioModalEdicao';
import { UsuarioModalExcluir } from './UsuarioModalExcluir';
import type { User } from '@/src/types/user';
import { Plus, Wrench } from 'lucide-react';

interface UsuarioListaProps {
  roleFiltroPadrao?: string;
  titulo?: string;
  descricao?: string;
  botaoNovoTexto?: string;
}

export function UsuarioLista({
  roleFiltroPadrao,
  titulo = 'Usuários',
  descricao = 'Gerencie os usuários do sistema',
  botaoNovoTexto,
}: UsuarioListaProps) {
  const {
    users,
    usersFiltrados,
    loading,
    busca,
    setBusca,
    recarregar,
    excluirUser,
  } = useUsers({ roleFiltroPadrao });

  const [modalCadastroAberta, setModalCadastroAberta] = useState(false);
  const [userParaEdicao, setUserParaEdicao] = useState<User | null>(null);
  const [userParaExclusao, setUserParaExclusao] = useState<User | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const textoBotao =
    botaoNovoTexto || (roleFiltroPadrao ? `Novo ${roleFiltroPadrao}` : 'Novo Usuário');

  const handleConfirmarExclusao = async (id: string | number) => {
    try {
      setExcluindo(true);
      await excluirUser(id);
    } finally {
      setExcluindo(false);
      setUserParaExclusao(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{descricao}</p>
        </div>

        <Button
          onClick={() => setModalCadastroAberta(true)}
          className="gap-1.5 shadow-sm capitalize"
        >
          <Plus className="h-4 w-4" /> {textoBotao}
        </Button>
      </div>

      {/* Card Principal */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
          <UsuarioFiltros
            busca={busca}
            onBuscaChange={setBusca}
            totalUsuarios={users.length}
            totalFiltrados={usersFiltrados.length}
          />
        </CardHeader>
        <CardContent>
          <UsuarioTabela
            users={usersFiltrados}
            loading={loading}
            onEditar={(user) => setUserParaEdicao(user)}
            onExcluir={(user) => setUserParaExclusao(user)}
          />
        </CardContent>
      </Card>

      {/* Modais */}
      <UsuarioModalCadastro
        aberto={modalCadastroAberta}
        onOpenChange={setModalCadastroAberta}
        onSucesso={recarregar}
        titulo={textoBotao}
      />

      <UsuarioModalEdicao
        user={userParaEdicao}
        aberto={userParaEdicao !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setUserParaEdicao(null);
        }}
        onSucesso={recarregar}
        titulo={roleFiltroPadrao ? `Editar ${roleFiltroPadrao}` : 'Editar Usuário'}
      />

      <UsuarioModalExcluir
        user={userParaExclusao}
        aberto={userParaExclusao !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setUserParaExclusao(null);
        }}
        onConfirmar={handleConfirmarExclusao}
        excluindo={excluindo}
      />
    </div>
  );
}

export default UsuarioLista;
