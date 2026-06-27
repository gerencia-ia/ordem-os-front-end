"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { BarraNavegacao } from "@/components/barra-navegacao"
import { BarraLateral } from "@/components/barra-lateral"
import { ProveedorTema } from "@/components/provedor-tema"
import { estaAutenticado } from "@/lib/api/autenticacao"

export default function LayoutPainel({ children }: { children: React.ReactNode }) {
  const [barraLateralAberta, setBarraLateralAberta] = useState(false)
  const [montado, setMontado] = useState(false)
  const [autenticado, setAutenticado] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMontado(true)
  }, [])

  useEffect(() => {
    // Só verificar autenticação no cliente após montar
    if (!montado) return
    
    // Pequeno delay para garantir que localStorage está atualizado
    const timer = setTimeout(() => {
      const isAuth = estaAutenticado()
      
      if (!isAuth) {
        window.location.href = "/login"
      } else {
        setAutenticado(true)
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [montado, pathname])

  // Não mostrar nada até verificar autenticação
  if (!montado || !autenticado) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <ProveedorTema>
      <div className="flex h-screen bg-background">
        <BarraLateral estaAberta={barraLateralAberta} aoFechar={() => setBarraLateralAberta(false)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <BarraNavegacao onMenuToggle={() => setBarraLateralAberta(!barraLateralAberta)} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProveedorTema>
  )
}
