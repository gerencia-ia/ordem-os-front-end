"use client"

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
import { dashboardMock } from "@/lib/dados-mockados"
import { TrendingUp, Clock, DollarSign, CheckCircle } from "lucide-react"
import AlertaManutencaoClientes from "@/components/alerta-manutencao-clientes"

const dadosGrafico = [
  { data: "1 Nov", completas: 2, emProgresso: 1, pendentes: 3 },
  { data: "2 Nov", completas: 3, emProgresso: 2, pendentes: 2 },
  { data: "3 Nov", completas: 4, emProgresso: 2, pendentes: 1 },
  { data: "4 Nov", completas: 5, emProgresso: 3, pendentes: 1 },
  { data: "5 Nov", completas: 6, emProgresso: 2, pendentes: 2 },
]

const dadosPie = [
  { name: "Concluídas", value: 35 },
  { name: "Em Progresso", value: 40 },
  { name: "Pendentes", value: 20 },
  { name: "Canceladas", value: 5 },
]

const CORES = ["#0D9488", "#0EA5E9", "#F59E0B", "#EF4444"]

export default function Painel() {
  const dashboard = dashboardMock

  const kpis = [
    {
      titulo: "Total de Ordens",
      valor: dashboard.totalOrdens,
      icon: CheckCircle,
      cor: "text-primary",
    },
    {
      titulo: "Em Progresso",
      valor: dashboard.ordensEmProgresso,
      icon: Clock,
      cor: "text-blue-500",
    },
    {
      titulo: "Custo do Dia",
      valor: `R$ ${dashboard.custoDia}`,
      icon: DollarSign,
      cor: "text-green-500",
    },
    {
      titulo: "Taxa de Conclusão",
      valor: `${dashboard.taxaConclusao}%`,
      icon: TrendingUp,
      cor: "text-orange-500",
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{kpi.titulo}</p>
                    <p className="text-2xl font-bold mt-2">{kpi.valor}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${kpi.cor} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Alerta de Manutenção de Clientes */}
      <AlertaManutencaoClientes />

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Linhas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tendência de Ordens</CardTitle>
            <CardDescription>Últimos 5 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosGrafico}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completas" stroke="#0D9488" strokeWidth={2} />
                <Line type="monotone" dataKey="emProgresso" stroke="#0EA5E9" strokeWidth={2} />
                <Line type="monotone" dataKey="pendentes" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Pizza */}
        <Card>
          <CardHeader>
            <CardTitle>Status das Ordens</CardTitle>
            <CardDescription>Distribuição geral</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dadosPie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Barras */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição por Tipo de Serviço</CardTitle>
          <CardDescription>Volume de ordens por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { tipo: "Manutenção", total: 12 },
                { tipo: "Reparo", total: 8 },
                { tipo: "Instalação", total: 5 },
                { tipo: "Diagnóstico", total: 3 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#0D9488" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
