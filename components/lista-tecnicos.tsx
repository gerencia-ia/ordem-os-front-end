"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getTecnicos, createTecnico, updateTecnico } from "@/lib/api/tecnicos"
import { Plus, Phone, Edit, Trash2, MessageCircle } from "lucide-react"
import type { Tecnico } from "@/lib/tipos"

export default function ListaTecnicos() {
  const [tecnicos, setTecnicos] = useState<Tecnico[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // edição de técnico
  const [editOpen, setEditOpen] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState<Tecnico | null>(null)
  const [editTecnico, setEditTecnico] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    especialidades: [] as string[],
    especialidadeInput: "",
  })

  const [novoTecnico, setNovoTecnico] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    especialidades: [] as string[],
    especialidadeInput: "",
  })

  useEffect(() => {
    async function fetchTecnicos() {
      try {
        setLoading(true)
        const data = await getTecnicos()
        setTecnicos(data)
      } catch (err) {
        setError("Erro ao carregar técnicos")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTecnicos()
  }, [])

  const handleAddEspecialidade = () => {
    if (novoTecnico.especialidadeInput.trim()) {
      setNovoTecnico((s) => ({
        ...s,
        especialidades: [...s.especialidades, s.especialidadeInput.trim()],
        especialidadeInput: "",
      }))
    }
  }

  const handleRemoveEspecialidade = (idx: number) => {
    setNovoTecnico((s) => ({
      ...s,
      especialidades: s.especialidades.filter((_, i) => i !== idx),
    }))
  }

  const resetNovoTecnico = () =>
    setNovoTecnico({
      nome: "",
      cpf: "",
      telefone: "",
      especialidades: [],
      especialidadeInput: "",
    })

  const handleAddTecnico = async () => {
    try {
      setSaving(true)
      const criado = await createTecnico({
        nome: novoTecnico.nome.trim(),
        cpf: novoTecnico.cpf.trim(),
        telefone: novoTecnico.telefone.trim(),
        especialidades: novoTecnico.especialidades,
      })
      setTecnicos((prev) => [criado, ...prev])
      resetNovoTecnico()
      setOpen(false)
    } catch (e) {
      console.error(e)
      setError("Erro ao criar técnico")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-destructive">{error}</div>

  const tecnicosFiltrados = tecnicos.filter(
    (t) =>
      t.nome.toLowerCase().includes(busca.toLowerCase()) ||
      t.cpf?.toLowerCase().includes(busca.toLowerCase()) ||
      t.telefone.toLowerCase().includes(busca.toLowerCase()),
  )

  // Função para abrir WhatsApp
  const abrirWhatsapp = (numero: string, nomeTecnico: string) => {
    // Remove caracteres não numéricos
    const numeroLimpo = numero.replace(/\D/g, "")
    // Se não começar com 55, adiciona código do Brasil
    const numeroWhatsapp = numeroLimpo.startsWith("55") ? numeroLimpo : "55" + numeroLimpo
    const mensagem = `Olá ${nomeTecnico}, tudo bem?`
    const urlWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`
    window.open(urlWhatsapp, "_blank")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Técnicos</h1>
          <p className="text-muted-foreground">Gerencie os técnicos do sistema</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Técnico
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Técnico</DialogTitle>
              <DialogDescription>Preencha os dados do novo técnico</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome completo"
                value={novoTecnico.nome}
                onChange={(e) => setNovoTecnico((s) => ({ ...s, nome: e.target.value }))}
              />
              <Input
                placeholder="CPF (apenas números)"
                value={novoTecnico.cpf}
                onChange={(e) => setNovoTecnico((s) => ({ ...s, cpf: e.target.value }))}
              />
              <Input
                placeholder="Telefone"
                value={novoTecnico.telefone}
                onChange={(e) => setNovoTecnico((s) => ({ ...s, telefone: e.target.value }))}
              />

              <div className="space-y-2">
                <span className="font-medium">Especialidades</span>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: manutenção"
                    value={novoTecnico.especialidadeInput}
                    onChange={(e) => setNovoTecnico((s) => ({ ...s, especialidadeInput: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleAddEspecialidade()}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddEspecialidade}>
                    Adicionar
                  </Button>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {novoTecnico.especialidades.map((esp, idx) => (
                    <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveEspecialidade(idx)}>
                      {esp} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handleAddTecnico}
                disabled={saving || !novoTecnico.nome.trim() || !novoTecnico.cpf.trim() || !novoTecnico.telefone.trim()}
              >
                {saving ? "Salvando..." : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Buscar por nome, CPF ou telefone..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total: {tecnicosFiltrados.length} técnicos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Especialidades</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tecnicosFiltrados.map((tecnico) => (
                  <TableRow key={tecnico.id}>
                    <TableCell className="font-medium">{tecnico.nome}</TableCell>
                    <TableCell>{tecnico.cpf || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{tecnico.telefone}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto"
                          onClick={() => abrirWhatsapp(tecnico.telefone, tecnico.nome)}
                        >
                          <MessageCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {tecnico.especialidades.map((esp, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {esp}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTecnicoSelecionado(tecnico)
                            setEditTecnico({
                              nome: tecnico.nome || "",
                              cpf: tecnico.cpf || "",
                              telefone: tecnico.telefone || "",
                              especialidades: [...(tecnico.especialidades || [])],
                              especialidadeInput: "",
                            })
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

      {/* Dialog de edição de técnico */}
      <Dialog
        open={editOpen}
        onOpenChange={(o) => {
          setEditOpen(o)
          if (!o) {
            setTecnicoSelecionado(null)
            setEditTecnico({ nome: "", cpf: "", telefone: "", especialidades: [], especialidadeInput: "" })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Técnico</DialogTitle>
            <DialogDescription>Atualize os dados do técnico selecionado</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome completo"
              value={editTecnico.nome}
              onChange={(e) => setEditTecnico((s) => ({ ...s, nome: e.target.value }))}
            />
            <Input
              placeholder="CPF (apenas números)"
              value={editTecnico.cpf}
              onChange={(e) => setEditTecnico((s) => ({ ...s, cpf: e.target.value }))}
            />
            <Input
              placeholder="Telefone"
              value={editTecnico.telefone}
              onChange={(e) => setEditTecnico((s) => ({ ...s, telefone: e.target.value }))}
            />

            <div className="space-y-2">
              <span className="font-medium">Especialidades</span>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: manutenção"
                  value={editTecnico.especialidadeInput}
                  onChange={(e) => setEditTecnico((s) => ({ ...s, especialidadeInput: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editTecnico.especialidadeInput.trim()) {
                      setEditTecnico((s) => ({
                        ...s,
                        especialidades: [...s.especialidades, s.especialidadeInput.trim()],
                        especialidadeInput: "",
                      }))
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    editTecnico.especialidadeInput.trim() &&
                    setEditTecnico((s) => ({
                      ...s,
                      especialidades: [...s.especialidades, s.especialidadeInput.trim()],
                      especialidadeInput: "",
                    }))
                  }
                >
                  Adicionar
                </Button>
              </div>
              <div className="flex gap-1 flex-wrap">
                {editTecnico.especialidades.map((esp, idx) => (
                  <Badge
                    key={`${esp}-${idx}`}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() =>
                      setEditTecnico((s) => ({
                        ...s,
                        especialidades: s.especialidades.filter((_, i) => i !== idx),
                      }))
                    }
                  >
                    {esp} ×
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              onClick={async () => {
                if (!tecnicoSelecionado) return
                try {
                  setEditSaving(true)
                  const atualizado = await updateTecnico(String(tecnicoSelecionado.id), {
                    nome: editTecnico.nome.trim(),
                    cpf: editTecnico.cpf.trim(),
                    telefone: editTecnico.telefone.trim(),
                    especialidades: editTecnico.especialidades,
                  })
                  setTecnicos((lista) => lista.map((t) => (t.id === atualizado.id ? { ...t, ...atualizado } : t)))
                  setEditOpen(false)
                  setTecnicoSelecionado(null)
                } catch (e) {
                  console.error(e)
                  setError("Erro ao atualizar técnico")
                } finally {
                  setEditSaving(false)
                }
              }}
              disabled={
                editSaving || !editTecnico.nome.trim() || !editTecnico.cpf.trim() || !editTecnico.telefone.trim()
              }
            >
              {editSaving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
