import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

interface FiltrosUsersProps {
  busca: string
  setBusca: (value: string) => void
}

export default function FiltrosUsers({
  busca,
  setBusca,
}: FiltrosUsersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtrar</CardTitle>
      </CardHeader>

      <CardContent>
        <Input
          placeholder="Buscar por nome, CPF, e-mail ou telefone..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </CardContent>
    </Card>
  )
}