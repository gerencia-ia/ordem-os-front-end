"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Kanban, List, Users, Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface BarraLateralProps {
  estaAberta: boolean
  aoFechar: () => void
}

type SubmenuItem = {
  href: string
  label: string
  roles: string[]
}

type MenuItem = {
  href: string
  label: string
  icon: any
  roles: string[]
  children?: SubmenuItem[]
}

export function BarraLateral({ estaAberta, aoFechar }: BarraLateralProps) {
  const pathname = usePathname()
  const [roleUsuario, setRoleUsuario] = useState<string | null>(null)

  useEffect(() => {
    // Obter role do localStorage
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("role")
      setRoleUsuario(role)
    }
  }, [])

  const todosMenus: MenuItem[] = [
    { href: "/", label: "Painel", icon: Home, roles: ["SECRETARIA", "TECNICO"] },
    { href: "/kanban", label: "Quadro Kanban", icon: Kanban, roles: ["SECRETARIA", "TECNICO"] },
    { href: "/ordens", label: "Ordens de Serviço", icon: List, roles: ["SECRETARIA", "TECNICO"] },
    { href: "/clientes", label: "Clientes", icon: Users, roles: ["SECRETARIA", "TECNICO"] },
    {
      href: "/configuracoes",
      label: "Configurações",
      icon: Settings,
      roles: ["SECRETARIA"],
      children: [
        { href: "/tecnicos", label: "Técnicos", roles: ["SECRETARIA"] },
        { href: "/servicos", label: "Serviços", roles: ["SECRETARIA"] },
        { href: "/categorias-servicos", label: "Categorias de Serviço", roles: ["SECRETARIA"] },
      ],
    },
  ]

  // Filtrar menus baseado na role do usuário
  const menus = todosMenus
    .filter((menu) => {
      if (!roleUsuario) return true // Se não houver role, mostrar tudo
      return menu.roles.includes(roleUsuario)
    })
    .map((menu) => {
      if (!menu.children) return menu

      const childrenFilhos = menu.children.filter((child) => {
        if (!roleUsuario) return true
        return child.roles.includes(roleUsuario)
      })

      return { ...menu, children: childrenFilhos }
    })

  const isAtivo = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const isAtivoExato = (href: string) => pathname === href

  const isAtivoOuFilho = (href: string, children?: SubmenuItem[]) => {
    const ativoNoPai = isAtivo(href)
    const ativoNoFilho = (children || []).some((child) => isAtivoExato(child.href))
    return ativoNoPai || ativoNoFilho
  }

  return (
    <>
      {/* Overlay para mobile */}
      {estaAberta && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={aoFechar} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-primary text-primary-foreground transition-all duration-300 z-40 lg:relative lg:z-0 lg:translate-x-0 flex flex-col",
          estaAberta ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
              <span className="font-bold text-primary text-sm">OS</span>
            </div>
            <span className="font-bold text-lg">OSControl</span>
          </div>
          <Button variant="ghost" size="icon" onClick={aoFechar} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon
            const ativo = isAtivoOuFilho(menu.href, menu.children)
            return (
              <div key={menu.href} className="space-y-1">
                <Link href={menu.href}>
                  <button
                    onClick={aoFechar}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left",
                      ativo
                        ? "bg-primary-foreground text-primary font-semibold"
                        : "hover:bg-primary/80 text-primary-foreground/90",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{menu.label}</span>
                  </button>
                </Link>

                {menu.children && menu.children.length > 0 && (
                  <div className="ml-4 pl-3 border-l border-primary-foreground/20 space-y-1">
                    {menu.children.map((child) => {
                      const childAtivo = isAtivoExato(child.href)

                      return (
                        <Link key={child.href} href={child.href}>
                          <button
                            onClick={aoFechar}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                              childAtivo
                                ? "bg-primary-foreground text-primary font-semibold"
                                : "text-primary-foreground/80 hover:bg-primary/80",
                            )}
                          >
                            {child.label}
                          </button>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="p-4 border-t border-primary/20">
          <p className="text-xs text-primary-foreground/70">v1.0.0</p>
        </div>
      </div>
    </>
  )
}
