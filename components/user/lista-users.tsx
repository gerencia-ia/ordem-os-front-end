"use client"

import { useEffect, useState } from "react"
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/api/users"
import type { User } from "@/lib/tipos"

import FiltrosUsers from "./filtros-users"
import TabelaUsers from "./tabela-users"
import ModalCriarUser from "./modal-criar-user"
import ModalEditarUser from "./modal-editar-user"
import { NavButtonLabel } from "react-day-picker"

export default function ListaUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [busca, setBusca] = useState("")

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modalCriarOpen, setModalCriarOpen] = useState(false)
  const [modalEditarOpen, setModalEditarOpen] = useState(false)

  const [saving, setSaving] = useState(false)
  const [editSaving, setEditSaving] = useState(false)

  const [userSelecionado, setUserSelecionado] =
    useState<User | null>(null)

  const [novoUser, setNovoUser] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    senha: "",
    role_id: null,
  })

  const [editUser, setEditUser] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    senha: "",
    role_id: null,
  })

  useEffect(() => {
    async function carregarUsers() {
      try {
        setLoading(true)
        setError(null)

        const data = await getUsers()

        const tecnicos = data.filter(
          (user) =>
            user.role?.nome?.toLowerCase() === "técnico"
        )

        setUsers(tecnicos)
      } catch (error) {
        console.error(error)
        setError("Erro ao carregar usuários")
      } finally {
        setLoading(false)
      }
    }

    carregarUsers()
  }, [])

  async function handleCriarUser() {
    try {
      setSaving(true)

      const criado = await createUser({
        nome: novoUser.nome.trim(),
        cpf: novoUser.cpf.trim(),
        email: novoUser.email.trim(),
        telefone: novoUser.telefone.trim(),
        senha: novoUser.senha.trim(),
        role_id: novoUser.role_id,
      })

      setUsers((prev) => [criado, ...prev])

      setNovoUser({
        nome: "",
        cpf: "",
        email: "",
        telefone: "",
        senha: "",
        role_id: null,
      })

      setModalCriarOpen(false)
    } catch (error) {
      console.error(error)
      setError("Erro ao criar usuário")
    } finally {
      setSaving(false)
    }
  }

  function handleAbrirEdicao(user: User) {
    setUserSelecionado(user)

    setEditUser({
      nome: user.nome ?? "",
      cpf: user.cpf ?? "",
      email: user.email ?? "",
      telefone: user.telefone ?? "",
      senha: user.senha ?? "",
      role_id: user.role_id ?? null,
    })

    setModalEditarOpen(true)
  }

  async function handleEditarUser() {
    if (!userSelecionado) return

    try {
      setEditSaving(true)

      const atualizado = await updateUser(
        userSelecionado.id,
        {
          nome: editUser.nome.trim(),
          cpf: editUser.cpf.trim(),
          email: editUser.email.trim(),
          telefone: editUser.telefone.trim(),
        }
      )

      setUsers((lista) =>
        lista.map((user) =>
          user.id === atualizado.id
            ? atualizado
            : user
        )
      )

      setModalEditarOpen(false)
      setUserSelecionado(null)
    } catch (error) {
      console.error(error)
      setError("Erro ao atualizar usuário")
    } finally {
      setEditSaving(false)
    }
  }

  async function handleExcluirUser(id: string) {
    if (!confirm("Deseja realmente excluir este usuário?")) {
      return
    }

    try {
      await deleteUser(id)

      setUsers((lista) =>
        lista.filter((user) => user.id !== id)
      )
    } catch (error) {
      console.error(error)
      setError("Erro ao excluir usuário")
    }
  }

  function abrirWhatsapp(
    numero: string,
    nome: string
  ) {
    const numeroLimpo = numero.replace(/\D/g, "")

    const numeroWhatsapp = numeroLimpo.startsWith("55")
      ? numeroLimpo
      : `55${numeroLimpo}`

    const mensagem = `Olá ${nome}, tudo bem?`

    const url =
      `https://wa.me/${numeroWhatsapp}` +
      `?text=${encodeURIComponent(mensagem)}`

    window.open(url, "_blank")
  }

  const usersFiltrados = users.filter((user) => {
    const termo = busca.toLowerCase()

    return (
      user.nome.toLowerCase().includes(termo) ||
      user.cpf?.toLowerCase().includes(termo) ||
      user.email?.toLowerCase().includes(termo) ||
      user.telefone?.toLowerCase().includes(termo)
    )
  })

  if (loading) {
    return <div className="p-6">Carregando...</div>
  }

  if (error) {
    return (
      <div className="p-6 text-destructive">
        {error}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Técnicos
          </h1>

          <p className="text-muted-foreground">
            Gerencie os técnicos do sistema
          </p>
        </div>

        <ModalCriarUser
          open={modalCriarOpen}
          setOpen={setModalCriarOpen}
          user={novoUser}
          setUser={setNovoUser}
          saving={saving}
          onSubmit={handleCriarUser}
        />
      </div>

      <FiltrosUsers
        busca={busca}
        setBusca={setBusca}
      />

      <TabelaUsers
        users={usersFiltrados}
        onEdit={handleAbrirEdicao}
        onDelete={handleExcluirUser}
        onWhatsapp={abrirWhatsapp}
      />

      <ModalEditarUser
        open={modalEditarOpen}
        setOpen={setModalEditarOpen}
        user={editUser}
        setUser={setEditUser}
        saving={editSaving}
        onSubmit={handleEditarUser}
      />

    </div>
  )
}