import { z } from 'zod';
import type { Cliente } from './cliente';
import type { Endereco } from './endereco';
import type { Usuario } from './usuario';

export interface Status {
  id: string | number;
  nome: string;
}

export interface Prioridade {
  id: string | number;
  descricao: string;
}

export interface OsServicoItem {
  id: number;
  nome: string;
  valor: string | number;
  tempo_servico: number; // Em minutos inteiros
  quantidade: number; // Quantidade associada nesta OS
  categoria?: {
    id: number;
    descricao: string;
  } | null;
}

// Alias para compatibilidade com importações existentes
export type OsServico = OsServicoItem;

export interface OsEquipamentoItem {
  id: number | string;
  marca: string;
  btus: string;
  local_instalacao: string;
  observacao?: string | null;
  laudo?: string | null; // Laudo técnico preenchido nesta OS
}

export interface OrdemServico {
  id: number;
  numero_ordem: string;
  descricao: string;
  data_agendamento: string | null;
  data_vencimento: string | null;
  data_fechamento: string | null;
  data_inicio_atendimento: string | null;
  data_fim_atendimento: string | null;
  custo_estimado: string;
  valor_total: string;
  observacao: string | null;
  created_at: string;
  updated_at: string;

  status: Status | null;
  status_id?: number;
  status_descricao?: string;

  prioridade: Prioridade | null;
  prioridade_id?: number;
  prioridade_descricao?: string;

  cliente: Cliente | null;
  endereco?: Endereco | null;

  // Técnicos: Sempre um Array no Rails 8
  tecnicos: Usuario[];
  // Técnico Líder / Responsável retornado pela API
  tecnico_responsavel?: Usuario | null;
  tecnicoId?: string;

  // Serviços associados com quantidade e categoria
  servicos: OsServicoItem[];

  // Equipamentos associados com laudo desta OS
  equipamentos: OsEquipamentoItem[];
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
    data_vencimento?: string;
    custo_estimado?: number;
    observacao?: string;
  };
}

export interface AtualizarStatusPayload {
  status_id: number;
}

export const criarOrdemFormSchema = z
  .object({
    cliente_id: z.coerce.number().min(1, 'Selecione um cliente'),
    endereco_id: z.coerce
      .number()
      .min(1, 'Selecione o endereço de atendimento'),
    status_id: z.coerce.number().min(1, 'Selecione o status inicial'),
    prioridade_id: z.coerce.number().min(1, 'Selecione a prioridade'),
    data_agendamento: z.string().optional().default(''),
    data_vencimento: z.string().optional().default(''),
    descricao: z.string().optional().default(''),
    observacao: z.string().optional().default(''),
    servico_ids: z.array(z.number()).default([]),
    equipamento_ids: z.array(z.number()).default([]),
    tecnico_ids: z.array(z.number()).default([]),
    custo_estimado: z.number().optional().default(0),
  })
  .superRefine((data, ctx) => {
    if (data.data_agendamento && data.data_vencimento) {
      const agendamento = new Date(data.data_agendamento);
      const vencimento = new Date(data.data_vencimento);
      if (
        !isNaN(agendamento.getTime()) &&
        !isNaN(vencimento.getTime()) &&
        vencimento < agendamento
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'Data de vencimento não pode ser anterior ao agendamento',
          path: ['data_vencimento'],
        });
      }
    }
  });

export type CriarOrdemFormData = z.infer<typeof criarOrdemFormSchema>;
