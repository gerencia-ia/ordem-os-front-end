"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Edit, Trash2, Plus, Clock, CheckCircle, PlayCircle } from "lucide-react"
import Link from "next/link"
import type { Servico, Tecnico, Tarefa } from "@/lib/tipos"
import { tenicosMock, clientesMock } from "@/lib/dados-mockados"
import {
  getOrdemServicoById,
  updateOrdemServicoStatus,
  updateLaudoEquipamento,
  updateHorarioAtendimento,
  addServicoOrdem,
  removeServicoOrdem,
  addTecnicoOrdem,
  removeTecnicoOrdem,
} from "@/lib/api/ordem_servicos"
import { getHistoricoLaudosEquipamento, type Laudo } from "@/lib/api/equipamentos"
import { getServicos } from "@/lib/api/servicos"
import { getTecnicos } from "@/lib/api/tecnicos"
import { apiPatch } from "@/lib/api/api"

// Opções de status disponíveis
const statusOptions = [
  { id: 1, label: "Agendado" },
  { id: 2, label: "Em Progresso" },
  { id: 3, label: "Concluído" },
  { id: 4, label: "Cancelado" },
  { id: 5, label: "Não Iniciada" },
  { id: 6, label: "Em Andamento" },
  { id: 7, label: "Bloqueada" },
]

type StatusSelectProps = {
  ordemId: number | string
  statusAtual: number
  onStatusChange: (novoStatusId: number) => void | Promise<void>
}

function StatusSelect({ ordemId, statusAtual, onStatusChange }: StatusSelectProps) {
  const [value, setValue] = useState(statusAtual)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setValue(statusAtual)
  }, [statusAtual])

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novoStatusId = Number(e.target.value)
    setLoading(true)
    setValue(novoStatusId)
    await onStatusChange(novoStatusId)
    setLoading(false)
  }

  return (
    <select
      className="border rounded px-2 py-1 text-sm"
      value={value}
      onChange={handleChange}
      disabled={loading}
    >
      {statusOptions.map((opt) => (
        <option key={opt.id} value={opt.id}>{opt.label}</option>
      ))}
    </select>
  )
}

interface DetalheOrdemProps {
  ordemId: string
}

