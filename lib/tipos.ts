// Tipos centrais do sistema de Ordem de Serviço

export interface Status {
  id: string
  nome: string
}

export interface Prioridade {
  id: string
  nome: string
}

export interface Role {
  id: string
  nome: string
}

export interface CategoriaServico {
  id: number
  descricao: string
}

export type Telefone = {
  id: number
  numero: string
  cliente_id: number
  created_at: string
  updated_at: string
}

export type Servico = {
  id: number
  nome: string
  valor: number
  tempo_servico: number
  categorias_servico?: CategoriaServico | null
}

export type Endereco = {
  id: number
  cep?: string
  rua: string
  numero: string
  bairro: string
  complemento?: string
  cidade: string
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: number
  nome: string
  email?: string | null
  dataRegistro: string
  data_ultima_visita?: string | null
  telefones: Telefone[]
  enderecos: Endereco[]
}

export interface User {
  id: string
  nome: string
  cpf: string
  email: string
  telefone: string
  role: Role | null
}

export interface Equipamento {
  id: string
  marca: string
  btus: string
  local_instalacao: string
  observacao: string
  cliente: Cliente | null
}

export interface Tarefa {
  id: string
  descricao: string
  status: Status | null
  user: User | null
  ordem_servico?: OrdemServico | null
  data_inicio?: string
  data_fim?: string
}

export interface OsServico {
  id: string
  nome: string
  valor: number
  tempo_servico: number
  categorias_servico_id: number
  categoria?: {
    id: number
    descricao: string
  }
  categorias_servico?: {
    id: number
    descricao: string
  }
}

export interface OrdemServico {
  id: number
  status: Status | null
  data_agendamento: string | null
  prioridade: Prioridade | null
  data_fechamento: string | null
  data_inicio_atendimento: string | null
  data_fim_atendimento: string | null
  observacao: string | null
  valor_total: string
  numero_ordem: string
  descricao: string
  data_vencimento: string | null
  custo_estimado: string
  cliente: Cliente | null
  servicos?: Servico [] | null
  tecnicos?: User [] | null
  equipamentos?: Equipamento [] | null
  created_at: string
  updated_at: string
}

export interface Dashboard {
  totalOrdens: number
  ordensAbertos: number
  ordensEmProgresso: number
  ordensConcluidas: number
  taxaConclusao: number
  custoDia: number
  tempoMedioAtencimento: number
}
