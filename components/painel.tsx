"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { AlertCircle, CheckCircle, Clock, DollarSign, ListChecks } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getOrdensServico } from "@/lib/api/ordem_servicos"
import type { OrdemServico } from "@/lib/tipos"

const CORES_STATUS = ["#F59E0B", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#06B6D4"]

function normalizar(valor?: string | null) {
  return (valor ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR")
}

function statusConcluido(ordem: OrdemServico) {
  return normalizar(ordem.status?.nome).includes("conclu")
}

function statusCancelado(ordem: OrdemServico) {
  return normalizar(ordem.status?.nome).includes("cancel")
}

function statusEmAndamento(ordem: OrdemServico) {
  const status = normalizar(ordem.status?.nome)
  return status.includes("progresso") || status.includes("andamento") || status.includes("execu")
}

function moeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function Painel() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [filtroMes, setFiltroMes] = useState(() => {
    const hoje = new Date()
    return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`
  })

  useEffect(() => {
    let ativo = true
    async function carregarOrdens() {
      setLoading(true)
      setErro(null)
      try {
        const [ano, mes] = filtroMes.split("-").map(Number)
        const dados = await getOrdensServico(mes, ano)
        if (ativo) setOrdens(dados)
      } catch (error) {
        if (ativo) setErro(error instanceof Error ? error.message : "Não foi possível carregar os dados do painel.")
      } finally {
        if (ativo) setLoading(false)
      }
    }
    carregarOrdens()
    return () => { ativo = false }
  }, [filtroMes])

  const dados = useMemo(() => {
    const concluidas = ordens.filter(statusConcluido)
    const emAndamento = ordens.filter(statusEmAndamento)
    const canceladas = ordens.filter(statusCancelado)
    const abertas = ordens.filter((ordem) => !statusConcluido(ordem) && !statusCancelado(ordem))
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const atrasadas = abertas.filter((ordem) => {
      if (!ordem.data_vencimento) return false
      const vencimento = new Date(`${ordem.data_vencimento.slice(0, 10)}T00:00:00`)
      return vencimento < hoje
    })

    const porStatus = new Map<string, number>()
    ordens.forEach((ordem) => {
      const nome = ordem.status?.nome || "Sem status"
      porStatus.set(nome, (porStatus.get(nome) ?? 0) + 1)
    })
    const status = Array.from(porStatus, ([name, value]) => ({ name, value }))

    const porPrioridade = new Map<string, number>()
    ordens.forEach((ordem) => {
      const nome = ordem.prioridade?.descricao || "Sem prioridade"
      porPrioridade.set(nome, (porPrioridade.get(nome) ?? 0) + 1)
    })
    const prioridades = Array.from(porPrioridade, ([nome, total]) => ({ nome, total }))

    const [ano, mes] = filtroMes.split("-").map(Number)
    const diasNoMes = new Date(ano, mes, 0).getDate()
    const tendencia = Array.from({ length: diasNoMes }, (_, indice) => {
      const dia = indice + 1
      const doDia = ordens.filter((ordem) => {
        if (!ordem.data_agendamento) return false
        const data = new Date(ordem.data_agendamento)
        return data.getFullYear() === ano && data.getMonth() + 1 === mes && data.getDate() === dia
      })
      return {
        dia: String(dia).padStart(2, "0"),
        ordens: doDia.length,
        concluidas: doDia.filter(statusConcluido).length,
      }
    })

    return {
      total: ordens.length,
      abertas: abertas.length,
      emAndamento: emAndamento.length,
      concluidas: concluidas.length,
      atrasadas: atrasadas.length,
      faturamentoConcluido: concluidas.reduce((total, ordem) => total + (Number(ordem.valor_total) || 0), 0),
      taxaConclusao: ordens.length ? Math.round((concluidas.length / ordens.length) * 100) : 0,
      status,
      prioridades,
      tendencia,
    }
  }, [ordens, filtroMes])

  const kpis = [
    { titulo: "Ordens no período", valor: dados.total, Icone: ListChecks, cor: "text-blue-500", fundo: "bg-blue-50 dark:bg-blue-950" },
    { titulo: "Em andamento", valor: dados.emAndamento, Icone: Clock, cor: "text-orange-500", fundo: "bg-orange-50 dark:bg-orange-950" },
    { titulo: "Concluídas", valor: `${dados.concluidas} (${dados.taxaConclusao}%)`, Icone: CheckCircle, cor: "text-green-500", fundo: "bg-green-50 dark:bg-green-950" },
    { titulo: "Faturamento concluído", valor: moeda(dados.faturamentoConcluido), Icone: DollarSign, cor: "text-purple-500", fundo: "bg-purple-50 dark:bg-purple-950" },
  ]

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Indicadores calculados a partir das ordens de serviço.</p>
        </div>
        <div className="w-full max-w-xs">
          <label className="text-sm font-medium block mb-2" htmlFor="filtro-mes">Período de agendamento</label>
          <Input id="filtro-mes" type="month" value={filtroMes} onChange={(event) => setFiltroMes(event.target.value)} />
        </div>
      </div>

      {loading && <p className="text-center text-muted-foreground">Carregando dados...</p>}
      {erro && <Card><CardContent className="pt-6 text-destructive">Erro ao carregar o painel: {erro}</CardContent></Card>}

      {!loading && !erro && <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map(({ titulo, valor, Icone, cor, fundo }) => (
            <Card key={titulo} className={fundo}>
              <CardContent className="pt-6 flex items-center justify-between gap-3">
                <div><p className="text-sm text-muted-foreground font-medium">{titulo}</p><p className="text-2xl font-bold mt-2">{valor}</p></div>
                <Icone className={`h-9 w-9 shrink-0 ${cor} opacity-70`} />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className={dados.atrasadas ? "border-orange-300" : ""}>
          <CardContent className="pt-5 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <span><strong>{dados.atrasadas}</strong> ordem(ns) em aberto com vencimento anterior a hoje.</span>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Ordens por status</CardTitle><CardDescription>Distribuição no período selecionado</CardDescription></CardHeader>
            <CardContent>
              {dados.status.length ? <ResponsiveContainer width="100%" height={280}>
                <PieChart><Pie data={dados.status} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                  {dados.status.map((item, indice) => <Cell key={item.name} fill={CORES_STATUS[indice % CORES_STATUS.length]} />)}
                </Pie><Tooltip /></PieChart>
              </ResponsiveContainer> : <p className="h-[280px] flex items-center justify-center text-muted-foreground">Sem ordens neste período.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ordens por prioridade</CardTitle><CardDescription>Volume por nível de prioridade</CardDescription></CardHeader>
            <CardContent>
              {dados.prioridades.length ? <ResponsiveContainer width="100%" height={280}>
                <BarChart data={dados.prioridades}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="nome" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="total" name="Ordens" fill="#8B5CF6" radius={[8, 8, 0, 0]} /></BarChart>
              </ResponsiveContainer> : <p className="h-[280px] flex items-center justify-center text-muted-foreground">Sem ordens neste período.</p>}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Agendamentos ao longo do mês</CardTitle><CardDescription>Ordens agendadas por dia e quantas foram concluídas</CardDescription></CardHeader>
          <CardContent><ResponsiveContainer width="100%" height={280}>
            <BarChart data={dados.tendencia}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="dia" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="ordens" name="Agendadas" fill="#3B82F6" /><Bar dataKey="concluidas" name="Concluídas" fill="#10B981" /></BarChart>
          </ResponsiveContainer></CardContent>
        </Card>
      </>}
    </div>
  )
}
