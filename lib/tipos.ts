// Tipos centrais do sistema de Ordem de Serviço

export type StatusOrdem = "pendente" | "em_progresso" | "concluido" | "cancelado"
export type StatusTaref = "nao_iniciada" | "em_andamento" | "concluida" | "bloqueada"
export type TipoServico = "manutencao" | "reparo" | "instalacao" | "diagnostico"

export type Telefone = {
  id: number
  numero: string
  cliente_id: number
  created_at: string
  updated_at: string
}

export type Endereco = {
  id: number
  rua: string
  numero: string
  bairro: string
  complemento?: string
  cidade: string
  cliente_id: number
  created_at: string
  updated_at: string
}

export interface Cliente {
  id: number
  nome: string
  cpf?: string
  email?: string | null
  dataRegistro: string
  telefones: Telefone[]
  enderecos: Endereco[]
}

export interface Tecnico {
  id: string
  nome: string
  email: string
  cpf: string
  telefone: string
  especialidades: string[]
  statusDisponibilidade: "disponivel" | "ocupado" | "ausente"
}

export interface Equipamento {
  id: string
  marca: string
  btus: string
  local_instalacao: string
  observacao: string
  cliente_id: string
}

export interface Tarefa {
  id: string
  descricao: string
  status: StatusTaref
  tecnicoAssignado?: string
  dataInicio?: string
  dataFim?: string
}

export interface Servico {
  id: string
  nome: string
  valor: number
}

export interface OrdemServico {
  id: number
  status_id: number
  data_agendamento: string | null
  data_fechamento: string | null
  observacao: string | null
  prioridade_id: number
  valor_total: string
  numero_ordem: string
  descricao: string
  tipo_servico: string
  data_vencimento: string | null
  custo_estimado: string
  cliente_id: number
  created_at: string
  updated_at: string
  cliente_nome: string
  prioridade_descricao: string
  status_descricao: string
  tecnico_responsavel?: {}
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

export interface Status {
  id: string
  nome: string
}