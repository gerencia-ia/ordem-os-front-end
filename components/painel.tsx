"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TrendingUp, Clock, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import { getOrdensServico } from "@/lib/api/ordem_servicos"
import type { OrdemServico } from "@/lib/tipos"

export default function Painel() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [loading, setLoading] = useState(false)
  const [filtroMes, setFiltroMes] = useState<string>(() => {
    const hoje = new Date()
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`
  })

  useEffect(() => {
    async function fetchOrdens() {
      try {
        setLoading(true)
        const [ano, mes] = filtroMes.split("-")
        const data = await getOrdensServico(parseInt(mes), parseInt(ano))
        setOrdens(data)
      } catch (err) {
        console.error("Erro ao carregar ordens:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrdens()
  }, [filtroMes])

  // Calcula métricas
  const metricas = {
    total: ordens.length,
    agendadas: ordens.filter(o => o.status_descricao === "Agendado").length,
    emProgresso: ordens.filter(o => o.status_descricao === "Em Progresso").length,
    concluidas: ordens.filter(o => o.status_descricao === "Concluido").length,
    canceladas: ordens.filter(o => o.status_descricao === "Cancelado").length,
    valorTotal: ordens.reduce((sum, o) => sum + (Number(o.valor_total) || 0), 0),
    taxaConclusao: ordens.length > 0 ? Math.round((ordens.filter(o => o.status_descricao === "Concluido").length / ordens.length) * 100) : 0,
  }

  // Dados para gráfico de pizza
  const dadosStatusPie = [
    { name: "Agendadas", value: metricas.agendadas },
    { name: "Em Progresso", value: metricas.emProgresso },
    { name: "Concluídas", value: metricas.concluidas },
    { name: "Canceladas", value: metricas.canceladas },
  ].filter(item => item.value > 0)

  const CORES = ["#F59E0B", "#3B82F6", "#10B981", "#EF4444"]

  // Dados para gráfico de barras por prioridade
  const dadosPrioridade = [
    {
      nome: "Crítica",
      total: ordens.filter(o => o.prioridade_descricao === "critica").length,
    },
    {
      nome: "Alta",
      total: ordens.filter(o => o.prioridade_descricao === "alta").length,
    },
    {
      nome: "Média",
      total: ordens.filter(o => o.prioridade_descricao === "media").length,
    },
    {
      nome: "Baixa",
      total: ordens.filter(o => o.prioridade_descricao === "baixa").length,
    },
  ]

  // Dados para comparação de status ao longo do mês
  const dadosTendencia = [
    {
      status: "Agendadas",
      quantidade: metricas.agendadas,
    },
    {
      status: "Em Progresso",
      quantidade: metricas.emProgresso,
    },
    {
      status: "Concluídas",
      quantidade: metricas.concluidas,
    },
  ]

  const kpis = [
    {
      titulo: "Total de Ordens",
      valor: metricas.total,
      icon: CheckCircle,
      cor: "text-blue-500",
      bgCor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      titulo: "Em Progresso",
      valor: metricas.emProgresso,
      icon: Clock,
      cor: "text-orange-500",
      bgCor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      titulo: "Concluídas",
      valor: metricas.concluidas,
      icon: CheckCircle,
      cor: "text-green-500",
      bgCor: "bg-green-50 dark:bg-green-950",
    },
    {
      titulo: "Taxa de Conclusão",
      valor: `${metricas.taxaConclusao}%`,
      icon: TrendingUp,
      cor: "text-purple-500",
      bgCor: "bg-purple-50 dark:bg-purple-950",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-muted-foreground">Acompanhamento de procedimentos e atividades</p>
      </div>

      {/* Filtro de Mês */}
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

      {loading && <p className="text-center text-muted-foreground">Carregando dados...</p>}

      {!loading && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon
              return (
                <Card key={idx} className={`${kpi.bgCor} hover:shadow-lg transition-shadow`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{kpi.titulo}</p>
                        <p className="text-3xl font-bold mt-2">{kpi.valor}</p>
                      </div>
                      <Icon className={`h-10 w-10 ${kpi.cor} opacity-60`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Status das Ordens e Prioridades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pizza - Distribuição por Status */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
                <CardDescription>Status das ordens do mês</CardDescription>
              </CardHeader>
              <CardContent>
                {dadosStatusPie.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={dadosStatusPie}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosStatusPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                    Sem dados para este período
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Barras - Distribuição por Prioridade */}
            <Card>
              <CardHeader>
                <CardTitle>Ordens por Prioridade</CardTitle>
                <CardDescription>Volume de ordens por nível de prioridade</CardDescription>
              </CardHeader>
              <CardContent>
                {dadosPrioridade.some(item => item.total > 0) ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={dadosPrioridade}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nome" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="total" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                    Sem dados para este período
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
       
          {/* Resumo de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Agendadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{metricas.agendadas}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {metricas.total > 0 
                    ? `${Math.round((metricas.agendadas / metricas.total) * 100)}% do total`
                    : "Sem ordens"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  Em Progresso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{metricas.emProgresso}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {metricas.total > 0 
                    ? `${Math.round((metricas.emProgresso / metricas.total) * 100)}% do total`
                    : "Sem ordens"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Valor Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  R$ {metricas.valorTotal.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ordens concluídas e em progresso
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
