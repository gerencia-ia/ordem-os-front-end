import type { Prioridade } from "@/lib/tipos"
import { apiGet } from "./api"

export async function getPrioridades(): Promise<Prioridade[]> {
  return apiGet<Prioridade[]>("/prioridades", { cache: "no-store" })
}
