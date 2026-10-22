"use client"

import { Search } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { User } from "@/lib/tipos"

interface FiltrosOrdensProps {
  busca: string
  filtroStatus: string
  filtroDataAgendamento: string
  filtroTecnico: string

  tecnicos: User[]

  onBuscaChange: (value: string) => void
  onStatusChange: (value: string) => void
  onDataChange: (value: string) => void
  onTecnicoChange: (value: string) => void
}

export function FiltrosOrdens({
  busca,
  filtroStatus,
  filtroDataAgendamento,
  filtroTecnico,
  tecnicos,
  onBuscaChange,
  onStatusChange,
  onDataChange,
  onTecnicoChange,
}: FiltrosOrdensProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Busca */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Buscar por nome do cliente ou telefone..."
              value={busca}
              onChange={(e) => onBuscaChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status */}
          <Select
            value={filtroStatus}
            onValueChange={onStatusChange}
          >
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="todos">
                Todos os Status
              </SelectItem>

              <SelectItem value="Aberta">
                Aberta
              </SelectItem>

              <SelectItem value="Em andamento">
                Em andamento
              </SelectItem>

              <SelectItem value="Concluída">
                Concluída
              </SelectItem>

              <SelectItem value="Cancelada">
                Cancelada
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Data */}
          <div className="flex-1">
            <Input
              type="date"
              value={filtroDataAgendamento}
              onChange={(e) =>
                onDataChange(e.target.value)
              }
            />
          </div>

          {/* Técnico */}
          <Select
            value={filtroTecnico}
            onValueChange={onTecnicoChange}
          >
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue placeholder="Técnico" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="todos">
                Todos os Técnicos
              </SelectItem>

              {tecnicos.map((tecnico) => (
                <SelectItem
                  key={tecnico.id}
                  value={String(tecnico.id)}
                >
                  {tecnico.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}