"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getClientes } from "@/lib/api/clientes"
import { getTecnicos } from "@/lib/api/tecnicos"
import { getEquipamentosByCliente, createEquipamento } from "@/lib/api/equipamentos"
import { getServicos } from "@/lib/api/servicos"
import { getStatus } from "@/lib/api/status"
import { getPrioridades } from "@/lib/api/prioridades"
import type { OrdemServico, Cliente, Tecnico, Equipamento, Servico } from "@/lib/tipos"
import { createOrdemServico, getOrdensServico } from "@/lib/api/ordem_servicos"
import { Search, Eye, Plus, Check, ChevronsUpDown, ExternalLink } from "lucide-react"
import { NaoEncontrado } from "./nao-encontrado"
import { cn } from "@/lib/utils"

export default function ListaOrdens() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [loadingOrdens, setLoadingOrdens] = useState(false)
    // Carregar ordens, clientes e técnicos ao montar
    useEffect(() => {
      async function fetchInitialData() {
        setLoadingOrdens(true)
        try {
          const [ordensData, clientesData, tecnicosData] = await Promise.all([
            getOrdensServico(),
            getClientes(),
            getTecnicos(),
          ])
          setOrdens(ordensData)
          setClientes(clientesData)
          setTecnicos(tecnicosData)
        } catch (err) {
          console.error("Erro ao carregar dados:", err)
        } finally {
          setLoadingOrdens(false)
        }
      }
      fetchInitialData()
    }, [])
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroDataAgendamento, setFiltroDataAgendamento] = useState("")
  const [filtroTecnico, setFiltroTecnico] = useState("todos")
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Estado para clientes
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loadingClientes, setLoadingClientes] = useState(false)
  const [openClienteCombo, setOpenClienteCombo] = useState(false)

  // Estado para técnicos
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [loadingTecnicos, setLoadingTecnicos] = useState(false)
  const [openTecnicoCombo, setOpenTecnicoCombo] = useState(false)

  // Estado para equipamentos
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(false)
  const [openEquipamentoCombo, setOpenEquipamentoCombo] = useState(false)

  // Estado para serviços
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loadingServicos, setLoadingServicos] = useState(false)
  const [openServicoCombo, setOpenServicoCombo] = useState(false)

  // Estado para status
  const [statusList, setStatusList] = useState<{ id: string; nome: string }[]>([])
  const [loadingStatus, setLoadingStatus] = useState(false)
  // Estado para prioridades
  const [prioridadesList, setPrioridadesList] = useState<{ id: string; nome: string }[]>([])
  const [loadingPrioridades, setLoadingPrioridades] = useState(false)

  // Modal de Equipamento
  const [openEquipModal, setOpenEquipModal] = useState(false)
  const [savingEquip, setSavingEquip] = useState(false)
  const [novoEquipamento, setNovoEquipamento] = useState({
    marca: "",
    modelo: "",
    numeroSerie: "",
    capacidade: "",
    observacao: "",
    clienteId: "", // vinculando ao cliente selecionado
  })

  const [novaOrdem, setNovaOrdem] = useState({
    clienteId: "",
    tecnicoIds: [] as string[],
    equipamentoId: "",
    servicoIds: [] as string[],
    descricao: "",
    prioridade: "" as string, // agora armazena o id
    status: "" as string, // agora armazena o id
    dataAgendamento: "",
    custoEstimado: "",
    notas: "",
  })

  // Carregar dados ao abrir o dialog
  useEffect(() => {
    if (open) {
      if (clientes.length === 0) fetchClientes()
      if (tecnicos.length === 0) fetchTecnicos()
      if (servicos.length === 0) fetchServicos()
      if (statusList.length === 0) fetchStatus()
      if (prioridadesList.length === 0) fetchPrioridades()
    }
  }, [open])

  const fetchPrioridades = async () => {
    try {
      setLoadingPrioridades(true)
      const data = await getPrioridades()
      setPrioridadesList(data)
    } catch (err) {
      console.error("Erro ao carregar prioridades:", err)
    } finally {
      setLoadingPrioridades(false)
    }
  }

  useEffect(() => {
    // Sempre que abrir a modal de equipamento, vincula o cliente escolhido
    if (openEquipModal) {
      setNovoEquipamento((s) => ({ ...s, clienteId: novaOrdem.clienteId }))
    }
  }, [openEquipModal, novaOrdem.clienteId])

  useEffect(() => {
    if (novaOrdem.clienteId) {
      fetchEquipamentos(parseInt(novaOrdem.clienteId, 10))
    } else {
      setEquipamentos([])
      setNovaOrdem((s) => ({ ...s, equipamentoId: "" }))
    }
  }, [novaOrdem.clienteId])

  const fetchClientes = async () => {
    try {
      setLoadingClientes(true)
      const data = await getClientes()
      setClientes(data)
    } catch (err) {
      console.error("Erro ao carregar clientes:", err)
    } finally {
      setLoadingClientes(false)
    }
  }

  const fetchTecnicos = async () => {
    try {
      setLoadingTecnicos(true)
      const data = await getTecnicos()
      setTecnicos(data)
    } catch (err) {
      console.error("Erro ao carregar técnicos:", err)
    } finally {
      setLoadingTecnicos(false)
    }
  }

  const fetchEquipamentos = async (clienteId: number) => {
    try {
      setLoadingEquipamentos(true)
      const data = await getEquipamentosByCliente(clienteId)
      setEquipamentos(data)
    } catch (err) {
      console.error("Erro ao carregar equipamentos:", err)
      setEquipamentos([])
    } finally {
      setLoadingEquipamentos(false)
    }
  }

  const fetchServicos = async () => {
    try {
      setLoadingServicos(true)
      const data = await getServicos()
      setServicos(data)
    } catch (err) {
      console.error("Erro ao carregar serviços:", err)
    } finally {
      setLoadingServicos(false)
    }
  }

  const fetchStatus = async () => {
    try {
      setLoadingStatus(true)
      const data = await getStatus()
      setStatusList(data)
    } catch (err) {
      console.error("Erro ao carregar status:", err)
    } finally {
      setLoadingStatus(false)
    }
  }

  const resetNovaOrdem = () =>
    setNovaOrdem({
      clienteId: "",
      tecnicoIds: [],
      equipamentoId: "",
      servicoIds: [],
      descricao: "",
      prioridade: "media",
      status: "pendente",
      dataAgendamento: "",
      custoEstimado: "",
      notas: "",
    })

  const resetNovoEquipamento = () =>
    setNovoEquipamento({
      marca: "",
      modelo: "",
      numeroSerie: "",
      capacidade: "",
      observacao: "",
      clienteId: novaOrdem.clienteId,
    })

  const handleAddOrdem = async () => {
    try {
      setSaving(true)
      // Monta o payload para a API
      const payload = {
          ordem_servico: {
            cliente_id: novaOrdem.clienteId,
            tecnico_ids: novaOrdem.tecnicoIds.map((id) => parseInt(id, 10)),
            equipamento_ids: novaOrdem.equipamentoId ? [parseInt(novaOrdem.equipamentoId, 10)] : [],
            servico_ids: novaOrdem.servicoIds.map((id) => parseInt(id, 10)),
            descricao: novaOrdem.descricao,
            status_id: novaOrdem.status, // agora envia o id
            prioridade_id: novaOrdem.prioridade, // agora envia o id
            data_agendamento: novaOrdem.dataAgendamento || undefined,
            custo_estimado: novaOrdem.custoEstimado ? parseFloat(novaOrdem.custoEstimado) : undefined,
            notas: novaOrdem.notas,
          }
      }
      const criada = await createOrdemServico(payload)
      setOrdens((prev) => [criada, ...prev])
      resetNovaOrdem()
      setOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleAddEquipamento = async () => {
    try {
      setSavingEquip(true)
      const criado = await createEquipamento({
        marca: novoEquipamento.marca.trim(),
        modelo: novoEquipamento.modelo.trim(),
        numero_serie: novoEquipamento.numeroSerie.trim(),
        capacidade: novoEquipamento.capacidade ? parseInt(novoEquipamento.capacidade, 10) : undefined,
        observacao: novoEquipamento.observacao.trim(),
        cliente_id: parseInt(novoEquipamento.clienteId, 10),
      })
      // Recarrega equipamentos e seleciona o criado
      await fetchEquipamentos(parseInt(novoEquipamento.clienteId, 10))
      setNovaOrdem((s) => ({ ...s, equipamentoId: String(criado.id) }))
      resetNovoEquipamento()
      setOpenEquipModal(false) // ← Fecha a modal
    } catch (e) {
      console.error(e)
      // Opcional: exibir erro ao usuário
    } finally {
      setSavingEquip(false)
    }
  }

  const ordensFiltradas = useMemo(() => {
    return ordens.filter((ordem) => {
      // Filtro de busca por número ou descrição
      const matchBusca =
        ordem.numero_ordem == busca ||
        ordem.descricao.toLowerCase().includes(busca.toLowerCase())
      
      // Filtro de status
      const matchStatus = filtroStatus === "todos" || String(ordem.status_descricao) === filtroStatus
      
      // Filtro de data de agendamento
      let matchData = true
      if (filtroDataAgendamento) {
        const dataOrdem = ordem.data_agendamento 
          ? new Date(ordem.data_agendamento.split('T')[0] + "T00:00:00").toLocaleDateString("pt-BR")
          : null
        const dataFiltro = new Date(filtroDataAgendamento + "T00:00:00").toLocaleDateString("pt-BR")
        matchData = dataOrdem === dataFiltro
      }
      
      // Filtro de técnico
      const matchTecnico = filtroTecnico === "todos" || (ordem.tecnico_responsavel && (ordem.tecnico_responsavel as any).id && String((ordem.tecnico_responsavel as any).id) === filtroTecnico)
      
      return matchBusca && matchStatus && matchData && matchTecnico
    })
  }, [ordens, busca, filtroStatus, filtroDataAgendamento, filtroTecnico])

  const getBadgeStatus = (status: string) => {
    const cores: { [key: string]: string } = {
      pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
      em_progresso: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
      concluido: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
      cancelado: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    }
    return cores[status] || ""
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

  const clienteSelecionado = clientes.find((c) => String(c.id) === novaOrdem.clienteId)
  const tecnicosSelecionados = tecnicos.filter((t) => novaOrdem.tecnicoIds.includes(String(t.id)))
  const equipamentoSelecionado = equipamentos.find((e) => String(e.id) === novaOrdem.equipamentoId)
  const servicosSelecionados = useMemo(
    () => servicos.filter((s) => novaOrdem.servicoIds.includes(String(s.id))),
    [servicos, novaOrdem.servicoIds]
  )

  // Calcular custo estimado automaticamente ao selecionar serviços
  useEffect(() => {
    if (novaOrdem.servicoIds.length > 0) {
      const servicosFiltrados = servicos.filter((s) => novaOrdem.servicoIds.includes(String(s.id)))
      const total = servicosFiltrados.reduce((acc, servico) => acc + Number(servico.valor || 0), 0)
      setNovaOrdem((s) => ({ ...s, custoEstimado: total.toFixed(2) }))
    } else {
      setNovaOrdem((s) => ({ ...s, custoEstimado: "" }))
    }
  }, [novaOrdem.servicoIds, servicos])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ordens de Serviço</h1>
          <p className="text-muted-foreground">Visualize e gerencie todas as suas ordens</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Ordem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl sm:max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Ordem de Serviço</DialogTitle>
              <DialogDescription>Preencha os dados da nova ordem</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Combobox de Cliente */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Cliente *</label>
                    <Link
                      href="/clientes"
                      target="_blank"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Cadastrar novo cliente
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <Popover open={openClienteCombo} onOpenChange={setOpenClienteCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openClienteCombo}
                        className="w-full justify-between"
                      >
                        {clienteSelecionado
                          ? `${clienteSelecionado.nome} ${clienteSelecionado.telefones?.[0] ? `(${clienteSelecionado.telefones[0].numero})` : ""}`
                          : "Selecione um cliente..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar cliente..." />
                        <CommandList>
                          <CommandEmpty>
                            {loadingClientes ? "Carregando..." : "Nenhum cliente encontrado."}
                          </CommandEmpty>
                          <CommandGroup>
                            {clientes.map((cliente) => (
                              <CommandItem
                                key={cliente.id}
                                value={`${cliente.nome} ${cliente.email || ""}`}
                                onSelect={() => {
                                  setNovaOrdem((s) => ({ ...s, clienteId: String(cliente.id) }))
                                  setOpenClienteCombo(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    String(cliente.id) === novaOrdem.clienteId ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">{cliente.nome}</span>
                                  {cliente.email && (
                                    <span className="text-xs text-muted-foreground">{cliente.email}</span>
                                  )}
                                  {cliente.telefones?.[0] && (
                                    <span className="text-xs text-muted-foreground">{cliente.telefones[0].numero}</span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Combobox de Equipamento */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Equipamento</label>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => setOpenEquipModal(true)}
                      disabled={!novaOrdem.clienteId}
                      title={!novaOrdem.clienteId ? "Selecione um cliente antes de cadastrar o equipamento" : ""}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Cadastrar equipamento
                    </Button>
                  </div>
                  <Popover open={openEquipamentoCombo} onOpenChange={setOpenEquipamentoCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openEquipamentoCombo}
                        className="w-full justify-between"
                        disabled={!novaOrdem.clienteId || loadingEquipamentos}
                      >
                        {loadingEquipamentos
                          ? "Carregando equipamentos..."
                          : equipamentoSelecionado
                            ? `${equipamentoSelecionado.marca} ${equipamentoSelecionado.modelo}`
                            : equipamentos.length > 0
                              ? "Selecione um equipamento (opcional)..."
                              : "Nenhum equipamento cadastrado"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar equipamento..." />
                        <CommandList>
                          <CommandEmpty>
                            {equipamentos.length === 0 ? "Nenhum equipamento cadastrado." : "Equipamento não encontrado."}
                          </CommandEmpty>
                          <CommandGroup>
                            {/* Limpar seleção */}
                            <CommandItem
                              value="limpar"
                              onSelect={() => {
                                setNovaOrdem((s) => ({ ...s, equipamentoId: "" }))
                                setOpenEquipamentoCombo(false)
                              }}
                            >
                              <span className="text-muted-foreground italic">Nenhum equipamento</span>
                            </CommandItem>

                            {equipamentos.map((equipamento) => (
                              <CommandItem
                                key={equipamento.id}
                                value={`${equipamento.marca} ${equipamento.modelo}`}
                                onSelect={() => {
                                  setNovaOrdem((s) => ({ ...s, equipamentoId: String(equipamento.id) }))
                                  setOpenEquipamentoCombo(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    String(equipamento.id) === novaOrdem.equipamentoId ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {equipamento.marca} {equipamento.modelo}
                                  </span>
                                  {equipamento.numero_serie && (
                                    <span className="text-xs text-muted-foreground">S/N: {equipamento.numero_serie}</span>
                                  )}
                                  {equipamento.capacidade && (
                                    <span className="text-xs text-muted-foreground">Cap: {equipamento.capacidade}</span>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* Combobox de Técnicos (multiselect) */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Técnicos</label>
                    <Link
                      href="/tecnicos"
                      target="_blank"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Cadastrar novo técnico
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <Popover open={openTecnicoCombo} onOpenChange={setOpenTecnicoCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTecnicoCombo}
                        className="w-full justify-between"
                      >
                        {tecnicosSelecionados.length > 0
                          ? tecnicosSelecionados.map((t) => t.nome).slice(0, 2).join(", ") +
                            (tecnicosSelecionados.length > 2 ? ` +${tecnicosSelecionados.length - 2}` : "")
                          : "Selecione técnicos (opcional)..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar técnico..." />
                        <CommandList>
                          <CommandEmpty>
                            {loadingTecnicos ? "Carregando..." : "Nenhum técnico encontrado."}
                          </CommandEmpty>
                          <CommandGroup>
                            {/* Limpar seleção */}
                            <CommandItem
                              value="limpar"
                              onSelect={() => {
                                setNovaOrdem((s) => ({ ...s, tecnicoIds: [] }))
                                setOpenTecnicoCombo(false)
                              }}
                            >
                              <span className="text-muted-foreground italic">Limpar seleção</span>
                            </CommandItem>

                            {tecnicos.map((tecnico) => {
                              const idStr = String(tecnico.id)
                              const selecionado = novaOrdem.tecnicoIds.includes(idStr)
                              return (
                                <CommandItem
                                  key={tecnico.id}
                                  value={`${tecnico.nome} ${tecnico.telefone}`}
                                  onSelect={() => {
                                    setNovaOrdem((s) => ({
                                      ...s,
                                      tecnicoIds: selecionado
                                        ? s.tecnicoIds.filter((id) => id !== idStr)
                                        : [...s.tecnicoIds, idStr],
                                    }))
                                  }}
                                >
                                  <Check className={`mr-2 h-4 w-4 ${selecionado ? "opacity-100" : "opacity-0"}`} />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{tecnico.nome}</span>
                                    <span className="text-xs text-muted-foreground">{tecnico.telefone}</span>
                                    {tecnico.especialidades?.length > 0 && (
                                      <span className="text-xs text-muted-foreground">
                                        {tecnico.especialidades.slice(0, 3).join(", ")}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Combobox de Serviços (multiselect) */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Serviços *</label>
                    <Link
                      href="/servicos"
                      target="_blank"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Cadastrar novo serviço
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <Popover open={openServicoCombo} onOpenChange={setOpenServicoCombo}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openServicoCombo}
                        className="w-full justify-between"
                      >
                        {servicosSelecionados.length > 0
                          ? servicosSelecionados.length === 1
                            ? servicosSelecionados[0].nome
                            : `${servicosSelecionados.length} serviços selecionados`
                          : "Selecione serviços..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar serviço..." />
                        <CommandList>
                          <CommandEmpty>
                            {loadingServicos ? "Carregando..." : "Nenhum serviço encontrado."}
                          </CommandEmpty>
                          <CommandGroup>
                            {/* Limpar seleção */}
                            <CommandItem
                              value="limpar"
                              onSelect={() => {
                                setNovaOrdem((s) => ({ ...s, servicoIds: [] }))
                                setOpenServicoCombo(false)
                              }}
                            >
                              <span className="text-muted-foreground italic">Limpar seleção</span>
                            </CommandItem>

                            {servicos.map((servico) => {
                              const idStr = String(servico.id)
                              const selecionado = novaOrdem.servicoIds.includes(idStr)
                              return (
                                <CommandItem
                                  key={servico.id}
                                  value={servico.nome}
                                  onSelect={() => {
                                    setNovaOrdem((s) => ({
                                      ...s,
                                      servicoIds: selecionado
                                        ? s.servicoIds.filter((id) => id !== idStr)
                                        : [...s.servicoIds, idStr],
                                    }))
                                  }}
                                >
                                  <Check className={`mr-2 h-4 w-4 ${selecionado ? "opacity-100" : "opacity-0"}`} />
                                  <div className="flex flex-col flex-1">
                                    <span className="font-medium">{servico.nome}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {servico.valor.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      })}
                                    </span>
                                  </div>
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Exibir serviços selecionados */}
                  {servicosSelecionados.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {servicosSelecionados.map((servico) => (
                        <Badge key={servico.id} variant="secondary" className="flex items-center gap-1">
                          {servico.nome}
                          <button
                            type="button"
                            onClick={() =>
                              setNovaOrdem((s) => ({
                                ...s,
                                servicoIds: s.servicoIds.filter((id) => id !== String(servico.id)),
                              }))
                            }
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status *</label>
                  <Select
                    value={novaOrdem.status}
                    onValueChange={(v) => setNovaOrdem((s) => ({ ...s, status: v }))}
                    disabled={loadingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusList.map((status) => (
                        <SelectItem key={status.id} value={status.id}>{status.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prioridade */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prioridade *</label>
                  <Select
                    value={novaOrdem.prioridade}
                    onValueChange={(v) => setNovaOrdem((s) => ({ ...s, prioridade: v }))}
                    disabled={loadingPrioridades}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {prioridadesList.map((prioridade) => (
                        <SelectItem key={prioridade.id} value={prioridade.id}>{prioridade.descricao}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Data de Agendamento */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Data e Hora de Agendamento</label>
                  <Input
                    type="datetime-local"
                    value={novaOrdem.dataAgendamento}
                    onChange={(e) => setNovaOrdem((s) => ({ ...s, dataAgendamento: e.target.value }))}
                  />
                </div>

                {/* Custo Estimado (calculado automaticamente) */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Custo Estimado (calculado automaticamente)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={novaOrdem.custoEstimado}
                    onChange={(e) => setNovaOrdem((s) => ({ ...s, custoEstimado: e.target.value }))}
                    className="bg-muted"
                    
                  />
                  {servicosSelecionados.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Soma de {servicosSelecionados.length} serviço(s) selecionado(s)
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição *</label>
                <Textarea
                  placeholder="Descreva o serviço a ser realizado..."
                  rows={3}
                  value={novaOrdem.descricao}
                  onChange={(e) => setNovaOrdem((s) => ({ ...s, descricao: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notas</label>
                <Textarea
                  placeholder="Notas adicionais..."
                  rows={2}
                  value={novaOrdem.notas}
                  onChange={(e) => setNovaOrdem((s) => ({ ...s, notas: e.target.value }))}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleAddOrdem}
                disabled={
                  saving ||
                  !novaOrdem.clienteId.trim() ||
                  !novaOrdem.descricao.trim() ||
                  novaOrdem.servicoIds.length === 0
                }
              >
                {saving ? "Criando..." : "Criar Ordem"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de cadastro de equipamento */}
      <Dialog open={openEquipModal} onOpenChange={setOpenEquipModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Cadastrar Equipamento</DialogTitle>
            <DialogDescription>Preencha os dados do equipamento para o cliente selecionado</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Marca</label>
                <Input
                  value={novoEquipamento.marca}
                  onChange={(e) => setNovoEquipamento((s) => ({ ...s, marca: e.target.value }))}
                  placeholder="Ex: LG"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Modelo</label>
                <Input
                  value={novoEquipamento.modelo}
                  onChange={(e) => setNovoEquipamento((s) => ({ ...s, modelo: e.target.value }))}
                  placeholder="Ex: X200"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Local de Instalação</label>
                <Input
                  value={novoEquipamento.localInstalacao}
                  onChange={(e) => setNovoEquipamento((s) => ({ ...s, localInstalacao: e.target.value }))}
                  placeholder="Ex: Sala 101"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Capacidade</label>
                <Input
                  type="number"
                  min="0"
                  value={novoEquipamento.capacidade}
                  onChange={(e) => setNovoEquipamento((s) => ({ ...s, capacidade: e.target.value }))}
                  placeholder="Ex: 500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Observação</label>
              <Textarea
                rows={3}
                value={novoEquipamento.observacao}
                onChange={(e) => setNovoEquipamento((s) => ({ ...s, observacao: e.target.value }))}
                placeholder="Observações adicionais..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Cliente ID</label>
              <Input
                value={novoEquipamento.clienteId}
                onChange={(e) => setNovoEquipamento((s) => ({ ...s, clienteId: e.target.value }))}
                placeholder="ID do cliente"
                disabled
              />
              {!novoEquipamento.clienteId && (
                <p className="text-xs text-muted-foreground">Selecione um cliente na modal de ordem para habilitar.</p>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleAddEquipamento}
              disabled={
                savingEquip ||
                !novoEquipamento.marca.trim() ||
                !novoEquipamento.modelo.trim() ||
                !novoEquipamento.localInstalacao.trim() ||
                !novoEquipamento.clienteId
              }
            >
              {savingEquip ? "Salvando..." : "Cadastrar Equipamento"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filtros</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setBusca("")
                setFiltroStatus("todos")
                setFiltroDataAgendamento("")
                setFiltroTecnico("todos")
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-col lg:flex-row lg:items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número ou descrição..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                <SelectItem value="Concluido">Concluído</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex-1">
              <Input
                type="date"
                placeholder="Data de Agendamento"
                value={filtroDataAgendamento}
                onChange={(e) => setFiltroDataAgendamento(e.target.value)}
              />
            </div>

            <Select value={filtroTecnico} onValueChange={setFiltroTecnico}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Técnico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Técnicos</SelectItem>
                {tecnicos.map((tecnico) => (
                  <SelectItem key={tecnico.id} value={String(tecnico.id)}>
                    {tecnico.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total: {ordensFiltradas.length} ordens</CardTitle>
        </CardHeader>
        <CardContent>
          {ordensFiltradas.length === 0 ? (
            <NaoEncontrado
              titulo="Nenhuma ordem encontrada"
              descricao="Ajuste seus filtros de busca e tente novamente."
              acao={{
                texto: "Limpar Filtros",
                onClick: () => {
                  setBusca("")
                  setFiltroStatus("todos")
                  setFiltroDataAgendamento("")
                  setFiltroTecnico("todos")
                },
              }}
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Técnico</TableHead>
                    <TableHead>Agendamento</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordensFiltradas.map((ordem) => (
                    <TableRow key={ordem.id}>
                      <TableCell className="font-mono font-bold text-primary">{ordem.id}</TableCell>
                      <TableCell className="max-w-xs truncate">{ordem.descricao.substring(0, 20)}{ordem.descricao.length > 20 ? "..." : ""}</TableCell>
                      <TableCell>
                        <Badge className={getBadgeStatus(ordem.status_descricao)}>{ordem.status_descricao}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getBadgePrioridade(ordem.prioridade_descricao)}>{ordem.prioridade_descricao}</Badge>
                      </TableCell>
                      <TableCell>{ ordem.cliente_nome }</TableCell>
                      <TableCell>{ ordem.tecnico_responsavel?.nome }</TableCell>
                      

                      <TableCell>
                        {ordem.data_agendamento ? new Date(ordem.data_agendamento).toLocaleDateString("pt-BR") : "-"}
                      </TableCell>
                      <TableCell>
                        <Link href={`/ordens/${ordem.id}`}>
                          <Button variant="ghost" size="sm">
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
    </div>
  )
}
