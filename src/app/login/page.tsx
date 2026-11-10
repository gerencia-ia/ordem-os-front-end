'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { Label } from '@/src/components/Ui/label';
import { Alert, AlertDescription } from '@/src/components/Ui/alert';
import { Checkbox } from '@/src/components/Ui/checkbox';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { loginUsuario } from '@/src/services/auth.service';

export default function LoginPage() {
  const router = useRouter();
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrarMe, setLembrarMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);

    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      // Remove pontos e hífen
      const cpfLimpo = cpf.replace(/\D/g, '');

      if (!cpfLimpo || !senha) {
        setErro('Por favor, preencha todos os campos');
        setLoading(false);
        return;
      }

      // Opcional: validar se possui exatamente 11 dígitos
      if (cpfLimpo.length !== 11) {
        setErro('CPF inválido');
        setLoading(false);
        return;
      }

      // Envia o CPF sem máscara para a API (com parâmetro 'password')
      await loginUsuario(cpfLimpo, senha);

      if (lembrarMe) {
        localStorage.setItem('cpf', cpfLimpo);
      }

      router.push('/ordens');
    } catch (err: unknown) {
      const mensagemErro =
        err instanceof Error
          ? err.message
          : 'Erro ao fazer login. Verifique suas credenciais.';
      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  };
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
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  maxLength={14}
                  disabled={loading}
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
                    className="text-xs text-primary hover:underline transition-colors"
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
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lembrar"
                  checked={lembrarMe}
                  onCheckedChange={(checked) =>
                    setLembrarMe(checked as boolean)
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="lembrar"
                  className="text-sm font-normal text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  Lembrar-me neste dispositivo
                </Label>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="animate-spin"
                      data-icon="inline-start"
                    />
                    <span>Entrando...</span>
                  </>
                ) : (
                  <>
                    <LogIn data-icon="inline-start" />
                    <span>Entrar</span>
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Não possui uma conta?{' '}
              <a
                href="#"
                className="text-primary hover:underline font-semibold"
              >
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
  );
}
