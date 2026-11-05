'use client';

import {
  ArrowLeft,
  Clock,
  User,
  Package,
  Calendar,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ServiceOrderDetailProps {
  order: {
    id: string;
    number: string;
    client: string;
    equipment: string;
    technician: string;
    status: string;
    priority: string;
    createdDate: string;
    dueDate: string;
    description: string;
    tasks: Array<{ id: string; title: string; completed: boolean }>;
  };
  onBack: () => void;
}

export default function ServiceOrderDetail({
  order,
  onBack,
}: ServiceOrderDetailProps) {
  const completedTasks = order.tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{order.number}</h1>
          <p className="text-muted-foreground">{order.client}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Descrição
            </h2>
            <p className="text-foreground leading-relaxed">
              {order.description}
            </p>
          </Card>

          {/* Tasks */}
          <Card className="p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Tarefas</h2>
              <span className="text-sm text-muted-foreground">
                {completedTasks} de {order.tasks.length} concluídas
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 mb-6">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(completedTasks / order.tasks.length) * 100}%`,
                }}
              />
            </div>

            {/* Tasks List */}
            <div className="space-y-3">
              {order.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {task.completed ? (
                    <CheckCircle2
                      size={20}
                      className="text-green-600 dark:text-green-400"
                    />
                  ) : (
                    <Circle size={20} className="text-muted-foreground" />
                  )}
                  <span
                    className={
                      task.completed
                        ? 'line-through text-muted-foreground'
                        : 'text-foreground'
                    }
                  >
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status Card */}
          <Card className="p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
              Status
            </p>
            <div className="w-full px-4 py-2 bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg font-medium text-center">
              Em Progresso
            </div>
          </Card>

          {/* Details Cards */}
          <Card className="p-4 border border-border">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Técnico Responsável
                </p>
                <p className="text-foreground font-medium mt-1">
                  {order.technician}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Equipamento
                </p>
                <p className="text-foreground font-medium mt-1 text-sm">
                  {order.equipment}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Vencimento
                </p>
                <p className="text-foreground font-medium mt-1 text-sm">
                  {new Date(order.dueDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border border-border">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Criada em
                </p>
                <p className="text-foreground font-medium mt-1 text-sm">
                  {new Date(order.createdDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4">
            <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground">
              Editar Ordem
            </Button>
            <Button
              variant="outline"
              className="w-full border-border bg-transparent"
            >
              Mais Opções
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
