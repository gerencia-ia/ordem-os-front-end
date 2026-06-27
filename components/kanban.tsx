"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { OrdemServico, StatusOrdem } from "@/lib/tipos"
import { getOrdensServico, updateOrdemServicoStatus } from "@/lib/api/ordem_servicos"
import { Plus } from "lucide-react"

const colunas: { titulo: string; status: StatusOrdem; cor: string }[] = [
  { titulo: "Agendado", status: "pendente", cor: "bg-yellow-100 dark:bg-yellow-950" },
  { titulo: "Em Progresso", status: "em_progresso", cor: "bg-blue-100 dark:bg-blue-950" },
  { titulo: "Concluido", status: "concluido", cor: "bg-green-100 dark:bg-green-950" },
  { titulo: "Cancelado", status: "cancelado", cor: "bg-red-100 dark:bg-red-950" },
]

export default function Kanban() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [loading, setLoading] = useState(false)
  const [draggedOrdemId, setDraggedOrdemId] = useState<number | null>(null)
  const [filtroMes, setFiltroMes] = useState<string>(() => {
    const hoje = new Date()
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`
  })

  useEffect(() => {
    async function fetchOrdens() {
      try {
        setLoading(true)
        
        // Extrai mês e ano do filtro (formato: "2026-02")
        const [ano, mes] = filtroMes.split("-")
        
        // Busca ordens da API com filtro de mês e ano
        const data = await getOrdensServico(parseInt(mes), parseInt(ano))
        
        console.log("📋 Ordens carregadas:", data.map(o => ({ id: o.id, status_descricao: o.status_descricao })))
        setOrdens(data)
      } catch (err) {
        console.error("Erro ao carregar ordens:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrdens()
  }, [filtroMes])

  const handleDragStart = (e: React.DragEvent, ordemId: number) => {
    setDraggedOrdemId(ordemId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, statusDestino: string) => {
    e.preventDefault()
    if (!draggedOrdemId) return

    try {
      // Encontra o status_id correspondente ao status_descricao
      const ordem = ordens.find(o => o.id === draggedOrdemId)
      if (!ordem) return

      // Determina o status_id baseado no status_descricao
      const statusIdMap: { [key: string]: string } = {
        "Agendado": "1",
        "Em Progresso": "2",
        "Concluido": "3",
        "Cancelado": "4",
      }

      const novoStatusId = statusIdMap[statusDestino]
      if (!novoStatusId) return

      // Atualiza na API
      await updateOrdemServicoStatus(draggedOrdemId, parseInt(novoStatusId))

      // Atualiza o estado local
      setOrdens(prevOrdens =>
        prevOrdens.map(o =>
          o.id === draggedOrdemId
            ? { ...o, status_descricao: statusDestino }
            : o
        )
      )

      setDraggedOrdemId(null)
    } catch (err) {
      console.error("Erro ao atualizar status:", err)
      setDraggedOrdemId(null)
    }
  }

  const getPriorityColor = (prioridade: string) => {
    const cores: { [key: string]: string } = {
      critica: "bg-red-500 text-white",
      alta: "bg-orange-500 text-white",
      media: "bg-yellow-500 text-white",
      baixa: "bg-blue-500 text-white",
    }
    return cores[prioridade] || "bg-gray-500 text-white"
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Quadro de Ordens</h1>
        <p className="text-muted-foreground">Gerencie suas ordens de serviço visualmente</p>
      </div>

      <div className="flex gap-4 items-end">
        <div className="flex-1 max-w-xs">
          <label className="text-sm font-medium block mb-2">Filtrar por Mês</label>
          <Input
            type="month"
            value={filtroMes}
            onChange={(e) => setFiltroMes(e.target.value)}
          />
        </div>
      </div>

      {loading && <p className="text-center text-muted-foreground">Carregando ordens...</p>}

      {!loading && ordens.length === 0 && (
        <p className="text-center text-muted-foreground">Nenhuma ordem encontrada para este mês</p>
      )}

      {!loading && ordens.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
          {colunas.map((coluna) => {
            const ordensColuna = ordens.filter((o) => o.status_descricao === coluna.titulo)
            return (
              <div key={coluna.status} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">{coluna.titulo}</h2>
                  <Badge variant="secondary">{ordensColuna.length}</Badge>
                </div>

                <div 
                  className={`rounded-lg p-4 min-h-[400px] ${coluna.cor}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, coluna.titulo)}
                >
                  <div className="space-y-3">
                    {ordensColuna.map((ordem) => (
                      <div
                        key={ordem.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, ordem.id)}
                        className="cursor-move"
                      >
                        <Link href={`/ordens/${ordem.id}`}>
                          <Card className="hover:shadow-md transition-shadow hover:bg-primary/5 opacity-100 hover:opacity-90">
                            <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-mono text-sm font-bold text-primary">{ordem.id}</span>
                              <Badge className={getPriorityColor(ordem.prioridade_descricao)}>{ordem.prioridade_descricao}</Badge>
                            </div>
                            <p className="text-sm font-medium mb-2 line-clamp-2">{ordem.descricao}</p>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>Cliente: {ordem.cliente_nome}</p>
                              {ordem.data_agendamento && (
                                <p>Agendado: {new Date(ordem.data_agendamento).toLocaleDateString("pt-BR")}</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                        </Link>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4 border-dashed bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Ordem
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
