'use client';

import { UsuarioLista } from '@/src/components/Usuarios/UsuarioLista';

export default function PaginaUsuarios() {
  return (
    <UsuarioLista
      titulo="Usuários"
      descricao="Gerencie os usuários e permissões do sistema"
      botaoNovoTexto="Novo Usuário"
    />
  );
}
