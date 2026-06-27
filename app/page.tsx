"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { estaAutenticado } from "@/lib/api/autenticacao"
import Painel from "@/components/painel"

export default function Root() {
  const router = useRouter()
  const autenticado = estaAutenticado()

  useEffect(() => {
    if (!autenticado) {
      router.push("/login")
    }
  }, [autenticado, router])

  // Se não está autenticado, não renderiza nada (vai redirecionar)
  if (!autenticado) {
    return null
  }

  // Se está autenticado, renderiza o painel
  return <Painel />
}

