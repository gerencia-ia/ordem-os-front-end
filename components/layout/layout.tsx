"use client"

import type React from "react"

import { useState } from "react"
import { Menu, X, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Sidebar from "./sidebar"

export default function Layout({
  children,
  currentView,
  onViewChange,
}: {
  children: React.ReactNode
  currentView: string
  onViewChange: (view: any) => void
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 w-64 bg-card border-r border-border transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:border-r
      `}
      >
        <Sidebar currentView={currentView} onViewChange={onViewChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">OS</span>
            </div>
            <h1 className="text-xl font-bold text-foreground hidden lg:block">Ordem de Serviço</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <Settings size={18} />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
