import { z } from 'zod';
import type { Cliente } from './cliente';
import type { Endereco } from './endereco';
import type { OsMaterialItem } from './material';
import {
  osServicoFormSchema,
  type OsEquipamentoItem,
  type OsServicoItem,
} from './ordem';

export type OrcamentoStatusEditavel =
  'rascunho' | 'enviado' | 'aprovado' | 'recusado' | 'expirado';

export type OrcamentoStatus = OrcamentoStatusEditavel | 'convertido';

export const ORCAMENTO_STATUS_LABELS: Record<OrcamentoStatus, string> = {
  rascunho: 'Rascunho',
  enviado: 'Enviado',
  aprovado: 'Aprovado',
  recusado: 'Recusado',
  expirado: 'Expirado',
  convertido: 'Convertido em OS',
};

export const ORCAMENTO_STATUS_EDITAVEIS_OPTIONS: ReadonlyArray<{
  value: OrcamentoStatusEditavel;
  label: string;
}> = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'enviado', label: 'Enviado' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'recusado', label: 'Recusado' },
  { value: 'expirado', label: 'Expirado' },
];

export interface Orcamento {
  id: number;
  numero_orcamento: string;
  status: OrcamentoStatus;
  data_validade: string | null;
  subtotal_servicos: string | number;
  subtotal_materiais: string | number;
  desconto: string | number;
  valor_total: string | number;
  condicoes_pagamento: string | null;
  observacao: string | null;
  ordem_servico_id: number | null;
  ordem_servico?: {
    id: number;
    numero_ordem: string;
  } | null;
  created_at: string;
  updated_at: string;
  cliente: Cliente | null;
  endereco: Endereco | null;
  equipamentos: OsEquipamentoItem[];
  servicos: OsServicoItem[];
  materiais: OsMaterialItem[];
}

export interface OrcamentoServicoInput {
  id?: number;
  equipamento_id?: number;
  valor_por_andar_id?: number;
  quantidade?: number;
  _destroy?: boolean;
}

export interface OrcamentoMaterialInput {
  id?: number;
  material_id?: number | null;
  nome_material?: string;
  valor?: number;
  _destroy?: boolean;
}

export interface CriarOrcamentoPayload {
  orcamento: {
    cliente_id: number;
    endereco_id: number;
    status?: OrcamentoStatusEditavel;
    data_validade?: string;
    desconto?: number;
    condicoes_pagamento?: string;
    observacao?: string;
    equipamento_ids?: number[];
    orcamento_servicos_attributes?: OrcamentoServicoInput[];
    orcamento_materiais_attributes?: OrcamentoMaterialInput[];
  };
}

export interface AtualizarOrcamentoPayload {
  orcamento: {
    cliente_id?: number;
    endereco_id?: number;
    status?: OrcamentoStatusEditavel;
    data_validade?: string | null;
    desconto?: number;
    condicoes_pagamento?: string | null;
    observacao?: string | null;
    equipamento_ids?: number[];
    orcamento_servicos_attributes?: OrcamentoServicoInput[];
    orcamento_materiais_attributes?: OrcamentoMaterialInput[];
  };
}

export interface ConverterOrcamentoPayload {
  prioridade_id?: number;
  status_id?: number;
  data_agendamento?: string;
  descricao?: string;
  observacao?: string;
  tecnico_ids?: number[];
  user_ids?: number[];
}

export const orcamentoFormSchema = z.object({
  cliente_id: z.coerce.number().min(1, 'Selecione um cliente'),
  endereco_id: z.coerce.number().min(1, 'Selecione o endereço de atendimento'),
  status: z
    .enum(['rascunho', 'enviado', 'aprovado', 'recusado', 'expirado'])
    .default('rascunho'),
  data_validade: z.string().optional(),
  desconto: z.coerce
    .number()
    .min(0, 'O desconto não pode ser negativo')
    .default(0),
  condicoes_pagamento: z.string().optional(),
  observacao: z.string().optional(),
  equipamento_ids: z.array(z.number()),
  orcamento_servicos: z.array(osServicoFormSchema),
});

export type OrcamentoFormData = z.infer<typeof orcamentoFormSchema>;
