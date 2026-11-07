'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { useUsuarios } from '@/src/hooks/useUsuarios';
import { usePermissions } from '@/src/hooks/usePermissions';
import { UsuarioFiltros } from './UsuarioFiltros';
import { UsuarioTabela } from './UsuarioTabela';
import { UsuarioModalCadastro } from './UsuarioModalCadastro';
import { UsuarioModalEdicao } from './UsuarioModalEdicao';
import { UsuarioModalExcluir } from './UsuarioModalExcluir';
import type { Usuario } from '@/src/types/usuario';
import { Plus, Users } from 'lucide-react';

interface UsuarioListaProps {
  roleFiltroPadrao?: string;
  titulo?: string;
  descricao?: string;
  botaoNovoTexto?: string;
}

export function UsuarioLista({
  roleFiltroPadrao,
  titulo = 'Usuários',
  descricao = 'Gerencie os usuários e permissões do sistema',
  botaoNovoTexto,
}: UsuarioListaProps) {
  const { isSecretaria } = usePermissions();
  const {
    usuarios,
    usuariosFiltrados,
    loading,
    busca,
    setBusca,
    filtroPerfil,
    setFiltroPerfil,
    recarregar,
    excluirUsuario,
  } = useUsuarios({ roleFiltroPadrao });

  const [modalCadastroAberta, setModalCadastroAberta] = useState(false);
  const [userParaEdicao, setUserParaEdicao] = useState<Usuario | null>(null);
  const [userParaExclusao, setUserParaExclusao] = useState<Usuario | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const textoBotao =
    botaoNovoTexto ||
    (isSecretaria ? 'Novo Técnico' : 'Novo Usuário');

  const handleConfirmarExclusao = async (id: string | number) => {
    try {
      setExcluindo(true);
      await excluirUsuario(id);
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
            <Users className="h-6 w-6 text-primary" />
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
            totalUsuarios={usuarios.length}
            totalFiltrados={usuariosFiltrados.length}
            filtroPerfil={filtroPerfil}
            onFiltroPerfilChange={setFiltroPerfil}
            exibirFiltrosPerfil={!isSecretaria && !roleFiltroPadrao}
          />
        </CardHeader>
        <CardContent>
          <UsuarioTabela
            users={usuariosFiltrados}
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
        titulo="Editar Usuário"
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
