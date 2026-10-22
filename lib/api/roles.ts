import type { Role } from "@/lib/tipos"
import { apiGet } from "./api"

export type RolePayload = {
  nome: string
}

export async function getRoles(): Promise<Role[]> {
  return apiGet<Role[]>("/roles", { cache: "no-store" })
}

