"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, DollarSign, Clock, Tag } from "lucide-react"
import { getServicos, createServico, updateServico, deleteServico } from "@/lib/api/servicos"
import { getCategorias } from "@/lib/api/categorias-servicos"
import type { Servico, CategoriaServico } from "@/lib/tipos"

export default function ListaServicos() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [categorias, setCategorias] = useState<CategoriaServico[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [novoServico, setNovoServico] = useState({
    nome: "",
    valor: "",
    tempo_servico: "",
    categorias_servico_id: "",
  })

  // Estados para edição
  const [editOpen, setEditOpen] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null)
  const [editServico, setEditServico] = useState({
    nome: "",
    valor: "",
    tempo_servico: "",
    categorias_servico_id: "",
  })

  useEffect(() => {
    async function fetchServicosCategorias() {
      try {
        setLoading(true)
        const [dataServicos, dataCategorias] = await Promise.all([
          getServicos(),
          getCategorias(),
        ])
        setServicos(dataServicos)
        setCategorias(dataCategorias)
      } catch (err) {
        setError("Erro ao carregar dados")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchServicosCategorias()
  }, [])

  const resetNovoServico = () =>
    setNovoServico({
      nome: "",
      valor: "",
      tempo_servico: "",
      categorias_servico_id: "",
    })

  const handleAddServico = async () => {
    try {
      setSaving(true)
      const criado = await createServico({
        nome: novoServico.nome.trim(),
        valor: parseFloat(novoServico.valor),
        tempo_servico: novoServico.tempo_servico ? parseInt(novoServico.tempo_servico) : 0,
        categorias_servico_id: novoServico.categorias_servico_id ? parseInt(novoServico.categorias_servico_id) : null,
      })
      setServicos((prev) => [criado, ...prev])
      resetNovoServico()
      setOpen(false)
    } catch (e) {
      console.error(e)
      setError("Erro ao criar serviço")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateServico = async () => {
    if (!servicoSelecionado) return
    try {
      setEditSaving(true)
      const atualizado = await updateServico(String(servicoSelecionado.id), {
        nome: editServico.nome.trim(),
        valor: parseFloat(editServico.valor),
        tempo_servico: editServico.tempo_servico ? parseInt(editServico.tempo_servico) : 0,
        categorias_servico_id: editServico.categorias_servico_id ? parseInt(editServico.categorias_servico_id) : null,
      })
      setServicos((prev) =>
        prev.map((s) => (s.id === atualizado.id ? atualizado : s))
      )
      setEditOpen(false)
      setServicoSelecionado(null)
    } catch (e) {
      console.error(e)
      setError("Erro ao atualizar serviço")
    } finally {
      setEditSaving(false)
    }
  }

  const handleDeleteServico = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este serviço?")) return
    try {
      await deleteServico(id)
      setServicos((prev) => prev.filter((s) => s.id !== id))
    } catch (e) {
      console.error(e)
      setError("Erro ao deletar serviço")
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-destructive">{error}</div>

  const servicosFiltrados = servicos.filter((s) =>
    s.nome.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Serviços</h1>
          <p className="text-muted-foreground">Gerencie os serviços oferecidos</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Serviço</DialogTitle>
              <DialogDescription>Preencha os dados do novo serviço</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome do serviço"
                value={novoServico.nome}
                onChange={(e) => setNovoServico((s) => ({ ...s, nome: e.target.value }))}
              />
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Valor"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-9"
                  value={novoServico.valor}
                  onChange={(e) => setNovoServico((s) => ({ ...s, valor: e.target.value }))}
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tempo de Serviço (minutos)"
                  type="number"
                  min="0"
                  className="pl-9"
                  value={novoServico.tempo_servico}
                  onChange={(e) => setNovoServico((s) => ({ ...s, tempo_servico: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria de Serviço</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={novoServico.categorias_servico_id}
                  onChange={(e) => setNovoServico((s) => ({ ...s, categorias_servico_id: e.target.value }))}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.descricao}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                className="w-full"
                onClick={handleAddServico}
                disabled={saving || !novoServico.nome.trim() || !novoServico.valor}
              >
                {saving ? "Salvando..." : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de edição */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Serviço</DialogTitle>
              <DialogDescription>Atualize os dados do serviço</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nome do serviço"
                value={editServico.nome}
                onChange={(e) => setEditServico((s) => ({ ...s, nome: e.target.value }))}
              />
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Valor"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-9"
                  value={editServico.valor}
                  onChange={(e) => setEditServico((s) => ({ ...s, valor: e.target.value }))}
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tempo de Serviço (minutos)"
                  type="number"
                  min="0"
                  className="pl-9"
                  value={editServico.tempo_servico}
                  onChange={(e) => setEditServico((s) => ({ ...s, tempo_servico: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria de Serviço</label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  value={editServico.categorias_servico_id}
                  onChange={(e) => setEditServico((s) => ({ ...s, categorias_servico_id: e.target.value }))}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.descricao}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                className="w-full"
                onClick={handleUpdateServico}
                disabled={editSaving || !editServico.nome.trim() || !editServico.valor}
              >
                {editSaving ? "Salvando..." : "Salvar alterações"}
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
          <Input
            placeholder="Buscar por nome do serviço..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total: {servicosFiltrados.length} serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Tempo de Serviço</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicosFiltrados.map((servico) => (
                  <TableRow key={servico.id}>
                    <TableCell className="font-medium">{servico.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {servico.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {servico.tempo_servico ? `${servico.tempo_servico} min` : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {servico.categorias_servico?.descricao || servico.categoria?.descricao || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setServicoSelecionado(servico)
                            setEditServico({
                              nome: servico.nome,
                              valor: servico.valor.toString(),
                              tempo_servico: servico.tempo_servico?.toString() || "",
                              categorias_servico_id: servico.categorias_servico_id?.toString() || "",
                            })
                            setEditOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteServico(servico.id)}
                        >
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
