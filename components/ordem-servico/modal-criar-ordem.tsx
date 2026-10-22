"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

import {
  Check,
  ChevronsUpDown,
  ExternalLink,
  Plus,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type {
  Cliente,
  Equipamento,
  Prioridade,
  Servico,
  Status,
  User,
} from "@/lib/tipos"

interface OpcaoLookup {
  id: string | number
  nome?: string
  descricao?: string
}

export interface NovaOrdem {
  clienteId: string
  enderecoId: string
  tecnicoIds: string[]
  equipamentoIds: string[]
  servicoIds: string[]
  descricao: string
  prioridade: string
  status: string
  dataAgendamento: string
  custoEstimado: string
}

interface NovoEquipamento {
  marca: string
  localInstalacao: string
  capacidade: string
  observacao: string
  clienteId: string
}

interface ModalCriarOrdemProps {
  open: boolean
  onOpenChange: (open: boolean) => void

  novaOrdem: NovaOrdem
  setNovaOrdem: React.Dispatch<
    React.SetStateAction<NovaOrdem>
  >

  clientes: Cliente[]
  tecnicos: User[]
  equipamentos: Equipamento[]
  servicos: Servico[]
  statusList: Status[]
  prioridadesList: Prioridade[]

  loadingClientes: boolean
  loadingTecnicos: boolean
  loadingEquipamentos: boolean
  loadingServicos: boolean
  loadingStatus: boolean
  loadingPrioridades: boolean

  saving: boolean

  onCriarOrdem: () => Promise<void>

  onCriarEquipamento: (
    equipamento: NovoEquipamento
  ) => Promise<Equipamento | null>
}

const estadoInicialEquipamento: NovoEquipamento = {
  marca: "",
  localInstalacao: "",
  capacidade: "",
  observacao: "",
  clienteId: "",
}

export function ModalCriarOrdem({
  open,
  onOpenChange,
  novaOrdem,
  setNovaOrdem,
  clientes,
  tecnicos,
  equipamentos,
  servicos,
  statusList,
  prioridadesList,
  loadingClientes,
  loadingTecnicos,
  loadingEquipamentos,
  loadingServicos,
  loadingStatus,
  loadingPrioridades,
  saving,
  onCriarOrdem,
  onCriarEquipamento,
}: ModalCriarOrdemProps) {
  const [openClienteCombo, setOpenClienteCombo] =
    useState(false)

  const [openTecnicoCombo, setOpenTecnicoCombo] =
    useState(false)

  const [openEquipamentoCombo, setOpenEquipamentoCombo] =
    useState(false)

  const [openServicoCombo, setOpenServicoCombo] =
    useState(false)

  const [openEquipModal, setOpenEquipModal] =
    useState(false)

  const [savingEquip, setSavingEquip] =
    useState(false)

  const [novoEquipamento, setNovoEquipamento] =
    useState<NovoEquipamento>(
      estadoInicialEquipamento
    )

  const clienteSelecionado = clientes.find(
    (cliente) =>
      String(cliente.id) === novaOrdem.clienteId
  )

  const enderecosClienteSelecionado =
    clienteSelecionado?.enderecos ?? []

  const enderecoSelecionado =
    enderecosClienteSelecionado.find(
      (endereco) =>
        String(endereco.id) === novaOrdem.enderecoId
    )

  const servicosSelecionados = useMemo(
    () =>
      servicos.filter((servico) =>
        novaOrdem.servicoIds.includes(
          String(servico.id)
        )
      ),
    [servicos, novaOrdem.servicoIds]
  )

  useEffect(() => {
    if (!open) return

    const statusAgendado =
      statusList.find((status) =>
        normalizarTexto(
          obterLabelOpcao(status)
        ).includes("agend")
      )?.id ?? statusList[0]?.id ?? ""

    const prioridadeBaixa =
      prioridadesList.find((prioridade) =>
        normalizarTexto(
          obterLabelOpcao(prioridade)
        ).includes("baix")
      )?.id ??
      prioridadesList[0]?.id ??
      ""

    setNovaOrdem((state) => ({
      ...state,

      status:
        state.status ||
        String(statusAgendado),

      prioridade:
        state.prioridade ||
        String(prioridadeBaixa),
    }))
  }, [
    open,
    statusList,
    prioridadesList,
    setNovaOrdem,
  ])

  useEffect(() => {
    if (!open) return

    if (enderecosClienteSelecionado.length === 1) {
      const enderecoId = String(
        enderecosClienteSelecionado[0].id
      )

      setNovaOrdem((state) => ({
        ...state,
        enderecoId,
      }))
    }

    if (
      enderecosClienteSelecionado.length === 0 &&
      novaOrdem.enderecoId
    ) {
      setNovaOrdem((state) => ({
        ...state,
        enderecoId: "",
      }))
    }
  }, [
    open,
    novaOrdem.clienteId,
    enderecosClienteSelecionado,
    novaOrdem.enderecoId,
    setNovaOrdem,
  ])

  useEffect(() => {
    if (!openEquipModal) return

    setNovoEquipamento((state) => ({
      ...state,
      clienteId: novaOrdem.clienteId,
    }))
  }, [
    openEquipModal,
    novaOrdem.clienteId,
  ])

  useEffect(() => {
    if (!novaOrdem.clienteId) {
      setNovaOrdem((state) => ({
        ...state,
        equipamentoIds: [],
        enderecoId: "",
      }))
    }
  }, [
    novaOrdem.clienteId,
    setNovaOrdem,
  ])

  useEffect(() => {
    const total = servicosSelecionados.reduce(
      (acc, servico) =>
        acc + Number(servico.valor || 0),
      0
    )

    setNovaOrdem((state) => ({
      ...state,
      custoEstimado:
        servicosSelecionados.length > 0
          ? total.toFixed(2)
          : "",
    }))
  }, [
    servicosSelecionados,
    setNovaOrdem,
  ])

  function handleClienteChange(
    clienteId: string
  ) {
    setNovaOrdem((state) => ({
      ...state,
      clienteId,
      enderecoId: "",
      equipamentoIds: [],
    }))

    setOpenClienteCombo(false)
  }

  function handleTecnicoChange(
    tecnicoId: string
  ) {
    setNovaOrdem((state) => {
      const selecionado =
        state.tecnicoIds.includes(tecnicoId)

      return {
        ...state,
        tecnicoIds: selecionado
          ? state.tecnicoIds.filter(
              (id) => id !== tecnicoId
            )
          : [
              ...state.tecnicoIds,
              tecnicoId,
            ],
      }
    })
  }

  function handleServicoChange(
    servicoId: string
  ) {
    setNovaOrdem((state) => {
      const selecionado =
        state.servicoIds.includes(servicoId)

      return {
        ...state,
        servicoIds: selecionado
          ? state.servicoIds.filter(
              (id) => id !== servicoId
            )
          : [
              ...state.servicoIds,
              servicoId,
            ],
      }
    })
  }

  function handleEquipamentoChange(
    equipamentoId: string
  ) {
    setNovaOrdem((state) => {
      const selecionado =
        state.equipamentoIds.includes(
          equipamentoId
        )

      return {
        ...state,
        equipamentoIds: selecionado
          ? state.equipamentoIds.filter(
              (id) => id !== equipamentoId
            )
          : [
              ...state.equipamentoIds,
              equipamentoId,
            ],
      }
    })
  }

  async function handleSalvarEquipamento() {
    if (
      !novoEquipamento.marca.trim() ||
      !novoEquipamento.localInstalacao.trim() ||
      !novoEquipamento.capacidade ||
      !novoEquipamento.clienteId
    ) {
      return
    }

    try {
      setSavingEquip(true)

      const criado =
        await onCriarEquipamento(
          novoEquipamento
        )

      if (criado) {
        setNovaOrdem((state) => ({
          ...state,
          equipamentoIds: [
            ...state.equipamentoIds,
            String(criado.id),
          ],
        }))

        setNovoEquipamento({
          ...estadoInicialEquipamento,
          clienteId:
            novaOrdem.clienteId,
        })

        setOpenEquipModal(false)
      }
    } finally {
      setSavingEquip(false)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Ordem
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-3xl sm:max-h-[90vh] overflow-y-auto">

          <DialogHeader>
            <DialogTitle>
              Criar Nova Ordem de Serviço
            </DialogTitle>

            <DialogDescription>
              Preencha os dados da nova ordem
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">

            {/* CLIENTE */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Cliente *
                </label>

                <Link
                  href="/clientes"
                  target="_blank"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  Cadastrar novo cliente
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <Popover
                open={openClienteCombo}
                onOpenChange={
                  setOpenClienteCombo
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {clienteSelecionado
                      ? clienteSelecionado.nome
                      : "Selecione um cliente..."}

                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar cliente..." />

                    <CommandList>
                      <CommandEmpty>
                        {loadingClientes
                          ? "Carregando..."
                          : "Nenhum cliente encontrado."}
                      </CommandEmpty>

                      <CommandGroup>
                        {clientes.map((cliente) => (
                          <CommandItem
                            key={cliente.id}
                            value={`${cliente.nome} ${cliente.email ?? ""}`}
                            onSelect={() =>
                              handleClienteChange(
                                String(cliente.id)
                              )
                            }
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                clienteSelecionado?.id ===
                                  cliente.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />

                            <div className="flex flex-col">
                              <span className="font-medium">
                                {cliente.nome}
                              </span>

                              {cliente.email && (
                                <span className="text-xs text-muted-foreground">
                                  {cliente.email}
                                </span>
                              )}

                              {cliente.telefones?.[0] && (
                                <span className="text-xs text-muted-foreground">
                                  {
                                    cliente.telefones[0]
                                      .numero
                                  }
                                </span>
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

            {/* ENDEREÇO */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Endereço *
              </label>

              {!novaOrdem.clienteId && (
                <p className="text-sm text-muted-foreground">
                  Selecione um cliente para escolher o endereço.
                </p>
              )}

              {novaOrdem.clienteId &&
                enderecosClienteSelecionado.length ===
                  0 && (
                  <p className="text-sm text-destructive">
                    Cliente sem endereço cadastrado.
                  </p>
                )}

              {novaOrdem.clienteId &&
                enderecosClienteSelecionado.length ===
                  1 &&
                enderecoSelecionado && (
                  <div className="rounded-md border bg-muted/30 p-3 text-sm">
                    {formatarEndereco(
                      enderecoSelecionado
                    )}
                  </div>
                )}

              {enderecosClienteSelecionado.length >
                1 && (
                <Select
                  value={novaOrdem.enderecoId}
                  onValueChange={(value) =>
                    setNovaOrdem((state) => ({
                      ...state,
                      enderecoId: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o endereço" />
                  </SelectTrigger>

                  <SelectContent>
                    {enderecosClienteSelecionado.map(
                      (endereco) => (
                        <SelectItem
                          key={endereco.id}
                          value={String(
                            endereco.id
                          )}
                        >
                          {formatarEndereco(
                            endereco
                          )}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* EQUIPAMENTOS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Equipamentos
                </label>

                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0"
                  disabled={
                    !novaOrdem.clienteId
                  }
                  onClick={() =>
                    setOpenEquipModal(true)
                  }
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Cadastrar equipamento
                </Button>
              </div>

              <Popover
                open={
                  openEquipamentoCombo
                }
                onOpenChange={
                  setOpenEquipamentoCombo
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    disabled={
                      !novaOrdem.clienteId ||
                      loadingEquipamentos
                    }
                  >
                    {loadingEquipamentos
                      ? "Carregando equipamentos..."
                      : novaOrdem.equipamentoIds
                            .length === 0
                        ? equipamentos.length
                          ? "Selecione os equipamentos (opcional)..."
                          : "Nenhum equipamento cadastrado"
                        : `${novaOrdem.equipamentoIds.length} equipamento(s) selecionado(s)`}

                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar equipamento..." />

                    <CommandList>
                      <CommandEmpty>
                        Nenhum equipamento encontrado.
                      </CommandEmpty>

                      <CommandGroup>
                        {equipamentos.map(
                          (equipamento) => {
                            const id =
                              String(
                                equipamento.id
                              )

                            const selecionado =
                              novaOrdem.equipamentoIds.includes(
                                id
                              )

                            return (
                              <CommandItem
                                key={equipamento.id}
                                value={`${equipamento.marca} ${equipamento.btus} ${equipamento.local_instalacao ?? ""}`}
                                onSelect={() =>
                                  handleEquipamentoChange(
                                    id
                                  )
                                }
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selecionado
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />

                                <div>
                                  <div className="font-medium">
                                    {equipamento.marca}{" "}
                                    -{" "}
                                    {equipamento.btus}{" "}
                                    BTUs
                                  </div>

                                  {equipamento.local_instalacao && (
                                    <div className="text-xs text-muted-foreground">
                                      Local:{" "}
                                      {
                                        equipamento.local_instalacao
                                      }
                                    </div>
                                  )}
                                </div>
                              </CommandItem>
                            )
                          }
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {novaOrdem.equipamentoIds.length >
                0 && (
                <div className="flex flex-wrap gap-2">
                  {novaOrdem.equipamentoIds.map(
                    (id) => {
                      const equipamento =
                        equipamentos.find(
                          (item) =>
                            String(item.id) ===
                            id
                        )

                      if (!equipamento)
                        return null

                      return (
                        <div
                          key={id}
                          className="flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-sm"
                        >
                          {equipamento.marca} -{" "}
                          {equipamento.btus} BTUs

                          <button
                            type="button"
                            onClick={() =>
                              handleEquipamentoChange(
                                id
                              )
                            }
                            className="text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </div>
                      )
                    }
                  )}
                </div>
              )}
            </div>

            {/* SERVIÇOS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Serviços *
                </label>

                <Link
                  href="/servicos"
                  target="_blank"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  Cadastrar novo serviço
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <Popover
                open={openServicoCombo}
                onOpenChange={
                  setOpenServicoCombo
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                  >
                    {servicosSelecionados.length
                      ? `${servicosSelecionados.length} serviço(s) selecionado(s)`
                      : "Selecione serviços..."}

                    <ChevronsUpDown className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar serviço..." />

                    <CommandList>
                      <CommandEmpty>
                        {loadingServicos
                          ? "Carregando..."
                          : "Nenhum serviço encontrado."}
                      </CommandEmpty>

                      <CommandGroup>
                        {servicos.map((servico) => {
                          const id =
                            String(servico.id)

                          const selecionado =
                            novaOrdem.servicoIds.includes(
                              id
                            )

                          return (
                            <CommandItem
                              key={servico.id}
                              value={servico.nome}
                              onSelect={() =>
                                handleServicoChange(
                                  id
                                )
                              }
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selecionado
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />

                              <div className="flex flex-1 flex-col">
                                <span className="font-medium">
                                  {servico.nome}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                  {Number(
                                    servico.valor || 0
                                  ).toLocaleString(
                                    "pt-BR",
                                    {
                                      style:
                                        "currency",
                                      currency:
                                        "BRL",
                                    }
                                  )}
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

              {servicosSelecionados.length >
                0 && (
                <div className="flex flex-wrap gap-2">
                  {servicosSelecionados.map(
                    (servico) => (
                      <div
                        key={servico.id}
                        className="flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-sm"
                      >
                        {servico.nome}

                        <button
                          type="button"
                          onClick={() =>
                            handleServicoChange(
                              String(
                                servico.id
                              )
                            )
                          }
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* DATA / STATUS */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Data e Hora de Agendamento
                </label>

                <Input
                  type="datetime-local"
                  value={
                    novaOrdem.dataAgendamento
                  }
                  onChange={(e) =>
                    setNovaOrdem((state) => ({
                      ...state,
                      dataAgendamento:
                        e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Status *
                </label>

                <Select
                  value={novaOrdem.status}
                  onValueChange={(value) =>
                    setNovaOrdem((state) => ({
                      ...state,
                      status: value,
                    }))
                  }
                  disabled={loadingStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {statusList.map((status) => (
                      <SelectItem
                        key={status.id}
                        value={String(status.id)}
                      >
                        {status.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* PRIORIDADE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Prioridade *
                </label>

                <Select
                  value={
                    novaOrdem.prioridade
                  }
                  onValueChange={(value) =>
                    setNovaOrdem((state) => ({
                      ...state,
                      prioridade: value,
                    }))
                  }
                  disabled={
                    loadingPrioridades
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {prioridadesList.map(
                      (prioridade) => (
                        <SelectItem
                          key={prioridade.id}
                          value={String(
                            prioridade.id
                          )}
                        >
                          {obterLabelOpcao(
                            prioridade
                          )}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* TÉCNICOS */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Técnico(s) Responsável(is)
                  <span className="ml-2 text-xs text-muted-foreground">
                    (Opcional)
                  </span>
                </label>

                <Popover
                  open={openTecnicoCombo}
                  onOpenChange={
                    setOpenTecnicoCombo
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between"
                      disabled={
                        loadingTecnicos
                      }
                    >
                      {novaOrdem.tecnicoIds
                        .length
                        ? `${novaOrdem.tecnicoIds.length} técnico(s) selecionado(s)`
                        : "Selecione os técnicos..."}

                      <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar técnico..." />

                      <CommandList>
                        <CommandEmpty>
                          {loadingTecnicos
                            ? "Carregando..."
                            : "Nenhum técnico encontrado."}
                        </CommandEmpty>

                        <CommandGroup>
                          {tecnicos.map(
                            (tecnico) => {
                              const id =
                                String(
                                  tecnico.id
                                )

                              const selecionado =
                                novaOrdem.tecnicoIds.includes(
                                  id
                                )

                              return (
                                <CommandItem
                                  key={
                                    tecnico.id
                                  }
                                  value={
                                    tecnico.nome
                                  }
                                  onSelect={() =>
                                    handleTecnicoChange(
                                      id
                                    )
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selecionado
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />

                                  {
                                    tecnico.nome
                                  }
                                </CommandItem>
                              )
                            }
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {novaOrdem.tecnicoIds.length >
                  0 && (
                  <div className="flex flex-wrap gap-2">
                    {novaOrdem.tecnicoIds.map(
                      (id) => {
                        const tecnico =
                          tecnicos.find(
                            (item) =>
                              String(
                                item.id
                              ) === id
                          )

                        if (!tecnico)
                          return null

                        return (
                          <div
                            key={id}
                            className="flex items-center gap-2 rounded-md border bg-muted px-2 py-1 text-sm"
                          >
                            {tecnico.nome}

                            <button
                              type="button"
                              onClick={() =>
                                handleTecnicoChange(
                                  id
                                )
                              }
                              className="text-muted-foreground hover:text-foreground"
                            >
                              ×
                            </button>
                          </div>
                        )
                      }
                    )}
                  </div>
                )}
              </div>

              {/* CUSTO */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">
                  Custo Estimado (calculado automaticamente)
                </label>

                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={
                    novaOrdem.custoEstimado
                  }
                  readOnly
                  className="bg-muted"
                />

                {servicosSelecionados.length >
                  0 && (
                  <p className="text-xs text-muted-foreground">
                    Soma de{" "}
                    {servicosSelecionados.length}{" "}
                    serviço(s) selecionado(s)
                  </p>
                )}
              </div>
            </div>

            {/* DESCRIÇÃO */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Descrição *
              </label>

              <Textarea
                placeholder="Descreva o serviço a ser realizado..."
                rows={3}
                value={novaOrdem.descricao}
                onChange={(e) =>
                  setNovaOrdem((state) => ({
                    ...state,
                    descricao:
                      e.target.value,
                  }))
                }
              />
            </div>

            <Button
              className="w-full"
              onClick={onCriarOrdem}
              disabled={
                saving ||
                !novaOrdem.clienteId ||
                (
                  enderecosClienteSelecionado.length >
                    0 &&
                  !novaOrdem.enderecoId
                ) ||
                !novaOrdem.descricao.trim() ||
                novaOrdem.servicoIds.length ===
                  0
              }
            >
              {saving
                ? "Criando..."
                : "Criar Ordem"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE EQUIPAMENTO */}
      <Dialog
        open={openEquipModal}
        onOpenChange={setOpenEquipModal}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Cadastrar Equipamento
            </DialogTitle>

            <DialogDescription>
              Preencha os dados do equipamento para o cliente selecionado
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Marca *
                </label>

                <Input
                  value={
                    novoEquipamento.marca
                  }
                  onChange={(e) =>
                    setNovoEquipamento(
                      (state) => ({
                        ...state,
                        marca:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="Ex: LG"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Local de Instalação *
                </label>

                <Input
                  value={
                    novoEquipamento.localInstalacao
                  }
                  onChange={(e) =>
                    setNovoEquipamento(
                      (state) => ({
                        ...state,
                        localInstalacao:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="Ex: Sala"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  BTUs *
                </label>

                <Input
                  value={
                    novoEquipamento.capacidade
                  }
                  onChange={(e) =>
                    setNovoEquipamento(
                      (state) => ({
                        ...state,
                        capacidade:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="Ex: 12000"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Cliente
                </label>

                <Input
                  value={
                    novoEquipamento.clienteId
                  }
                  disabled
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">
                  Observação
                </label>

                <Textarea
                  value={
                    novoEquipamento.observacao
                  }
                  onChange={(e) =>
                    setNovoEquipamento(
                      (state) => ({
                        ...state,
                        observacao:
                          e.target.value,
                      })
                    )
                  }
                  placeholder="Observações do equipamento..."
                  rows={3}
                />
              </div>
            </div>

            <Button
              className="w-full"
              onClick={
                handleSalvarEquipamento
              }
              disabled={
                savingEquip ||
                !novoEquipamento.marca.trim() ||
                !novoEquipamento.localInstalacao.trim() ||
                !novoEquipamento.capacidade ||
                !novoEquipamento.clienteId
              }
            >
              {savingEquip
                ? "Salvando..."
                : "Cadastrar Equipamento"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function normalizarTexto(
  value?: string | null
) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function obterLabelOpcao(
  item: OpcaoLookup
) {
  return item.nome ?? item.descricao ?? ""
}

function formatarEndereco(endereco: {
  rua: string
  numero: string
  bairro: string
  complemento?: string | null
  cidade: string
  cep?: string | null
}) {
  const complemento =
    endereco.complemento
      ? `, ${endereco.complemento}`
      : ""

  const cep = endereco.cep
    ? ` - CEP ${endereco.cep}`
    : ""

  return `${endereco.rua}, ${endereco.numero}${complemento} - ${endereco.bairro} - ${endereco.cidade}${cep}`
}