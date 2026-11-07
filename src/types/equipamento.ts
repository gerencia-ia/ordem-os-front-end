import { z } from 'zod';
import type { Cliente } from './cliente';

export interface Equipamento {
  id: string | number;
  marca: string;
  btus: string;
  local_instalacao: string;
  observacao?: string | null;
  cliente?: Cliente | null;
  laudo?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CriarEquipamentoPayload {
  marca: string;
  btus: string;
  local_instalacao: string;
  observacao?: string;
  cliente_id: number;
}

// Alias de retrocompatibilidade
export type NovoEquipamentoPayload = CriarEquipamentoPayload;

export interface OrdemServicoResumida {
  id: number;
  numero_ordem: string;
  descricao: string;
  data_agendamento: string;
  data_fechamento?: string;
  status: string;
  prioridade: string;
}

export interface HistoricoLaudo {
  id: number;
  laudo: string;
  created_at: string;
  updated_at: string;
  ordem_servico: OrdemServicoResumida;
}

// Alias de retrocompatibilidade
export type Laudo = HistoricoLaudo;

export const equipamentoFormSchema = z.object({
  marca: z.string().min(1, 'A marca do equipamento é obrigatória'),
  btus: z.string().min(1, 'A potência em BTUs é obrigatória'),
  local_instalacao: z.string().min(1, 'O local de instalação é obrigatório'),
  observacao: z.string().optional().default(''),
  cliente_id: z.coerce.number().min(1, 'O cliente é obrigatório'),
});

export type EquipamentoFormData = z.infer<typeof equipamentoFormSchema>;
