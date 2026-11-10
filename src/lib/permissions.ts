export type Perfil = 'admin' | 'secretaria' | 'tecnico';

export const PERFIS = {
  ADMIN: 'admin',
  SECRETARIA: 'secretaria',
  TECNICO: 'tecnico',
} as const;

/**
 * Normaliza qualquer formato de role recebido do JWT ou API.
 * Ex: 'Administrador', 'admin', 'Secretaria', 'Técnico', 'tecnico' -> 'admin' | 'secretaria' | 'tecnico'
 */
export function normalizarPerfil(role?: string | null): Perfil | null {
  if (!role) return null;
  const limpo = role
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  if (limpo === 'admin' || limpo === 'administrador') return 'admin';
  if (limpo === 'secretaria') return 'secretaria';
  if (limpo === 'tecnico') return 'tecnico';

  return null;
}

// Matriz de Rotas Permitidas por Perfil
export const ROTAS_PERMITIDAS: Record<Perfil, string[]> = {
  admin: [
    '/painel',
    '/kanban',
    '/ordens',
    '/clientes',
    '/configuracoes',
    '/usuarios',
    '/servicos',
    '/categorias-servicos',
  ],
  secretaria: [
    '/painel',
    '/kanban',
    '/ordens',
    '/clientes',
    '/configuracoes',
    '/usuarios',
    '/servicos',
    '/categorias-servicos',
  ],
  tecnico: ['/painel', '/kanban', '/ordens'],
};

export function podeAcessarRota(rota: string, perfil?: Perfil | null): boolean {
  if (!perfil) return false;
  if (perfil === 'admin') return true;

  // Extrai o segmento base (ex: /ordens/123 -> /ordens)
  const segmentos = rota.split('/').filter(Boolean);
  const rotaBase = segmentos.length > 0 ? `/${segmentos[0]}` : '/';

  const rotasPermitidas = ROTAS_PERMITIDAS[perfil] || [];

  return rotasPermitidas.some(
    (r) => r === rota || r === rotaBase || rota.startsWith(`${r}/`),
  );
}

// Matriz de Capacidades Operacionais
export const CAPACIDADES = {
  // Usuários / Equipe
  gerenciarUsuariosAdmin: (p: Perfil) => p === 'admin',
  gerenciarTecnicos: (p: Perfil) => p === 'admin' || p === 'secretaria',
  podeCadastrarFuncao: (p: Perfil, targetRoleName: string) => {
    const targetNorm = normalizarPerfil(targetRoleName);
    if (p === 'admin') return true;
    if (p === 'secretaria') return targetNorm === 'tecnico';
    return false;
  },

  // Clientes
  gerenciarClientes: (p: Perfil) => p === 'admin' || p === 'secretaria',
  excluirCliente: (p: Perfil) => p === 'admin' || p === 'secretaria',

  // Ordens de Serviço
  criarOrdem: (p: Perfil) => p === 'admin' || p === 'secretaria',
  excluirOrdem: (p: Perfil) => p === 'admin' || p === 'secretaria',
  alterarPrecosEServicos: (p: Perfil) => p === 'admin' || p === 'secretaria',
  atribuirTecnicos: (p: Perfil) => p === 'admin' || p === 'secretaria',
  preencherLaudo: (p: Perfil) =>
    p === 'admin' || p === 'secretaria' || p === 'tecnico',
  alterarStatusOperacional: (p: Perfil) =>
    p === 'admin' || p === 'secretaria' || p === 'tecnico',

  // Financeiro / Métricas
  verMetricasFinanceiras: (p: Perfil) => p === 'admin' || p === 'secretaria',

  // Configurações e Catálogo
  gerenciarServicos: (p: Perfil) => p === 'admin' || p === 'secretaria',
  gerenciarCategorias: (p: Perfil) => p === 'admin' || p === 'secretaria',
};
