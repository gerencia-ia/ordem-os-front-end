import type { Status } from "@/lib/tipos"
import { apiGet } from "./api"

export type StatusPayload = {
  nome: string
}

export async function getPrioridades(): Promise<Status[]> {
  return apiGet<Status[]>("/prioridades", { cache: "no-store" })
}

