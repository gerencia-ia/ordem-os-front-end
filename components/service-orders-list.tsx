"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Filter, ChevronRight, FileText } from "lucide-react"
import ServiceOrderDetail from "./service-order-detail"

interface ServiceOrder {
  id: string
  number: string
  client: string
  equipment: string
  technician: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high"
  createdDate: string
  dueDate: string
  description: string
  tasks: Array<{ id: string; title: string; completed: boolean }>
}

const mockOrders: ServiceOrder[] = [
  {
    id: "1",
    number: "OS-2024-001",
    client: "Empresa Tech Ltda",
    equipment: "Servidor Dell R750",
    technician: "João Silva",
    status: "in_progress",
    priority: "high",
    createdDate: "2024-11-01",
    dueDate: "2024-11-06",
    description: "Manutenção preventiva e atualização de firmware",
    tasks: [
      { id: "1", title: "Diagnóstico inicial", completed: true },
      { id: "2", title: "Limpeza de componentes", completed: true },
      { id: "3", title: "Atualização de firmware", completed: false },
      { id: "4", title: "Testes de carga", completed: false },
    ],
  },
  {
    id: "2",
    number: "OS-2024-002",
    client: "Industrial Solutions",
    equipment: "Bomba de Ar Condicionado",
    technician: "Unassigned",
    status: "pending",
    priority: "medium",
    createdDate: "2024-11-02",
    dueDate: "2024-11-07",
    description: "Reparação de vazamento e recarga de gás",
    tasks: [
      { id: "1", title: "Inspeção visual", completed: false },
      { id: "2", title: "Teste de pressão", completed: false },
      { id: "3", title: "Reparação de vazamento", completed: false },
    ],
  },
  {
    id: "3",
    number: "OS-2024-003",
    client: "Banco Fácil",
    equipment: "Switch Cisco 4500",
    technician: "Maria Santos",
    status: "in_progress",
    priority: "high",
    createdDate: "2024-10-31",
    dueDate: "2024-11-05",
    description: "Configuração de VLANs e otimização de rede",
    tasks: [
      { id: "1", title: "Backup de configuração", completed: true },
      { id: "2", title: "Configuração de VLANs", completed: true },
      { id: "3", title: "Testes de conectividade", completed: true },
      { id: "4", title: "Documentação", completed: false },
    ],
  },
  {
    id: "4",
    number: "OS-2024-004",
    client: "Logística Express",
    equipment: "Impressora HP LaserJet",
    technician: "Pedro Costa",
    status: "completed",
    priority: "low",
    createdDate: "2024-10-28",
    dueDate: "2024-11-02",
    description: "Limpeza e substituição de toner",
    tasks: [
      { id: "1", title: "Limpeza de componentes", completed: true },
      { id: "2", title: "Substituição de toner", completed: true },
      { id: "3", title: "Teste de impressão", completed: true },
    ],
  },
]

const statusConfig = {
  pending: {
    label: "Agendado",
    color: "bg-yellow-100 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  in_progress: {
    label: "Em Progresso",
    color: "bg-purple-100 dark:bg-purple-950",
    text: "text-purple-700 dark:text-purple-300",
  },
  completed: {
    label: "Concluído",
    color: "bg-green-100 dark:bg-green-950",
    text: "text-green-700 dark:text-green-300",
  },
  cancelled: { label: "Cancelado", color: "bg-red-100 dark:bg-red-950", text: "text-red-700 dark:text-red-300" },
}

const priorityConfig = {
  low: { label: "Baixa", color: "text-blue-600 dark:text-blue-400" },
  medium: { label: "Média", color: "text-yellow-600 dark:text-yellow-400" },
  high: { label: "Alta", color: "text-red-600 dark:text-red-400" },
}

export default function ServiceOrdersList() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null)

  const filteredOrders = orders.filter(
    (order) =>
      order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.equipment.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (selectedOrder) {
    return <ServiceOrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ordens de Serviço</h1>
          <p className="text-muted-foreground mt-1">Gerencie todas as suas ordens em um só lugar</p>
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-primary-foreground">
          <Plus size={18} className="mr-2" />
          Nova Ordem
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por número, cliente ou equipamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button variant="outline" className="border-border bg-transparent">
          <Filter size={18} className="mr-2" />
          Filtrar
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Card
              key={order.id}
              className="p-4 border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-foreground">{order.number}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${statusConfig[order.status].color} ${statusConfig[order.status].text}`}
                      >
                        {statusConfig[order.status].label}
                      </span>
                      <span className={`text-xs font-medium ${priorityConfig[order.priority].color}`}>
                        ● {priorityConfig[order.priority].label}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">
                      {order.client} • {order.equipment}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Técnico: {order.technician} • Até {new Date(order.dueDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border border-border border-dashed">
            <p className="text-muted-foreground">Nenhuma ordem encontrada</p>
          </Card>
        )}
      </div>
    </div>
  )
}
