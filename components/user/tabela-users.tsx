import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  Edit,
  Trash2,
  Phone,
  MessageCircle,
} from "lucide-react"

import type { User } from "@/lib/tipos"

interface TabelaUsersProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: string) => void
  onWhatsapp: (numero: string, nome: string) => void
}

export default function TabelaUsers({
  users,
  onEdit,
  onDelete,
  onWhatsapp,
}: TabelaUsersProps) {
  return (
    <Card>

      <CardHeader>
        <CardTitle>
          Total: {users.length} técnicos
        </CardTitle>
      </CardHeader>

      <CardContent>

        <div className="overflow-x-auto">

          <Table>

            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {users.map((user) => (
                <TableRow key={user.id}>

                  <TableCell className="font-medium">
                    {user.nome}
                  </TableCell>

                  <TableCell>
                    {user.cpf || "-"}
                  </TableCell>

                  <TableCell>
                    {user.email || "-"}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">

                      <Phone className="h-4 w-4 text-muted-foreground" />

                      <span>
                        {user.telefone || "-"}
                      </span>

                      {user.telefone && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto"
                          onClick={() =>
                            onWhatsapp(
                              user.telefone,
                              user.nome
                            )
                          }
                        >
                          <MessageCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      )}

                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(user.id)}
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
  )
}