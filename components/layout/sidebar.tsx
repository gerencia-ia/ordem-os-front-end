"use client"

import { Home, Kanban, List, Users, Package, Settings, HelpCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "kanban", label: "Kanban", icon: Kanban },
  { id: "orders", label: "Ordens de Serviço", icon: List },
  { id: "technicians", label: "Técnicos", icon: Users },
  { id: "clients", label: "Clientes", icon: Users },
  { id: "equipment", label: "Equipamentos", icon: Package },
]

const secondaryItems = [
  { id: "settings", label: "Configurações", icon: Settings },
  { id: "help", label: "Ajuda", icon: HelpCircle },
]

export default function Sidebar({
  currentView,
  onViewChange,
}: {
  currentView: string
  onViewChange: (view: string) => void
}) {
  return (
    <aside className="h-full flex flex-col bg-card">
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Menu</div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 px-2 py-4 lg:px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive ? "bg-primary text-primary-foreground shadow-md" : "text-foreground hover:bg-muted",
              )}
            >
              <Icon size={18} />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {isActive && <ChevronRight size={16} />}
            </button>
          )
        })}
      </nav>

      {/* Secondary Navigation */}
      <nav className="px-2 py-4 lg:px-4 border-t border-border space-y-1">
        {secondaryItems.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-foreground hover:bg-muted"
            >
              <Icon size={18} />
              <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 lg:p-6 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Usuário</p>
          <p>Dhiogo Silva</p>
          <p className="text-xs">Admin</p>
        </div>
      </div>
    </aside>
  )
}
