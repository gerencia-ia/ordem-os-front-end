"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, LayoutDashboard, Settings, Users, Wrench } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function PaginaHome() {
  const router = useRouter()

  const recursos = [
    {
      icone: LayoutDashboard,
      titulo: "Dashboard Completo",
      descricao: "Visualize todas as ordens de serviço em um único painel intuitivo"
    },
    {
      icone: Wrench,
      titulo: "Gestão de Serviços",
      descricao: "Cadastre e gerencie todos os tipos de serviços oferecidos"
    },
    {
      icone: Users,
      titulo: "Gerenciamento de Clientes",
      descricao: "Mantenha um cadastro completo de clientes e histórico de atendimentos"
    },
    {
      icone: Settings,
      titulo: "Kanban Interativo",
      descricao: "Acompanhe o progresso das ordens através de um quadro Kanban visual"
    }
  ]

  const beneficios = [
    "Acompanhamento em tempo real",
    "Relatórios detalhados",
    "Interface intuitiva",
    "Gestão de técnicos",
    "Priorização de ordens",
    "Controle de equipamentos"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">OSControl</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
            Sistema Profissional de
            <span className="text-primary"> Ordens de Serviço</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Gerencie suas ordens de serviço de forma eficiente e organizada. 
            Controle completo desde o cadastro até a conclusão.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/login">
                Acessar Sistema
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#recursos">Conhecer Recursos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="container py-20 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Recursos Principais</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para gerenciar suas ordens de serviço em um único lugar
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {recursos.map((recurso, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <recurso.icone className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-xl">{recurso.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{recurso.descricao}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section className="container py-20">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Por que escolher o OSControl?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Uma solução completa para otimizar o fluxo de trabalho da sua empresa de serviços.
            </p>
            <div className="grid gap-4">
              {beneficios.map((beneficio, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-lg">{beneficio}</span>
                </div>
              ))}
            </div>
          </div>
          <Card className="p-8 bg-primary/5 border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Pronto para começar?</CardTitle>
              <CardDescription className="text-base">
                Acesse o sistema e comece a gerenciar suas ordens de serviço agora mesmo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button size="lg" className="w-full" asChild>
                <Link href="/login">
                  Acessar Sistema
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Sistema completo de gerenciamento
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              <span className="font-semibold">OSControl</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 OSControl. Sistema de Gerenciamento de Ordens de Serviço.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
