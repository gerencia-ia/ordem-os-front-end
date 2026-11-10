import { z } from 'zod';
import { Telefone, telefoneSchema } from './telefone';
import { Endereco, enderecoSchema } from './endereco';

export interface NovoEquipamentoData {
  marca: string;
  btus: string;
  local_instalacao: string;
  observacao?: string;
  cliente_id?: number;
}

export interface Cliente {
  id: number;
  nome: string;
  email?: string | null;
  data_ultima_visita?: string | null;
  telefones: Telefone[];
  enderecos: Endereco[];
}

export interface NovoClientePayload {
  nome: string;
  email?: string | null;
  data_ultima_visita?: string | null;
  telefones_attributes: Array<{ numero: string }>;
  enderecos_attributes: Array<{
    cep?: string;
    rua: string;
    numero: string;
    bairro: string;
    complemento?: string;
    cidade: string;
  }>;
  equipamentos_attributes?: Array<{
    marca?: string;
    btus?: string;
    local_instalacao?: string;
    observacao?: string;
  }>;
}

export interface AtualizarClientePayload {
  nome?: string;
  email?: string | null;
  data_ultima_visita?: string | null;
  telefones_attributes?: Array<{
    id?: number;
    numero?: string;
    _destroy?: boolean;
  }>;
  enderecos_attributes?: Array<{
    id?: number;
    cep?: string;
    rua?: string;
    numero?: string;
    bairro?: string;
    complemento?: string;
    cidade?: string;
    _destroy?: boolean;
  }>;
  equipamentos_attributes?: Array<{
    marca?: string;
    btus?: string;
    local_instalacao?: string;
    observacao?: string;
  }>;
}

export const clienteFormSchema = z
  .object({
    nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    data_ultima_visita: z.string().optional().or(z.literal('')),
    telefones: z.array(telefoneSchema),
    enderecos: z.array(enderecoSchema),
  })
  .superRefine((data, ctx) => {
    const telefonesAtivos = data.telefones.filter((t) => !t._destroy);
    if (telefonesAtivos.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Adicione pelo menos um telefone',
        path: ['telefones'],
      });
    }

    const enderecosAtivos = data.enderecos.filter((e) => !e._destroy);
    if (enderecosAtivos.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Adicione pelo menos um endereço',
        path: ['enderecos'],
      });
    }
  });

export type ClienteFormData = z.infer<typeof clienteFormSchema>;
