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
    if (dias > 180) return { cor: "destructive", texto: "Crítico" }
    if (dias > 120) return { cor: "warning", texto: "Urgente" }
    return { cor: "default", texto: "Atenção" }
  }

  if (carregando) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas de Manutenção
          </CardTitle>
          <CardDescription>Carregando clientes...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (clientesSemManutencao.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-500" />
            Alertas de Manutenção
          </CardTitle>
          <CardDescription>Nenhum cliente necessita atenção no momento</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Alertas de Manutenção
        </CardTitle>
        <CardDescription>
          {clientesSemManutencao.length} cliente{clientesSemManutencao.length > 1 ? "s" : ""} sem
          visita há mais de 90 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {clientesSemManutencao.slice(0, 10).map((cliente) => {
            const nivelAlerta = getNivelAlerta(cliente.diasSemVisita)
            return (
              <Alert key={cliente.id} className="flex items-start justify-between">
                <div className="flex-1">
                  <AlertTitle className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    {cliente.nome}
                    <Badge variant={nivelAlerta.cor as any}>{nivelAlerta.texto}</Badge>
                  </AlertTitle>
                  <AlertDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Última visita: {formatarData(cliente.data_ultima_visita!)}
                    </span>
                    <span className="font-semibold text-orange-600">
                      {cliente.diasSemVisita} dias atrás
                    </span>
                  </AlertDescription>
                </div>
                <Link href={`/clientes`}>
                  <Button variant="outline" size="sm">
                    Ver Cliente
                  </Button>
                </Link>
              </Alert>
            )
          })}
          {clientesSemManutencao.length > 10 && (
            <div className="text-center pt-2">
              <Link href="/clientes">
                <Button variant="link">
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
