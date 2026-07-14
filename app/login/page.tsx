"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { LogIn, AlertCircle } from "lucide-react"
import { loginUsuario, salvarToken } from "@/lib/api/autenticacao"

export default function LoginPage() {
  const router = useRouter()
  const [cpf, setCpf] = useState("")
  const [senha, setSenha] = useState("")
  const [lembrarMe, setLembrarMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)
    setLoading(true)

    try {
      if (!cpf || !senha) {
        setErro("Por favor, preencha todos os campos")
        setLoading(false)
        return
      }

      // Chamar a API de login
      const response = await loginUsuario(cpf, senha)

      // Salvar token
      salvarToken(response.token,response.role)

      // Salvar preferências se marcar "Lembrar-me"
      if (lembrarMe) {
        localStorage.setItem("cpf", cpf)
      }

      // Redirecionar para o dashboard
      router.push("/ordens")
    } catch (err: any) {
      setErro(err.message || "Erro ao fazer login. Verifique suas credenciais.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md z-10">
        <Card className="shadow-2xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <LogIn className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">OSControl</CardTitle>
            <CardDescription className="text-center">
              Sistema de Gerenciamento de Ordens de Serviço
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Error Alert */}
            {erro && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CPF Field */}
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-medium">
                  CPF
                </Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  disabled={loading}
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha" className="text-sm font-medium">
                    Senha
                  </Label>
                  <a
                    href="#"
                    className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  disabled={loading}
                  className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lembrar"
                  checked={lembrarMe}
                  onCheckedChange={(checked) => setLembrarMe(checked as boolean)}
                  disabled={loading}
                />
                <label
                  htmlFor="lembrar"
                  className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  Lembrar-me neste dispositivo
                </label>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Entrando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-950 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            {/* Demo Login */}
            <div className="space-y-2 text-sm text-center text-muted-foreground">
              <p>Credenciais de Demonstração:</p>
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg space-y-1 text-xs">
                <p>
                  <strong>CPF:</strong> 12345678900
                </p>
                <p>
                  <strong>Senha:</strong> sua_senha
                </p>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Não possui uma conta?{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                Cadastre-se
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-sm text-white dark:text-slate-400 mt-8">
          © 2026 OSControl. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
