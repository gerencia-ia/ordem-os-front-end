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
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Role } from "@/lib/tipos"
import { getRoles } from "@/lib/api/roles"

interface UserForm {
  nome: string
  cpf: string
  email: string
  telefone: string
  senha: string
  role_id: number
}

interface ModalCriarUserProps {
  open: boolean
  setOpen: (open: boolean) => void
  user: UserForm
  setUser: React.Dispatch<React.SetStateAction<UserForm>>
  saving: boolean
  onSubmit: () => void
}

export default function ModalCriarUser({
  open,
  setOpen,
  user,
  setUser,
  saving,
  onSubmit,
}: ModalCriarUserProps) {
    const [roles, setRoles] = useState<Role[]>([])

    useEffect(() => {
    async function carregarRoles() {
        try {
        const data = await getRoles()
        setRoles(data)
        } catch (error) {
        console.error("Erro ao carregar roles:", error)
        }
    }

    carregarRoles()
    }, [])  
  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Técnico
        </Button>
      </DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Adicionar Novo Técnico
          </DialogTitle>

          <DialogDescription>
            Preencha os dados do novo técnico
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          <Input
            placeholder="Nome completo"
            value={user.nome}
            onChange={(e) =>
              setUser((state) => ({
                ...state,
                nome: e.target.value,
              }))
            }
          />

          <Input
            placeholder="CPF"
            value={user.cpf}
            onChange={(e) =>
              setUser((state) => ({
                ...state,
                cpf: e.target.value,
              }))
            }
          />

          <Input
            placeholder="E-mail"
            type="email"
            value={user.email}
            onChange={(e) =>
              setUser((state) => ({
                ...state,
                email: e.target.value,
              }))
            }
          />

          <Input
            placeholder="Telefone"
            value={user.telefone}
            onChange={(e) =>
              setUser((state) => ({
                ...state,
                telefone: e.target.value,
              }))
            }
          />

            <Input
            placeholder="Senha"
            value={user.senha}
            onChange={(e) =>
              setUser((state) => ({
                ...state,
                senha: e.target.value,
              }))
            }
          />

          <select
            value={user.role_id ?? ""}
            onChange={(e) =>
                setUser((state) => ({
                ...state,
                role_id: Number(e.target.value),
                }))
            }
            className="w-full rounded-md border px-3 py-2"
            >
            <option value="">Selecione uma função</option>

            {roles.map((role) => (
                <option key={role.id} value={role.id}>
                {role.nome}
                </option>
            ))}
          </select>

          <Button
            className="w-full"
            onClick={onSubmit}
            disabled={
              saving ||
              !user.nome.trim() ||
              !user.cpf.trim() ||
              !user.email.trim() ||
              !user.telefone.trim()
            }
          >
            {saving ? "Salvando..." : "Adicionar"}
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  )
}