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
import { Plus, Edit, Trash2, Tag } from "lucide-react"
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from "@/lib/api/categorias-servicos"
import type { CategoriaServico } from "@/lib/tipos"

export default function ListaCategoriesServicos() {
  const [categorias, setCategorias] = useState<CategoriaServico[]>([])
  const [busca, setBusca] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [novaCategoria, setNovaCategoria] = useState({
    descricao: "",
  })

  const [editOpen, setEditOpen] = useState(false)
  const [editSaving, setEditSaving] = useState(false)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaServico | null>(null)
  const [editCategoria, setEditCategoria] = useState({
    descricao: "",
  })

  useEffect(() => {
    async function fetchCategorias() {
      try {
        setLoading(true)
        const data = await getCategorias()
        setCategorias(data)
      } catch (err) {
        setError("Erro ao carregar categorias")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategorias()
  }, [])

  const resetNovaCategoria = () =>
    setNovaCategoria({
      descricao: "",
    })

  const handleAddCategoria = async () => {
    try {
      setSaving(true)
      const criada = await createCategoria({
        descricao: novaCategoria.descricao.trim(),
      })
      setCategorias((prev) => [criada, ...prev])
      resetNovaCategoria()
      setOpen(false)
    } catch (e) {
      console.error(e)
      setError("Erro ao criar categoria")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateCategoria = async () => {
    if (!categoriaSelecionada) return
    try {
      setEditSaving(true)
      const atualizada = await updateCategoria(String(categoriaSelecionada.id), {
        descricao: editCategoria.descricao.trim(),
      })
      setCategorias((prev) =>
        prev.map((c) => (c.id === atualizada.id ? atualizada : c))
      )
      setEditOpen(false)
      setCategoriaSelecionada(null)
    } catch (e) {
      console.error(e)
      setError("Erro ao atualizar categoria")
    } finally {
      setEditSaving(false)
    }
  }

  const handleDeleteCategoria = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar esta categoria?")) return
    try {
      await deleteCategoria(String(id))
      setCategorias((prev) => prev.filter((c) => c.id !== id))
    } catch (e) {
      console.error(e)
      setError("Erro ao deletar categoria")
    }
  }

  if (loading) return <div className="p-6">Carregando...</div>
  if (error) return <div className="p-6 text-destructive">{error}</div>

  const categoriasFiltradas = categorias.filter((c) =>
    c.descricao.toLowerCase().includes(busca.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categorias de Serviço</h1>
          <p className="text-muted-foreground">Gerencie as categorias de serviço</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar nova categoria</DialogTitle>
              <DialogDescription>Crie uma nova categoria de serviço</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Descrição da categoria"
                value={novaCategoria.descricao}
                onChange={(e) => setNovaCategoria((s) => ({ ...s, descricao: e.target.value }))}
              />
              <Button
                className="w-full"
                onClick={handleAddCategoria}
                disabled={saving || !novaCategoria.descricao.trim()}
              >
                {saving ? "Salvando..." : "Adicionar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de edição */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar categoria</DialogTitle>
              <DialogDescription>Atualize os dados da categoria</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Descrição da categoria"
                value={editCategoria.descricao}
                onChange={(e) => setEditCategoria((s) => ({ ...s, descricao: e.target.value }))}
              />
              <Button
                className="w-full"
                onClick={handleUpdateCategoria}
                disabled={editSaving || !editCategoria.descricao.trim()}
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
            placeholder="Buscar por descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total: {categoriasFiltradas.length} categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoriasFiltradas.map((categoria) => (
                  <TableRow key={categoria.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        {categoria.descricao}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCategoriaSelecionada(categoria)
                            setEditCategoria({ descricao: categoria.descricao })
                            setEditOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategoria(categoria.id)}
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
