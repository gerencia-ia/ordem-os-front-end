"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Cliente, Telefone, Endereco } from "@/lib/tipos"
import { getClientes } from "@/lib/api/clientes"
import { createCliente } from "@/lib/api/clientes"
import { updateCliente } from "@/lib/api/clientes"
import type { AtualizarClientePayload } from "@/lib/api/clientes"
import { Plus, Edit, Trash2, Phone, Mail, MapPin, PlusCircle, MessageCircle } from "lucide-react"
import { CadastrarEquipamento } from "@/components/cadastrar-equipamento"

export default function ListaClientes() {
  // Estado para modal de equipamento
  const [openEquipModal, setOpenEquipModal] = useState(false)
  // Estado para equipamentos cadastrados em memória
  const [equipamentos, setEquipamentos] = useState<any[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // estado do novo cliente
  const [novoCliente, setNovoCliente] = useState<{
    nome: string
    email?: string
    data_ultima_visita?: string
    telefones: { numero: string }[]
    enderecos: { rua: string; numero: string; bairro: string; complemento?: string; cidade: string }[]
  }>({
    nome: "",
    email: "",
    data_ultima_visita: "",
    telefones: [{ numero: "" }],
    enderecos: [{ rua: "", numero: "", bairro: "", complemento: "", cidade: "" }],
  })

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // edição de cliente
  const [editOpen, setEditOpen] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null)
  const [editForm, setEditForm] = useState<{ nome: string; email: string; data_ultima_visita?: string }>({ nome: "", email: "", data_ultima_visita: "" })
  const [editTelefones, setEditTelefones] = useState<Array<{ id?: number; numero: string }>>([])
  const [editEnderecos, setEditEnderecos] = useState<
    Array<{ id?: number; rua: string; numero: string; bairro: string; complemento?: string; cidade: string }>
  >([])
  const [editEquipOpen, setEditEquipOpen] = useState(false)
  const [editEquipamentos, setEditEquipamentos] = useState<any[]>([])

  // Estados para modal de WhatsApp
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false)
  const [clienteWhatsapp, setClienteWhatsapp] = useState<Cliente | null>(null)

  const addEditTelefone = () => setEditTelefones((arr) => [...arr, { numero: "" }])
  const removeEditTelefone = (idx: number) =>
    setEditTelefones((arr) => arr.filter((_, i) => i !== idx))
  const updateEditTelefone = (idx: number, numero: string) =>
    setEditTelefones((arr) => {
      const next = [...arr]
      next[idx] = { ...next[idx], numero }
      return next
    })

  const addEditEndereco = () =>
    setEditEnderecos((arr) => [...arr, { rua: "", numero: "", bairro: "", complemento: "", cidade: "" }])
  const removeEditEndereco = (idx: number) =>
    setEditEnderecos((arr) => arr.filter((_, i) => i !== idx))
  const updateEditEndereco = (
    idx: number,
    field: "rua" | "numero" | "bairro" | "complemento" | "cidade",
    value: string,
  ) =>
    setEditEnderecos((arr) => {
      const next = [...arr]
      next[idx] = { ...next[idx], [field]: value }
      return next as typeof arr
    })

  // helpers para telefone/endereço
  const addTelefone = () =>
    setNovoCliente((s) => ({ ...s, telefones: [...s.telefones, { numero: "" }] }))
  const removeTelefone = (idx: number) =>
    setNovoCliente((s) => ({ ...s, telefones: s.telefones.filter((_, i) => i !== idx) }))
  const updateTelefone = (idx: number, numero: string) =>
    setNovoCliente((s) => {
      const arr = [...s.telefones]
      arr[idx] = { numero }
      return { ...s, telefones: arr }
    })

  const addEndereco = () =>
    setNovoCliente((s) => ({
      ...s,
      enderecos: [...s.enderecos, { rua: "", numero: "", bairro: "", complemento: "", cidade: "" }],
    }))
  const removeEndereco = (idx: number) =>
    setNovoCliente((s) => ({ ...s, enderecos: s.enderecos.filter((_, i) => i !== idx) }))
  const updateEndereco = (
    idx: number,
    field: "rua" | "numero" | "bairro" | "complemento" | "cidade",
    value: string,
  ) =>
    setNovoCliente((s) => {
      const arr = [...s.enderecos]
      arr[idx] = { ...arr[idx], [field]: value }
      return { ...s, enderecos: arr }
    })

  const resetNovoCliente = () => {
    setNovoCliente({
      nome: "",
      email: "",
      data_ultima_visita: "",
      telefones: [{ numero: "" }],
      enderecos: [{ rua: "", numero: "", bairro: "", complemento: "", cidade: "" }],
    })
  }

  // Função para resetar cliente e equipamentos juntos
  const resetNovoClienteEEquipamentos = () => {
    resetNovoCliente()
    setEquipamentos([])
  }

  const handleAddCliente = async () => {
    try {
      setSaving(true)
      const criado = await createCliente({
        nome: novoCliente.nome.trim(),
        email: novoCliente.email?.trim() || null,
        data_ultima_visita: novoCliente.data_ultima_visita?.trim() || null,
        telefones_attributes: novoCliente.telefones.filter(t => t.numero.trim()).map(t => ({ numero: t.numero.trim() })),
        enderecos_attributes: novoCliente.enderecos
          .filter(e => e.rua.trim())
          .map(e => ({
            rua: e.rua.trim(),
            numero: e.numero.trim(),
            bairro: e.bairro.trim(),
            complemento: e.complemento?.trim(),
            cidade: e.cidade.trim(),
          })),
        equipamentos_attributes: equipamentos, // Envia equipamentos junto
      })
      setClientes(prev => [criado, ...prev])
      resetNovoClienteEEquipamentos()
      setOpen(false)
    } catch (e) {
      console.error(e)
      setError("Erro ao criar cliente")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    async function fetchClientes() {
      try {
        setLoading(true)
        const data = await getClientes()
        setClientes(data)
      } catch (err) {
        setError("Erro ao carregar clientes")
        console.error(err)
      } finally {
      // ...existing code...
        setLoading(false)
      }
    }
    fetchClientes()
  }, [])

  if (loading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-destructive">{error}</div>

  const clientesFiltrados = clientes.filter(
    (c) => c.nome.toLowerCase().includes(busca.toLowerCase()) || (c.email?.toLowerCase() || "").includes(busca.toLowerCase()),
  )

  // Função para abrir WhatsApp
  const abrirWhatsapp = (numero: string, nomeCliente: string) => {
    // Remove caracteres não numéricos
    const numeroLimpo = numero.replace(/\D/g, "")
    // Se não começar com 55, adiciona código do Brasil
    const numeroWhatsapp = numeroLimpo.startsWith("55") ? numeroLimpo : "55" + numeroLimpo
    const mensagem = `Olá ${nomeCliente}, tudo bem?`
    const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`
    window.open(urlWhatsapp, "_blank")
  }

  // Função para calcular e retornar o marcador baseado na última visita
  const getMarcadorVisita = (dataUltimaVisita?: string | null) => {
    if (!dataUltimaVisita) {
      return { texto: "Nunca visitado", variant: "secondary" as const }
    }

    const ultVisita = new Date(dataUltimaVisita)
    const hoje = new Date()
    const diasDecorridos = Math.floor((hoje.getTime() - ultVisita.getTime()) / (1000 * 60 * 60 * 24))

    if (diasDecorridos < 60) {
      return { texto: `${diasDecorridos} dias`, variant: "default" as const }
    } else if (diasDecorridos < 90) {
      return { texto: `${diasDecorridos} dias`, variant: "secondary" as const }
    } else if (diasDecorridos < 180) {
      return { texto: `${diasDecorridos} dias`, variant: "outline" as const }
    } else {
      return { texto: `Acima de 180 dias`, variant: "destructive" as const }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clientes</h1>
          <p className="text-muted-foreground">Gerencie os clientes cadastrados</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">

            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              <DialogDescription>Preencha os dados do novo cliente</DialogDescription>
            </DialogHeader>

            <div className="flex justify-end mb-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setOpenEquipModal(true)}>
                <PlusCircle className="h-4 w-4 mr-1" /> Cadastrar Equipamento
              </Button>
            </div>
          {/* Modal de cadastro de equipamento */}
          <CadastrarEquipamento
            open={openEquipModal}
            setOpen={setOpenEquipModal}
            onSalvarEquipamento={(equip) => setEquipamentos((prev) => [...prev, equip])}
          />
          {/* Lista de equipamentos cadastrados em memória */}
          {equipamentos.length > 0 && (
            <div className="mb-4">
              <div className="font-medium mb-1">Equipamentos cadastrados:</div>
              <ul className="list-disc pl-5">
                {equipamentos.map((eq, i) => (
                  <li key={i} className="text-sm">
                    {eq.marca} - {eq.btus} BTUs - {eq.local_instalacao} {eq.observacao && `- ${eq.observacao}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

            <div className="space-y-4">
              <Input
                placeholder="Nome do cliente"
                value={novoCliente.nome}
                onChange={(e) => setNovoCliente((s) => ({ ...s, nome: e.target.value }))}
              />
              <Input
                placeholder="E-mail (opcional)"
                value={novoCliente.email ?? ""}
                onChange={(e) => setNovoCliente((s) => ({ ...s, email: e.target.value }))}
              />
              <div>
                <label className="text-sm font-medium mb-1 block">Data da Última Visita (opcional)</label>
                <Input
                  type="date"
                  value={novoCliente.data_ultima_visita ?? ""}
                  onChange={(e) => setNovoCliente((s) => ({ ...s, data_ultima_visita: e.target.value }))}
                />
              </div>

              {/* Telefones */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Telefones</span>
                  <Button type="button" variant="secondary" size="sm" onClick={addTelefone}>
                    + Telefone
                  </Button>
                </div>
                {novoCliente.telefones.map((t, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder="Número (ex: 11999999999)"
                      value={t.numero}
                      onChange={(e) => updateTelefone(idx, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="shrink-0"
                      onClick={() => removeTelefone(idx)}
                      disabled={novoCliente.telefones.length === 1}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>

              {/* Endereços */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Endereços</span>
                  <Button type="button" variant="secondary" size="sm" onClick={addEndereco}>
                    + Endereço
                  </Button>
                </div>
                {novoCliente.enderecos.map((e, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder="Rua"
                        value={e.rua}
                        onChange={(ev) => updateEndereco(idx, "rua", ev.target.value)}
                      />
                      <Input
                        placeholder="Número"
                        value={e.numero}
                        onChange={(ev) => updateEndereco(idx, "numero", ev.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder="Bairro"
                        value={e.bairro}
                        onChange={(ev) => updateEndereco(idx, "bairro", ev.target.value)}
                      />
                        <Input
                          placeholder="Cidade"
                          value={e.cidade}
                          onChange={(ev) => updateEndereco(idx, "cidade", ev.target.value)}
                        />
                      <Input
                        placeholder="Complemento"
                        value={e.complemento ?? ""}
                        onChange={(ev) => updateEndereco(idx, "complemento", ev.target.value)}
                      />
                    <div>
                    </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeEndereco(idx)}
                        disabled={novoCliente.enderecos.length === 1}
                      >
                        Remover endereço
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                type="button"
                onClick={handleAddCliente}
                disabled={saving || !novoCliente.nome.trim()}
              >
                {saving ? "Salvando..." : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de edição de cliente */}
        <Dialog open={editOpen} onOpenChange={(o) => {
          setEditOpen(o)
          if (!o) {
            setClienteSelecionado(null)
            setEditTelefones([])
            setEditEnderecos([])
            setEditEquipamentos([])
            setEditEquipOpen(false)
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Cliente</DialogTitle>
              <DialogDescription>Atualize os dados do cliente</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end mb-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditEquipOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-1" /> Cadastrar Equipamento
              </Button>
            </div>
            {/* Modal de cadastro de equipamento (edição) */}
            <CadastrarEquipamento
              open={editEquipOpen}
              setOpen={setEditEquipOpen}
              onSalvarEquipamento={(equip) => setEditEquipamentos((prev) => [...prev, equip])}
            />
            {/* Lista de equipamentos adicionados nesta edição */}
            {editEquipamentos.length > 0 && (
              <div className="mb-4">
                <div className="font-medium mb-1">Equipamentos adicionados:</div>
                <ul className="list-disc pl-5">
                  {editEquipamentos.map((eq, i) => (
                    <li key={i} className="text-sm">
                      {eq.marca} - {eq.btus} BTUs - {eq.local_instalacao} {eq.observacao && `- ${eq.observacao}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-4">
              <Input
                placeholder="Nome do cliente"
                value={editForm.nome}
                onChange={(e) => setEditForm((s) => ({ ...s, nome: e.target.value }))}
              />
              <Input
                placeholder="E-mail (opcional)"
                value={editForm.email}
                onChange={(e) => setEditForm((s) => ({ ...s, email: e.target.value }))}
              />
              <div>
                <label className="text-sm font-medium mb-1 block">Data da Última Visita (opcional)</label>
                <Input
                  type="date"
                  value={editForm.data_ultima_visita ?? ""}
                  onChange={(e) => setEditForm((s) => ({ ...s, data_ultima_visita: e.target.value }))}
                />
              </div>

              {/* Telefones (edição) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Telefones</span>
                  <Button type="button" variant="secondary" size="sm" onClick={addEditTelefone}>
                    + Telefone
                  </Button>
                </div>
                {editTelefones.map((t, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      placeholder="Número (ex: 11999999999)"
                      value={t.numero}
                      onChange={(e) => updateEditTelefone(idx, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      className="shrink-0"
                      onClick={() => removeEditTelefone(idx)}
                      disabled={editTelefones.length <= 1}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>

              {/* Endereços (edição) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Endereços</span>
                  <Button type="button" variant="secondary" size="sm" onClick={addEditEndereco}>
                    + Endereço
                  </Button>
                </div>
                {editEnderecos.map((e, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder="Rua"
                        value={e.rua}
                        onChange={(ev) => updateEditEndereco(idx, "rua", ev.target.value)}
                      />
                      <Input
                        placeholder="Número"
                        value={e.numero}
                        onChange={(ev) => updateEditEndereco(idx, "numero", ev.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        placeholder="Bairro"
                        value={e.bairro}
                        onChange={(ev) => updateEditEndereco(idx, "bairro", ev.target.value)}
                      />
                      <Input
                        placeholder="Cidade"
                        value={e.cidade}
                        onChange={(ev) => updateEditEndereco(idx, "cidade", ev.target.value)}
                      />
                      <Input
                        placeholder="Complemento"
                        value={e.complemento ?? ""}
                        onChange={(ev) => updateEditEndereco(idx, "complemento", ev.target.value)}
                      />
                      <div />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeEditEndereco(idx)}
                        disabled={editEnderecos.length <= 1}
                      >
                        Remover endereço
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full"
                type="button"
                onClick={async () => {
                  if (!clienteSelecionado) return
                  try {
                    setEditSaving(true)
                    // Monta payload de atualização com nested attributes
                    const originalTels = clienteSelecionado.telefones || []
                    const originalEnds = clienteSelecionado.enderecos || []

                    const currentTels = editTelefones.filter(t => t.numero.trim())
                    const currentEnds = editEnderecos.filter(e => e.rua.trim())

                    const removedTels = originalTels
                      .filter(ot => !currentTels.some(ct => ct.id === ot.id))
                      .map(ot => ({ id: ot.id, _destroy: true }))
                    const removedEnds = originalEnds
                      .filter(oe => !currentEnds.some(ce => ce.id === oe.id))
                      .map(oe => ({ id: oe.id, _destroy: true }))

                    const telsAttributes = [
                      ...currentTels.map(t => ({ id: t.id, numero: t.numero.trim() })),
                      ...removedTels,
                    ]
                    const endsAttributes = [
                      ...currentEnds.map(e => ({
                        id: e.id,
                        rua: e.rua.trim(),
                        numero: e.numero.trim(),
                        bairro: e.bairro.trim(),
                        complemento: e.complemento?.toString().trim() || undefined,
                        cidade: e.cidade.trim(),
                      })),
                      ...removedEnds,
                    ]

                    const payload: AtualizarClientePayload = {
                      nome: editForm.nome.trim(),
                      email: editForm.email.trim() ? editForm.email.trim() : null,
                      data_ultima_visita: editForm.data_ultima_visita?.trim() || null,
                      telefones_attributes: telsAttributes,
                      enderecos_attributes: endsAttributes,
                      equipamentos_attributes: editEquipamentos,
                    }

                    const atualizado = await updateCliente(String(clienteSelecionado.id), payload)
                    setClientes((lista) => lista.map((c) => (c.id === atualizado.id ? { ...c, ...atualizado } : c)))
                    setEditOpen(false)
                    setClienteSelecionado(null)
                    setEditEquipamentos([])
                  } catch (e) {
                    console.error(e)
                    setError("Erro ao atualizar cliente")
                  } finally {
                    setEditSaving(false)
                  }
                }}
                disabled={editSaving || !editForm.nome.trim()}
              >
                {editSaving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de seleção de telefone para WhatsApp */}
        <Dialog open={whatsappModalOpen} onOpenChange={setWhatsappModalOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Selecione o telefone</DialogTitle>
              <DialogDescription>Escolha qual número usar para enviar mensagem no WhatsApp</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {clienteWhatsapp?.telefones.map((telefone) => (
                <Button
                  key={telefone.id}
                  className="w-full justify-between"
                  variant="outline"
                  onClick={() => {
                    abrirWhatsapp(telefone.numero, clienteWhatsapp.nome)
                    setWhatsappModalOpen(false)
                  }}
                >
                  <MessageCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span>{telefone.numero}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Buscar por nome ou telefone..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total: {clientesFiltrados.length} clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Marcador</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientesFiltrados.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{cliente.telefones.map(t => t.numero).join(", ")}</span>
                        {cliente.telefones.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                            onClick={() => {
                              if (cliente.telefones.length === 1) {
                                abrirWhatsapp(cliente.telefones[0].numero, cliente.nome)
                              } else {
                                setClienteWhatsapp(cliente)
                                setWhatsappModalOpen(true)
                              }
                            }}
                          >
                            <MessageCircle className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm max-w-xs truncate">{cliente.enderecos.map(e => `${e.rua}, ${e.numero} - ${e.bairro}${e.complemento ? `, ${e.complemento}` : ""} - ${e.cidade}`).join(" | ")}</span>
                      </div>
                    </TableCell>
                    <TableCell>{cliente.data_ultima_visita ? new Date(cliente.data_ultima_visita).toLocaleDateString("pt-BR") : "-"}</TableCell>
                    <TableCell>
                      {(() => {
                        const marcador = getMarcadorVisita(cliente.data_ultima_visita)
                        return <Badge variant={marcador.variant}>{marcador.texto}</Badge>
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setClienteSelecionado(cliente)
                            setEditForm({ nome: cliente.nome, email: cliente.email ?? "", data_ultima_visita: cliente.data_ultima_visita ?? "" })
                            setEditTelefones((cliente.telefones || []).map(t => ({ id: t.id, numero: t.numero })))
                            setEditEnderecos((cliente.enderecos || []).map(e => ({
                              id: e.id,
                              rua: e.rua,
                              numero: e.numero,
                              bairro: e.bairro,
                              complemento: e.complemento ?? "",
                              cidade: e.cidade,
                            })))
                            setEditOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
