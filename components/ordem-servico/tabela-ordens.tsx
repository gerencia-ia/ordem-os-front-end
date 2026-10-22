"use client"

import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Eye } from "lucide-react"

import type { OrdemServico, User } from "@/lib/tipos"

interface TabelaOrdensProps {
  ordens: OrdemServico[]
  loading: boolean
  onLimparFiltros: () => void
}

function normalizarTexto(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function getBadgeStatus(status: string) {
  const statusNormalizado = normalizarTexto(status)

  const cores: Record<string, string> = {
    aberta:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",

    "em andamento":
      "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",

    concluida:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",

    concluido:
      "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",

    cancelada:
      "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  }

  return cores[statusNormalizado] || ""
}

function getBadgePrioridade(prioridade: string) {
  const prioridadeNormalizada =
    normalizarTexto(prioridade)

  const cores: Record<string, string> = {
    critica: "bg-red-500 text-white",
    alta: "bg-orange-500 text-white",
    media: "bg-yellow-500 text-white",
    baixa: "bg-blue-500 text-white",
  }

  return cores[prioridadeNormalizada] || ""
}

export function TabelaOrdens({
  ordens,
  loading,
  onLimparFiltros,
}: TabelaOrdensProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Total: {ordens.length} ordens
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            Carregando ordens de serviço...
          </div>
        ) : ordens.length === 0 ? (
          <div className="py-4">
            <NaoEncontradoWrapper
              onLimparFiltros={onLimparFiltros}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Agendamento</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {ordens.map((ordem) => (
                  <TableRow key={ordem.id}>

                    {/* Número */}
                    <TableCell className="font-mono font-bold text-primary">
                      {ordem.numero_ordem}
                    </TableCell>

                    {/* Agendamento */}
                    <TableCell>
                      {ordem.data_agendamento
                        ? new Date(
                            ordem.data_agendamento
                          ).toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : "-"}
                    </TableCell>

                    {/* Cliente */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {ordem.cliente?.nome ?? "-"}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {ordem.cliente?.telefones?.[0]
                            ?.numero ?? "-"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        className={getBadgeStatus(
                          ordem.status?.nome ?? ""
                        )}
                      >
                        {ordem.status?.nome ?? "-"}
                      </Badge>
                    </TableCell>

                    {/* Prioridade */}
                    <TableCell>
                      <Badge
                        className={getBadgePrioridade(
                          ordem.prioridade?.nome ?? ""
                        )}
                      >
                        {ordem.prioridade?.nome ?? "-"}
                      </Badge>
                    </TableCell>

                    {/* Técnicos */}
                    <TableCell>
                      {obterNomesTecnicos(ordem.tecnicos)}
                    </TableCell>

                    {/* Ações */}
                    <TableCell>
                      <Link href={`/ordens/${ordem.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                      </Link>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function NaoEncontradoWrapper({
  onLimparFiltros,
}: {
  onLimparFiltros: () => void
}) {
  // ajuste o import conforme sua estrutura
  return (
    <div className="text-center py-6">
      <p className="font-medium">
        Nenhuma ordem encontrada
      </p>

      <p className="text-sm text-muted-foreground">
        Ajuste seus filtros de busca e tente novamente.
      </p>

      <Button
        variant="outline"
        className="mt-4"
        onClick={onLimparFiltros}
      >
        Limpar Filtros
      </Button>
    </div>
  )
}

function obterNomesTecnicos(
  tecnicos: User[] | User | null | undefined
) {
  if (!tecnicos) {
    return "-"
  }

  const lista = Array.isArray(tecnicos)
    ? tecnicos
    : [tecnicos]

  return lista
    .map((tecnico) => tecnico.nome)
    .filter(Boolean)
    .join(", ") || "-"
}