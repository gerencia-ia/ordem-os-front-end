export interface Role {
  id: string | number;
  nome: string;
}

export type RolePayload = {
  nome: string;
};
