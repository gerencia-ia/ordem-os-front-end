export interface Material {
  id: number;
  nome: string;
  descricao: string | null;
  valor_referencia: number | string | null;
}

export interface MaterialOrdemInput {
  material_id: number | null;
  nome_material: string;
  valor: number;
}

export interface OsMaterialItem {
  id: number;
  material_id: number | null;
  nome: string;
  valor: number | string;
}

export interface MaterialPayload {
  nome: string;
  descricao?: string | null;
  valor_referencia?: number | null;
}
