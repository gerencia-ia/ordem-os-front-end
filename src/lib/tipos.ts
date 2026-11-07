// Tipos centrais do sistema de Ordem de Serviço (Ponte de compatibilidade)

export type StatusOrdem =
  'pendente' | 'em_progresso' | 'concluido' | 'cancelado';

import type { Cliente, Telefone, Endereco } from '@/src/types/cliente';
import type { Usuario, User, Role } from '@/src/types/usuario';
import type { Equipamento } from '@/src/types/equipamento';
import type {
  Status,
  Prioridade,
  CategoriaServico,
  Servico,
  OsServico,
  OrdemServico,
} from '@/src/types/ordem';

export type {
  Cliente,
  Telefone,
  Endereco,
  Usuario,
  User,
  Role,
  Equipamento,
  Status,
  Prioridade,
  CategoriaServico,
  Servico,
  OsServico,
  OrdemServico,
};

export interface Tarefa {
  id: string;
  descricao: string;
  status: Status | null;
  user: User | null;
  ordem_servico?: OrdemServico | null;
  data_inicio?: string;
  data_fim?: string;
}
