"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Zap, CheckCircle, Clock, AlertCircle } from "lucide-react"

const dashboardData = {
  totalOrders: 142,
  completedToday: 12,
  inProgress: 8,
  pending: 24,
  revenue: "R$ 18.540",

  ordersTrend: [
    { name: "Seg", orders: 12, completed: 8 },
    { name: "Ter", orders: 19, completed: 14 },
    { name: "Qua", orders: 15, completed: 11 },
    { name: "Qui", orders: 22, completed: 18 },
    { name: "Sex", orders: 18, completed: 16 },
    { name: "Sáb", orders: 14, completed: 10 },
    { name: "Dom", orders: 10, completed: 8 },
  ],

  statusDistribution: [
    { name: "Concluído", value: 85, color: "#22c55e" },
    { name: "Em Progresso", value: 35, color: "#8b5cf6" },
    { name: "Agendado", value: 22, color: "#f59e0b" },
  ],
}

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground text-pretty">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground mt-1">Aqui está um resumo das suas ordens de serviço</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border border-border hover:border-primary/50 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Ordens</p>
              <p className="text-2xl font-bold text-foreground mt-2">{dashboardData.totalOrders}</p>
              <p className="text-xs text-muted-foreground mt-2">+5 esta semana</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Zap size={24} className="text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border hover:border-primary/50 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Concluídas Hoje</p>
              <p className="text-2xl font-bold text-foreground mt-2">{dashboardData.completedToday}</p>
              <p className="text-xs text-muted-foreground mt-2">100% da meta</p>
            </div>
            <div className="w-12 h-12 bg-green-100/50 dark:bg-green-950/30 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border hover:border-primary/50 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Em Progresso</p>
              <p className="text-2xl font-bold text-foreground mt-2">{dashboardData.inProgress}</p>
              <p className="text-xs text-muted-foreground mt-2">3 críticas</p>
            </div>
            <div className="w-12 h-12 bg-purple-100/50 dark:bg-purple-950/30 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border hover:border-primary/50 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Receita Semana</p>
              <p className="text-2xl font-bold text-foreground mt-2">{dashboardData.revenue}</p>
              <p className="text-xs text-muted-foreground mt-2">+12% vs. última</p>
            </div>
            <div className="w-12 h-12 bg-blue-100/50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
              <AlertCircle size={24} className="text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Tendência de Ordens</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.ordersTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: "var(--primary)", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-3)", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">Distribuição</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dashboardData.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
