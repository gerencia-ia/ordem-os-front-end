import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UserForm {
  nome: string
  cpf: string
  email: string
  telefone: string
}

interface ModalEditarUserProps {
  open: boolean
  setOpen: (open: boolean) => void
  user: UserForm
  setUser: React.Dispatch<React.SetStateAction<UserForm>>
  saving: boolean
  onSubmit: () => void
}

export default function ModalEditarUser({
  open,
  setOpen,
  user,
  setUser,
  saving,
  onSubmit,
}: ModalEditarUserProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Editar Técnico
          </DialogTitle>

          <DialogDescription>
            Atualize os dados do técnico
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
            {saving
              ? "Salvando..."
              : "Salvar alterações"}
          </Button>

        </div>

      </DialogContent>

    </Dialog>
  )
}