"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Clock, TrendingUp, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { getClientes } from "@/lib/api/clientes"
import type { Cliente } from "@/lib/tipos"

interface EstatisticasManutencao {
  total: number
  critico: number
  urgente: number
  atencao: number
}

export default function ResumoManutencoes() {
  const [estatisticas, setEstatisticas] = useState<EstatisticasManutencao>({
    total: 0,
    critico: 0,
    urgente: 0,
    atencao: 0,
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    buscarEstatisticas()
  }, [])

  async function buscarEstatisticas() {
    try {
      setCarregando(true)
      const clientes = await getClientes()

      const hoje = new Date()
      const clientesSemManutencao = clientes.filter((cliente) => {
        if (!cliente.data_ultima_visita) return false

        const dataUltimaVisita = new Date(cliente.data_ultima_visita)
        const diferencaDias = Math.floor(
          (hoje.getTime() - dataUltimaVisita.getTime()) / (1000 * 60 * 60 * 24)
        )

        return diferencaDias > 90
      })

      let critico = 0
      let urgente = 0
      let atencao = 0

      clientesSemManutencao.forEach((cliente) => {
        const dataUltimaVisita = new Date(cliente.data_ultima_visita!)
        const diasSemVisita = Math.floor(
          (hoje.getTime() - dataUltimaVisita.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (diasSemVisita > 180) {
          critico++
        } else if (diasSemVisita > 120) {
          urgente++
        } else {
          atencao++
        }
      })

      setEstatisticas({
        total: clientesSemManutencao.length,
        critico,
        urgente,
        atencao,
      })
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
    } finally {
      setCarregando(false)
    }
  }

  const cards = [
    {
      titulo: "Total Agendado",
      valor: estatisticas.total,
      icon: AlertTriangle,
      cor: "text-orange-600 dark:text-orange-400",
      bgCor: "bg-orange-50 dark:bg-orange-950/20",
      borderCor: "border-orange-200 dark:border-orange-800",
    },
    {
      titulo: "Crítico",
      valor: estatisticas.critico,
      icon: AlertCircle,
      cor: "text-red-600 dark:text-red-400",
      bgCor: "bg-red-50 dark:bg-red-950/20",
      borderCor: "border-red-200 dark:border-red-800",
    },
    {
      titulo: "Urgente",
      valor: estatisticas.urgente,
      icon: Clock,
      cor: "text-yellow-600 dark:text-yellow-400",
      bgCor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderCor: "border-yellow-200 dark:border-yellow-800",
    },
    {
      titulo: "Atenção",
      valor: estatisticas.atencao,
      icon: TrendingUp,
      cor: "text-blue-600 dark:text-blue-400",
      bgCor: "bg-blue-50 dark:bg-blue-950/20",
      borderCor: "border-blue-200 dark:border-blue-800",
    },
  ]

  if (carregando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card
            key={idx}
            className={`border-2 ${card.borderCor} ${card.bgCor} hover:shadow-lg transition-shadow`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.titulo}</p>
                  <p className="text-3xl font-bold mt-2">{card.valor}</p>
                </div>
                <Icon className={`h-10 w-10 ${card.cor} opacity-60`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
