"use client"

import { Bell, LogOut, Menu, Moon, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { removerToken, getUsuario } from "@/lib/api/autenticacao"

interface BarraNavegacaoProps {
  onMenuToggle: () => void
}

const formatCPF = (cpf?: string) => {
  if (!cpf) return "-"

  const numbers = cpf.replace(/\D/g, "").slice(0, 11)

  if (numbers.length <= 3) return numbers
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  }

  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`
}

export function BarraNavegacao({ onMenuToggle }: BarraNavegacaoProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const usuario = getUsuario()

  const handleLogout = () => {
    removerToken()
    window.location.href = "/login"
  }

  return (
    <div className="flex items-center justify-between bg-card border-b border-border px-6 py-3 sticky top-0 z-40 shadow-sm">
  <div className="flex items-center gap-4">
    <Button
      variant="ghost"
      size="icon"
      onClick={onMenuToggle}
      className="lg:hidden"
    >
      <Menu className="h-5 w-5" />
    </Button>

    <h1 className="text-xl font-bold text-primary hidden sm:block">
      Ordem de Serviço
    </h1>
  </div>

  <div className="flex items-center gap-2">
    <Button variant="ghost" size="icon">
      <Bell className="h-5 w-5" />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-45">
        {/* Informações do usuário */}
        <div className="px-3 py-2">
          <p className="font-semibold text-sm">
            {usuario?.nome ?? "Usuário"}
          </p>

          <p className="text-xs text-muted-foreground">
            CPF: {formatCPF(usuario?.cpf)}
          </p>

          <p className="text-xs text-muted-foreground">
            Perfil: {usuario?.role ?? "-"}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          Meu Perfil
        </DropdownMenuItem>

        <DropdownMenuItem>
          Configurações
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>
  )
}
