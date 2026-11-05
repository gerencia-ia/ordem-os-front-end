'use client';

import { useState } from 'react';
import { Card } from '@/src/components/ui/card';
import { Plus, GripVertical } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

interface ServiceOrder {
  id: string;
  number: string;
  client: string;
  equipment: string;
  technician: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

const initialOrders = {
  pending: [
    {
      id: '1',
      number: 'OS-2024-001',
      client: 'Empresa Tech Ltda',
      equipment: 'Servidor Dell R750',
      technician: 'João Silva',
      priority: 'high' as const,
      dueDate: '2024-11-06',
    },
    {
      id: '2',
      number: 'OS-2024-002',
      client: 'Industrial Solutions',
      equipment: 'Bomba de Ar Condicionado',
      technician: 'Unassigned',
      priority: 'medium' as const,
      dueDate: '2024-11-07',
    },
  ],
  inProgress: [
    {
      id: '3',
      number: 'OS-2024-003',
      client: 'Banco Fácil',
      equipment: 'Switch Cisco 4500',
      technician: 'Maria Santos',
      priority: 'high' as const,
      dueDate: '2024-11-05',
    },
    {
      id: '4',
      number: 'OS-2024-004',
      client: 'Logística Express',
      equipment: 'Impressora HP LaserJet',
      technician: 'Pedro Costa',
      priority: 'low' as const,
      dueDate: '2024-11-08',
    },
  ],
  completed: [
    {
      id: '5',
      number: 'OS-2024-005',
      client: 'Varejo Maxxi',
      equipment: 'Monitor Samsung 27"',
      technician: 'Ana Paula',
      priority: 'low' as const,
      dueDate: '2024-11-04',
    },
  ],
};

const priorityConfig = {
  low: {
    label: 'Baixa',
    bg: 'bg-blue-100 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
  },
  medium: {
    label: 'Média',
    bg: 'bg-yellow-100 dark:bg-yellow-950',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  high: {
    label: 'Alta',
    bg: 'bg-red-100 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
  },
};

function OrderCard({ order }: { order: ServiceOrder }) {
  return (
    <Card className="p-4 bg-card hover:shadow-md transition-all duration-200 cursor-move group border border-border">
      <div className="flex items-start gap-3">
        <GripVertical
          size={16}
          className="text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
        />
        <div className="flex-1">
          <p className="font-semibold text-foreground text-sm">
            {order.number}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{order.client}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {order.equipment}
          </p>

          <div className="flex items-center gap-2 mt-3">
            <span
              className={`text-xs px-2 py-1 rounded ${priorityConfig[order.priority].bg} ${priorityConfig[order.priority].text}`}
            >
              {priorityConfig[order.priority].label}
            </span>
            <span className="text-xs text-muted-foreground">
              {order.technician}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Até {new Date(order.dueDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    </Card>
  );
}

function KanbanColumn({
  title,
  orders,
}: {
  status?: string;
  title: string;
  orders: ServiceOrder[];
}) {
  return (
    <div className="flex-1 min-w-0 bg-muted/30 rounded-lg p-4 border border-border animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs font-medium">
            {orders.length}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      <Button
        variant="ghost"
        className="w-full text-primary hover:bg-primary/5"
        size="sm"
      >
        <Plus size={16} className="mr-2" />
        Adicionar
      </Button>
    </div>
  );
}

export default function KanbanBoard() {
  const [orders] = useState(initialOrders);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Kanban - Ordens de Serviço
        </h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas ordens arrastando-as entre os status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
        <KanbanColumn
          status="pending"
          title="A Fazer"
          orders={orders.pending}
        />
        <KanbanColumn
          status="inProgress"
          title="Em Progresso"
          orders={orders.inProgress}
        />
        <KanbanColumn
          status="completed"
          title="Concluído"
          orders={orders.completed}
        />
      </div>
    </div>
  );
}
