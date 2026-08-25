"use client"

import { useParams } from "next/navigation"
import DetalheOrdem from "@/components/ordem-servico/detalhe-ordem"

export default function PaginaDetalheOrdem() {
  const params = useParams()
  const ordemId = params.id as string

  return <DetalheOrdem ordemId={ordemId} />
}
