// Tipos centrais do sistema de Ordem de Serviço

export interface Status {
  id: string;
  nome: string;
}

export type StatusOrdem =
  'pendente' | 'em_progresso' | 'concluido' | 'cancelado';

export interface Prioridade {
  id: string;
  nome: string;
}

import type { Cliente, Telefone, Endereco } from '@/src/types/cliente';
import type { User, Role } from '@/src/types/user';

export type { Cliente, Telefone, Endereco, User, Role };

export interface CategoriaServico {
  id: number;
  descricao: string;
}

export type Servico = {
  id: number;
  nome: string;
  valor: number;
  tempo_servico: number;
  categorias_servico?: CategoriaServico | null;
};

export interface Equipamento {
  id: string | number;
  marca: string;
  btus: string;
  local_instalacao: string;
  observacao?: string;
  cliente?: Cliente | null;
}

export interface Tarefa {
  id: string;
  descricao: string;
  status: Status | null;
  user: User | null;
  ordem_servico?: OrdemServico | null;
  data_inicio?: string;
  data_fim?: string;
}

export interface OsServico {
  id: string;
  nome: string;
  valor: number;
  tempo_servico: number;
  categorias_servico_id: number;
  categoria?: {
    id: number;
    descricao: string;
  };
  categorias_servico?: {
    id: number;
    descricao: string;
  };
}

export interface OrdemServico {
  id: number;
  status: Status | null;
  status_id?: number;
  status_descricao?: string;
  prioridade_descricao?: string;
  tecnico_responsavel?: User | null;
  tecnicoId?: string;
  data_agendamento: string | null;
  prioridade: Prioridade | null;
  data_fechamento: string | null;
  data_inicio_atendimento: string | null;
  data_fim_atendimento: string | null;
  observacao: string | null;
  valor_total: string;
  numero_ordem: string;
  descricao: string;
  data_vencimento: string | null;
  custo_estimado: string;
  cliente: Cliente | null;
  servicos?: (Servico & { quantidade?: number })[] | null;
  tecnicos?: User[] | null;
  equipamentos?: Equipamento[] | null;
  created_at: string;
  updated_at: string;
}
