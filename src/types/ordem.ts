import { z } from 'zod';
import type { Cliente } from './cliente';
import type { Endereco } from './endereco';
import type { Usuario } from './usuario';
import type { Equipamento } from './equipamento';

export interface Status {
  id: string | number;
  nome: string;
}

export interface Prioridade {
  id: string | number;
  descricao: string;
}

export interface CategoriaServico {
  id: number;
  descricao: string;
}

export interface Servico {
  id: number;
  nome: string;
  valor: number;
  tempo_servico: number;
  categoria?: CategoriaServico | null;
  categorias_servico?: CategoriaServico | null;
}

export interface OsServico extends Servico {
  quantidade?: number;
}

export interface OrdemServico {
  id: number;
  status: Status | null;
  status_id?: number;
  status_descricao?: string;
  prioridade: Prioridade | null;
  prioridade_id?: number;
  prioridade_descricao?: string;
  tecnico_responsavel?: Usuario | null;
  tecnicoId?: string;
  data_agendamento: string | null;
  data_fechamento: string | null;
  data_vencimento: string | null;
  data_inicio_atendimento: string | null;
  data_fim_atendimento: string | null;
  observacao: string | null;
  valor_total: string;
  numero_ordem: string;
  descricao: string;
  custo_estimado: string;
  cliente: Cliente | null;
  endereco?: Endereco | null;
  servicos?: OsServico[] | null;
  tecnicos?: Usuario[] | Usuario | null;
  equipamentos?: Equipamento[] | null;
  created_at: string;
  updated_at: string;
}

export interface CriarOrdemServicoPayload {
  ordem_servico: {
    cliente_id: number;
    endereco_id: number;
    user_ids?: number[];
    tecnico_ids?: number[];
    equipamento_ids?: number[];
    servico_ids?: number[];
    descricao?: string;
    status_id: number;
    prioridade_id: number;
    data_agendamento?: string;
    custo_estimado?: number;
    observacao?: string;
  };
}

export interface AtualizarStatusPayload {
  status_id: number;
}

export const criarOrdemFormSchema = z.object({
  cliente_id: z.coerce.number().min(1, 'Selecione um cliente'),
  endereco_id: z.coerce.number().min(1, 'Selecione o endereço de atendimento'),
  status_id: z.coerce.number().min(1, 'Selecione o status inicial'),
  prioridade_id: z.coerce.number().min(1, 'Selecione a prioridade'),
  data_agendamento: z.string().optional().default(''),
  descricao: z.string().optional().default(''),
  observacao: z.string().optional().default(''),
  servico_ids: z.array(z.number()).default([]),
  equipamento_ids: z.array(z.number()).default([]),
  tecnico_ids: z.array(z.number()).default([]),
  custo_estimado: z.number().optional().default(0),
});

export type CriarOrdemFormData = z.infer<typeof criarOrdemFormSchema>;
