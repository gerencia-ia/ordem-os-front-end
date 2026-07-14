"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Calendar, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getClientes } from "@/lib/api/clientes"
import type { Cliente } from "@/lib/tipos"
import Link from "next/link"

interface ClienteSemManutencao extends Cliente {
  diasSemVisita: number
}

export default function AlertaManutencaoClientes() {
  const [clientesSemManutencao, setClientesSemManutencao] = useState<ClienteSemManutencao[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    buscarClientesSemManutencao()
  }, [])

  async function buscarClientesSemManutencao() {
    try {
      setCarregando(true)
      const clientes = await getClientes()
      
      const hoje = new Date()
      const clientesFiltrados = clientes
        .filter((cliente) => {
          if (!cliente.data_ultima_visita) return false
          
          const dataUltimaVisita = new Date(cliente.data_ultima_visita)
          const diferencaDias = Math.floor(
            (hoje.getTime() - dataUltimaVisita.getTime()) / (1000 * 60 * 60 * 24)
          )
          
          return diferencaDias > 90
        })
        .map((cliente) => {
          const dataUltimaVisita = new Date(cliente.data_ultima_visita!)
          const diasSemVisita = Math.floor(
            (hoje.getTime() - dataUltimaVisita.getTime()) / (1000 * 60 * 60 * 24)
          )
          return { ...cliente, diasSemVisita }
        })
        .sort((a, b) => b.diasSemVisita - a.diasSemVisita)
      
      setClientesSemManutencao(clientesFiltrados)
    } catch (error) {
      console.error("Erro ao buscar clientes sem manutenção:", error)
    } finally {
      setCarregando(false)
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR")
  }

  function getNivelAlerta(dias: number) {
    if (dias > 180) return { cor: "destructive", texto: "Crítico", border: "border-red-300", bg: "bg-red-50/50 dark:bg-red-950/10" }
    if (dias > 120) return { cor: "warning", texto: "Urgente", border: "border-yellow-300", bg: "bg-yellow-50/50 dark:bg-yellow-950/10" }
    return { cor: "default", texto: "Atenção", border: "border-blue-300", bg: "bg-blue-50/50 dark:bg-blue-950/10" }
  }

  if (carregando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas de Manutenção Preventiva
          </CardTitle>
          <CardDescription>Carregando clientes...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (clientesSemManutencao.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <AlertTriangle className="h-5 w-5" />
            ✅ Alertas de Manutenção Preventiva
          </CardTitle>
          <CardDescription className="text-base">
            Todos os clientes estão com manutenção em dia. Nenhum cliente necessita atenção no momento.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-amber-100 bg-amber-50/50 dark:bg-amber-950/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5" />
          ⚠️ Alertas de Manutenção Preventiva
        </CardTitle>
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100">
              {clientesSemManutencao.length} Cliente{clientesSemManutencao.length > 1 ? "s" : ""}
            </Badge>
            <CardDescription className="text-base">
              sem visita há mais de 90 dias
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {clientesSemManutencao.slice(0, 10).map((cliente) => {
            const nivelAlerta = getNivelAlerta(cliente.diasSemVisita)
            return (
              <Alert key={cliente.id} className={`flex items-start justify-between border-l-4 ${nivelAlerta.border} ${nivelAlerta.bg}`}>
                <div className="flex-1">
                  <AlertTitle className="flex items-center gap-2 mb-2 font-semibold">
                    <User className="h-4 w-4" />
                    {cliente.nome}
                    <Badge variant={nivelAlerta.cor as any} className="text-xs">
                      {nivelAlerta.texto}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription className="flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Última visita: {formatarData(cliente.data_ultima_visita!)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {cliente.diasSemVisita} dias sem manutenção
                    </div>
                  </AlertDescription>
                </div>
                <Link href={`/clientes`}>
                  <Button variant="outline" size="sm" className="shrink-0">
                    Contatar
                  </Button>
                </Link>
              </Alert>
            )
          })}
          {clientesSemManutencao.length > 10 && (
            <div className="text-center pt-3 border-t">
              <Link href="/clientes">
                <Button variant="outline" size="sm">
                  Ver todos os {clientesSemManutencao.length} clientes
                </Button>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
