'use client';

import UsuarioLista from '@/src/components/Usuarios/UsuarioLista';

export default function PaginaTecnicos() {
  return (
    <UsuarioLista
      roleFiltroPadrao="técnico"
      titulo="Técnicos"
      descricao="Gerencie os técnicos do sistema"
      botaoNovoTexto="Novo Técnico"
    />
  );
}