export default function DetalheOrdem({ ordemId }: DetalheOrdemProps) {
  const router = useRouter()

  const [ordem, setOrdem] = useState<any>(null)
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [novaDescricao, setNovaDescricao] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roleUsuario, setRoleUsuario] = useState<string>("SECRETARIA")
  const [acaoLoading, setAcaoLoading] = useState(false)
  const [modalLaudoAberta, setModalLaudoAberta] = useState(false)
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<any>(null)
  const [textoLaudo, setTextoLaudo] = useState("")
  const [laudoSaving, setLaudoSaving] = useState(false)
  const [modalHistoricoAberta, setModalHistoricoAberta] = useState(false)
  const [laudosHistorico, setLaudosHistorico] = useState<Laudo[]>([])
  const [historicoLoading, setHistoricoLoading] = useState(false)
  const [modalServicoAberta, setModalServicoAberta] = useState(false)
  const [servicoIdInput, setServicoIdInput] = useState("")
  const [quantidadeInput, setQuantidadeInput] = useState<string>("")
  const [servicoSaving, setServicoSaving] = useState(false)
  const [remocaoLoadingId, setRemocaoLoadingId] = useState<number | string | null>(null)
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Servico[]>([])
  const [servicosLoading, setServicosLoading] = useState(false)
  const [tecnicosDisponiveis, setTecnicosDisponiveis] = useState<Tecnico[]>([])
  const [tecnicoLoading, setTecnicoLoading] = useState(false)
  const [tecnicoSaving, setTecnicoSaving] = useState(false)
  const [modalTecnicoAberta, setModalTecnicoAberta] = useState(false)
  const [tecnicoIdInput, setTecnicoIdInput] = useState("")
  const [modalFinalizarAberta, setModalFinalizarAberta] = useState(false)
  const [valorFinal, setValorFinal] = useState("")
  const [observacaoFinal, setObservacaoFinal] = useState("")
  const [finalizandoSalvo, setFinalizandoSalvo] = useState(false)

  useEffect(() => {
    async function fetchOrdem() {
      setLoading(true)
      setError(null)
      try {
        const data = await getOrdemServicoById(ordemId)
        setOrdem(data)
        setTarefas(data.tarefas || [])
      } catch (err: any) {
        setError(err.message || "Erro ao buscar ordem de serviço")
      } finally {
        setLoading(false)
      }
    }
    fetchOrdem()
    if (typeof window !== "undefined") {
      const roleSalva = localStorage.getItem("role")
      if (roleSalva === "1") setRoleUsuario("TECNICO")
      else if (roleSalva === "0") setRoleUsuario("SECRETARIA")
      else if (roleSalva) setRoleUsuario(roleSalva)
    }
  }, [ordemId])

  const atualizarStatus = async (novoStatusId: number) => {
    setAcaoLoading(true)
    await updateOrdemServicoStatus(ordem.id, novoStatusId)
    const data = await getOrdemServicoById(ordemId)
    setOrdem(data)
    setTarefas(data.tarefas || [])
    setAcaoLoading(false)
  }

  const abrirModalLaudo = (equip: any) => {
    setEquipamentoSelecionado(equip)
    setTextoLaudo("")
    setModalLaudoAberta(true)
  }

  const salvarLaudo = async () => {
    if (!equipamentoSelecionado || !textoLaudo.trim()) return
    setLaudoSaving(true)
    await updateLaudoEquipamento(ordem.id, equipamentoSelecionado.id, textoLaudo.trim())
    const data = await getOrdemServicoById(ordemId)
    setOrdem(data)
    setTarefas(data.tarefas || [])
    setLaudoSaving(false)
    setModalLaudoAberta(false)
  }

  const abrirModalHistorico = async (equip: any) => {
    setEquipamentoSelecionado(equip)
    setHistoricoLoading(true)
    try {
      const laudos = await getHistoricoLaudosEquipamento(equip.id)
      setLaudosHistorico(laudos)
    } catch (err) {
      console.error("Erro ao carregar histórico:", err)
      setLaudosHistorico([])
    } finally {
      setHistoricoLoading(false)
      setModalHistoricoAberta(true)
    }
  }

  const iniciarAtendimento = async () => {
    setAcaoLoading(true)
    const agora = new Date().toISOString()
    await updateHorarioAtendimento(ordem.id, agora, "")
    await atualizarStatus(2) // Status 6: Em Andamento
    setAcaoLoading(false)
  }

  const finalizarAtendimento = async () => {
    setValorFinal(ordem.valor_total || "")
    setObservacaoFinal(ordem.observacao || "")
    setModalFinalizarAberta(true)
  }

  const salvarFinalizacao = async () => {
    if (!valorFinal.trim()) return
    setFinalizandoSalvo(true)
    try {
      const agora = new Date().toISOString()
      const dataInicio = ordem.data_inicio_atendimento || new Date().toISOString()
      
      // Primeiro atualiza os horários, valor e observação
      await updateHorarioAtendimento(ordem.id, dataInicio, agora)
      
      // Depois atualiza valor_total e observacao via PATCH
      await apiPatch(`/ordem_servicos/${ordem.id}`, {
        ordem_servico: {
          valor_total: valorFinal,
          observacao: observacaoFinal,
        },
      })
      
      // Por último atualiza status
      await updateOrdemServicoStatus(ordem.id, 3) // Status 3: Concluído
      
      // Recarrega os dados
      const data = await getOrdemServicoById(ordemId)
      setOrdem(data)
      setTarefas(data.tarefas || [])
      
      setModalFinalizarAberta(false)
    } catch (err) {
      console.error("Erro ao finalizar:", err)
    } finally {
      setFinalizandoSalvo(false)
    }
  }

  const carregarServicos = async () => {
    setServicosLoading(true)
    try {
      const lista = await getServicos()
      setServicosDisponiveis(lista)
    } catch (err) {
      console.error("Erro ao carregar serviços:", err)
      setServicosDisponiveis([])
    } finally {
      setServicosLoading(false)
    }
  }

  const abrirModalAdicionarServico = () => {
    setServicoIdInput("")
    setQuantidadeInput("")
    if (servicosDisponiveis.length === 0) {
      void carregarServicos()
    }
    setModalServicoAberta(true)
  }

  const carregarTecnicos = async () => {
    setTecnicoLoading(true)
    try {
      const lista = await getTecnicos()
      setTecnicosDisponiveis(lista)
    } catch (err) {
      console.error("Erro ao carregar técnicos:", err)
      setTecnicosDisponiveis([])
    } finally {
      setTecnicoLoading(false)
    }
  }

  const abrirModalTecnico = () => {
    setTecnicoIdInput("")
    if (tecnicosDisponiveis.length === 0) {
      void carregarTecnicos()
    }
    setModalTecnicoAberta(true)
  }

  const salvarTecnico = async () => {
    if (!tecnicoIdInput.trim()) return
    setTecnicoSaving(true)
    await addTecnicoOrdem(ordem.id, tecnicoIdInput.trim())
    const data = await getOrdemServicoById(ordemId)
    setOrdem(data)
    setTarefas(data.tarefas || [])
    setTecnicoSaving(false)
    setModalTecnicoAberta(false)
  }

  const removerTecnico = async () => {
    setTecnicoSaving(true)
    await removeTecnicoOrdem(ordem.id, ordem.tecnico_responsavel?.id)
    const data = await getOrdemServicoById(ordemId)
    setOrdem(data)
    setTarefas(data.tarefas || [])
    setTecnicoSaving(false)
  }

  const salvarServico = async () => {
    if (!servicoIdInput.trim()) return
    setServicoSaving(true)
    const qtd = quantidadeInput === "" ? undefined : Number(quantidadeInput)
    await addServicoOrdem(ordem.id, servicoIdInput.trim(), qtd)
    const data = await getOrdemServicoById(ordemId)
    setOrdem(data)
    setTarefas(data.tarefas || [])
    setServicoSaving(false)
    setModalServicoAberta(false)
  }

  const removerServico = async (servicoId: number | string) => {
    setRemocaoLoadingId(servicoId)
    await removeServicoOrdem(ordem.id, servicoId)
    const data = await getOrdemServicoById(ordemId)
    setOrdem(data)
    setTarefas(data.tarefas || [])
    setRemocaoLoadingId(null)
  }

  const contatarCliente = () => {
    const numeroOriginal: string | undefined = ordem.cliente?.telefones.find(() => true)?.numero
    if (!numeroOriginal) return
    const digits = String(numeroOriginal).replace(/\D/g, "")
    if (!digits) return
    let phone = digits
    if (!phone.startsWith("55")) {
      if (phone.length <= 11) {
        phone = "55" + phone
      }
    }
    const url = `https://wa.me/${phone}`
    window.open(url, "_blank")
  }

  const tecnico = ordem ? tenicosMock.find((t) => t.id === ordem.tecnicoId) : null
  const taxaProgress = tarefas.length > 0 ? (tarefas.filter((t) => t.status === "concluida").length / tarefas.length) * 100 : 0

  const getBadgeStatus = (status: string) => {
    const cores: { [key: string]: string } = {
      pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
      em_progresso: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      concluido: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      cancelado: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
      nao_iniciada: "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200",
      em_andamento: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      concluida: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      bloqueada: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    }
    return cores[status] || "bg-gray-100 text-gray-800"
  }

  const getBadgePrioridade = (prioridade: string) => {
    const cores: { [key: string]: string } = {
      critica: "bg-red-500 text-white",
      alta: "bg-orange-500 text-white",
      media: "bg-yellow-500 text-white",
      baixa: "bg-blue-500 text-white",
    }
    return cores[prioridade] || ""
  }

  const adicionarTarefa = () => {
    if (novaDescricao.trim()) {
      const novaTarefa: Tarefa = {
        id: `tar-${Date.now()}`,
        descricao: novaDescricao,
        status: "nao_iniciada",
      }
      setTarefas([...tarefas, novaTarefa])
      setNovaDescricao("")
    }
  }

  const removerTarefa = (tarefaId: string) => {
    setTarefas(tarefas.filter((t) => t.id !== tarefaId))
  }

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }
  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }
  if (!ordem) {
    return <div className="p-6">Ordem de serviço não encontrada.</div>
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">OS Número: {ordem.id}</h1>
        </div>
        {roleUsuario === "TECNICO" && (
          <div className="flex flex-wrap gap-3 items-center">
            {ordem.status_id === 3 ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Atendimento Concluído</span>
              </div>
            ) : (
              <>
                {ordem.status_id !== 2 && ordem.status_id !== 6 && (
                  <Button
                    onClick={iniciarAtendimento}
                    disabled={acaoLoading}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Iniciar Atendimento
                  </Button>
                )}
                {(ordem.status_id === 2 || ordem.status_id === 6) && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">Atendimento Iniciado</span>
                  </div>
                )}
                {ordem.status_id !== 3 && (
                  <Button
                    variant="outline"
                    onClick={finalizarAtendimento}
                    disabled={acaoLoading}
                    className="inline-flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Finalizar Atendimento
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal - informações e tarefas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <StatusSelect
                      ordemId={ordem.id}
                      statusAtual={ordem.status_id}
                      onStatusChange={atualizarStatus}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Prioridade</label>
                  <div className="mt-1">
                    <Badge className={getBadgePrioridade(ordem.prioridade_descricao)}>{ordem.prioridade_descricao}</Badge>
                  </div>
                </div>
         
                <div>
                  <label className="text-sm text-muted-foreground">Data de Agendamento</label>
                  <p className="font-medium mt-1">{new Date(ordem.data_agendamento).toLocaleDateString("pt-BR")} {new Date(ordem.data_agendamento).toLocaleTimeString("pt-BR")}</p>
                </div>
               
              </div>


              {/* Descrição */}
              {ordem.descricao && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Descrição da Ordem:</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{ordem.descricao}</p>
                </div>
              )}

              {/* Custos */}
              {(ordem.custoEstimado || ordem.custoReal) && (
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Custo Estimado:</span>
                    <span className="font-medium">R$ {ordem.custoEstimado?.toFixed(2) || "-"}</span>
                  </div>
                  {ordem.custoReal && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Custo Real:</span>
                      <span className="font-medium">R$ {ordem.custoReal.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Notas */}
              {ordem.notas && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Notas:</p>
                  <p className="text-sm bg-muted p-3 rounded-lg">{ordem.notas}</p>
                </div>
              )}

              {/* Valor Total e Observações Finais */}
              {(ordem.status_id === 3 || ordem.valor_total || ordem.observacao) && (
                <div className="border-t pt-4 space-y-3">
                  {ordem.valor_total && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Valor Total Cobrado:</p>
                      <p className="text-lg font-bold text-green-600">
                        R$ {Number(ordem.valor_total).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}
                  {ordem.observacao && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Observações Finais:</p>
                      <p className="text-sm bg-muted p-3 rounded-lg">{ordem.observacao}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Serviços */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>Serviços</CardTitle>
                {ordem.status_id !== 3 && (
                  <Button size="sm" onClick={abrirModalAdicionarServico}>
                    Adicionar serviço
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ordem.servicos && ordem.servicos.length > 0 ? (
                <>
                  <ul className="space-y-2">
                    {ordem.servicos.map((servico: any) => (
                      <li key={servico.id} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                        <div>
                          <span className="font-medium">{servico.nome}</span>
                          {servico.quantidade ? (
                            <span className="ml-2 text-xs text-muted-foreground">x{servico.quantidade}</span>
                          ) : null}
                          {servico.tempo_servico && (
                            <div className="text-xs text-muted-foreground mt-1">Tempo: {servico.tempo_servico} min</div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            R$ {Number(servico.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                          {ordem.status_id !== 3 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => removerServico(servico.id)}
                              disabled={remocaoLoadingId === servico.id}
                            >
                              {remocaoLoadingId === servico.id ? "Removendo..." : "Remover"}
                            </Button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Totais */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tempo Total de Serviço:</span>
                      <span className="font-medium">
                        {(() => {
                          const tempoTotal = ordem.servicos.reduce((sum: number, s: any) => sum + (s.tempo_servico || 0), 0)
                          return tempoTotal > 0 ? `${tempoTotal} min` : "-"
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor Total dos Serviços:</span>
                      <span className="font-medium">
                        R$ {(() => {
                          const valorTotal = ordem.servicos.reduce((sum: number, s: any) => sum + Number(s.valor), 0)
                          return valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
                        })()}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum serviço relacionado.</p>
              )}
            </CardContent>
          </Card>

          {/* Equipamentos */}
          <Card>
            <CardHeader>
              <CardTitle>Equipamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ordem.equipamentos && ordem.equipamentos.length > 0 ? (
                <ul className="space-y-2">
                  {ordem.equipamentos.map((equip: any) => (
                    <li key={equip.id} className="border-b pb-2 last:border-b-0 last:pb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="font-medium">{equip.marca} ({equip.btus} BTUs)</div>
                          <div className="text-sm text-muted-foreground">Local: {equip.local_instalacao}</div>
                          <div className="mt-2">
                            <Button
                              variant="link"
                              size="sm"
                              className="px-0"
                              onClick={() => abrirModalHistorico(equip)}
                            >
                              Histórico do equipamento
                            </Button>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="whitespace-nowrap"
                          onClick={() => abrirModalLaudo(equip)}
                        >
                          Adicionar Laudo Técnico
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum equipamento relacionado.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral - informações de contato */}
        <div className="space-y-6">
          {/* Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{ordem.cliente?.nome || "Não informado"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-medium">{ordem.cliente?.telefones.find(() => true)?.numero || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
               <p className="font-medium text-sm">
                  {ordem.cliente?.enderecos?.[0]
                    ? `${ordem.cliente.enderecos[0].rua}, ${ordem.cliente.enderecos[0].numero} - ${ordem.cliente.enderecos[0].bairro}`
                    : "-"}
                </p>

              </div>
              <Button
                className="w-full mt-4"
                onClick={contatarCliente}
                disabled={!ordem.cliente?.telefones.find(() => true)?.numero}
              >
                Contatar Cliente
              </Button>
            </CardContent>
          </Card>

          {/* Técnico */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Técnico Responsável</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ordem.tecnico_responsavel ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Nome</p>
                    <p className="font-medium">{ordem.tecnico_responsavel.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{ordem.tecnico_responsavel.telefone}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={abrirModalTecnico} disabled={tecnicoSaving}>
                      Alterar técnico
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={removerTecnico}
                      disabled={tecnicoSaving}
                    >
                      Remover
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Nenhum técnico atribuído</p>
                  <Button size="sm" onClick={abrirModalTecnico} disabled={tecnicoSaving}>
                    Atribuir técnico
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Ordem aberta</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ordem.created_at).toLocaleDateString("pt-BR")} {new Date(ordem.created_at).toLocaleTimeString("pt-BR")}
                    </p>
                  </div>
                </div>
                {ordem.data_inicio_atendimento && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Atendimento iniciado</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ordem.data_inicio_atendimento).toLocaleDateString("pt-BR")} {new Date(ordem.data_inicio_atendimento).toLocaleTimeString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
                {ordem.data_fim_atendimento && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Atendimento finalizado</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ordem.data_fim_atendimento).toLocaleDateString("pt-BR")} {new Date(ordem.data_fim_atendimento).toLocaleTimeString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
                {ordem.dataFechamento && (
                  <div className="flex gap-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Ordem concluída</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(ordem.dataFechamento).toLocaleDateString("pt-BR")} {new Date(ordem.dataFechamento).toLocaleTimeString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de laudo técnico */}
      <AlertDialog open={modalLaudoAberta} onOpenChange={setModalLaudoAberta}>
        <AlertDialogContent>
          <AlertDialogTitle>Laudo técnico</AlertDialogTitle>
          <AlertDialogDescription>
            {equipamentoSelecionado ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">{equipamentoSelecionado.marca} ({equipamentoSelecionado.btus} BTUs)</p>
                <p className="text-sm text-muted-foreground">Local: {equipamentoSelecionado.local_instalacao}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Selecione um equipamento.</p>
            )}
          </AlertDialogDescription>
          <div className="mt-4 space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor="laudo-textarea">
              Descreva o laudo técnico
            </label>
            <textarea
              id="laudo-textarea"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              rows={5}
              value={textoLaudo}
              onChange={(e) => setTextoLaudo(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={salvarLaudo}
              disabled={!equipamentoSelecionado || !textoLaudo.trim() || laudoSaving}
            >
              {laudoSaving ? "Salvando..." : "Salvar laudo"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de adicionar serviço */}
      <AlertDialog open={modalServicoAberta} onOpenChange={setModalServicoAberta}>
        <AlertDialogContent>
          <AlertDialogTitle>Adicionar serviço</AlertDialogTitle>
          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="servico-id-input">Selecione o serviço</label>
              {servicosLoading ? (
                <p className="text-sm text-muted-foreground">Carregando serviços...</p>
              ) : servicosDisponiveis.length > 0 ? (
                <select
                  id="servico-id-input"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={servicoIdInput}
                  onChange={(e) => setServicoIdInput(e.target.value)}
                >
                  <option value="">Selecione um serviço</option>
                  {servicosDisponiveis.map((servico) => (
                    <option key={servico.id} value={String(servico.id)}>
                      {servico.nome} - R$ {Number(servico.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum serviço disponível.</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="quantidade-input">Quantidade (opcional)</label>
              <Input
                id="quantidade-input"
                type="number"
                min={1}
                placeholder="Ex: 2"
                value={quantidadeInput}
                onChange={(e) => setQuantidadeInput(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <AlertDialogCancel disabled={servicoSaving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={salvarServico}
              disabled={!servicoIdInput.trim() || servicoSaving || servicosLoading || servicosDisponiveis.length === 0}
            >
              {servicoSaving ? "Adicionando..." : "Adicionar"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de técnico responsável */}
      <AlertDialog open={modalTecnicoAberta} onOpenChange={setModalTecnicoAberta}>
        <AlertDialogContent>
          <AlertDialogTitle>Selecionar técnico</AlertDialogTitle>
          <div className="mt-4 space-y-3">
            {tecnicoLoading ? (
              <p className="text-sm text-muted-foreground">Carregando técnicos...</p>
            ) : tecnicosDisponiveis.length > 0 ? (
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={tecnicoIdInput}
                onChange={(e) => setTecnicoIdInput(e.target.value)}
              >
                <option value="">Selecione um técnico</option>
                {tecnicosDisponiveis.map((tecnico) => (
                  <option key={tecnico.id} value={String(tecnico.id)}>
                    {tecnico.nome} - {tecnico.telefone}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum técnico disponível.</p>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <AlertDialogCancel disabled={tecnicoSaving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={salvarTecnico}
              disabled={!tecnicoIdInput.trim() || tecnicoSaving || tecnicoLoading || tecnicosDisponiveis.length === 0}
            >
              {tecnicoSaving ? "Salvando..." : "Salvar"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de histórico de laudos */}
      <AlertDialog open={modalHistoricoAberta} onOpenChange={setModalHistoricoAberta}>
        <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <AlertDialogTitle>Histórico de laudos</AlertDialogTitle>
          <AlertDialogDescription>
            {equipamentoSelecionado && (
              <p className="text-sm font-medium mb-4">
                {equipamentoSelecionado.marca} ({equipamentoSelecionado.btus} BTUs) - {equipamentoSelecionado.local_instalacao}
              </p>
            )}
          </AlertDialogDescription>

          {historicoLoading ? (
            <div className="flex justify-center py-8">
              <p className="text-sm text-muted-foreground">Carregando histórico...</p>
            </div>
          ) : laudosHistorico.length > 0 ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Data</th>
                    <th className="text-left py-2 px-3">Laudo</th>
                    <th className="text-left py-2 px-3">OS</th>
                    <th className="text-left py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {laudosHistorico.map((laudo) => (
                    <tr key={laudo.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-3 text-xs">
                        {new Date(laudo.ordem_servico.data_fechamento).toLocaleDateString("pt-BR")} {new Date(laudo.ordem_servico.data_fechamento).toLocaleTimeString("pt-BR")}
                      </td>
                      <td className="py-2 px-3">
                        <p className="text-xs line-clamp-2">{laudo.laudo}</p>
                      </td>
                      <td className="py-2 px-3">
                        <div className="text-xs">
                          <p className="font-medium">{laudo.ordem_servico.id}</p>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <Badge variant="outline" className="text-xs">
                          {laudo.ordem_servico.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex justify-center py-8">
              <p className="text-sm text-muted-foreground">Nenhum laudo registrado para este equipamento.</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <AlertDialogCancel>Fechar</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de finalizar atendimento */}
      <AlertDialog open={modalFinalizarAberta} onOpenChange={setModalFinalizarAberta}>
        <AlertDialogContent>
          <AlertDialogTitle>Finalizar Atendimento</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha os dados finais do atendimento
          </AlertDialogDescription>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="valor-final-input">
                Valor Total Cobrado
              </label>
              <Input
                id="valor-final-input"
                type="number"
                step="0.01"
                placeholder="Ex: 250.00"
                value={valorFinal}
                onChange={(e) => setValorFinal(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="observacao-final-input">
                Observações Finais
              </label>
              <textarea
                id="observacao-final-input"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                rows={4}
                placeholder="Digite suas observações finais..."
                value={observacaoFinal}
                onChange={(e) => setObservacaoFinal(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <AlertDialogCancel disabled={finalizandoSalvo}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={salvarFinalizacao}
              disabled={!valorFinal.trim() || finalizandoSalvo}
            >
              {finalizandoSalvo ? "Finalizando..." : "Finalizar Atendimento"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

