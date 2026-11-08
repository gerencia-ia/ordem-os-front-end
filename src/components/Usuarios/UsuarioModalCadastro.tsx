'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/Ui/dialog';
import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { Label } from '@/src/components/Ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { useUsuarioForm } from '@/src/hooks/useUsuarioForm';
import { useRoles } from '@/src/hooks/useRoles';
import { usePermissions } from '@/src/hooks/usePermissions';
import { formatarCpf } from '@/src/utils/cpf';
import { formatarTelefone } from '@/src/utils/phone';
import { Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

interface UsuarioModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
  roleIdPadrao?: number;
  titulo?: string;
}

export function UsuarioModalCadastro({
  aberto,
  onOpenChange,
  onSucesso,
  roleIdPadrao,
  titulo = 'Cadastrar Novo Usuário',
}: UsuarioModalCadastroProps) {
  const { roles, loading: loadingRoles } = useRoles();
  const { filtrarRolesPermitidas, isSecretaria } = usePermissions();

  const rolesPermitidas = filtrarRolesPermitidas(roles);
  const roleIdInicial =
    roleIdPadrao ||
    (rolesPermitidas.length === 1 ? Number(rolesPermitidas[0].id) : undefined);

  const { form, salvando, onSubmit } = useUsuarioForm({
    userParaEdicao: null,
    roleIdPadrao: roleIdInicial,
    onSuccess: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  useEffect(() => {
    if (aberto) {
      form.reset({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        senha: '',
        role_id: roleIdInicial || ('' as unknown as number),
        isEdicao: false,
      });
    }
  }, [aberto, roleIdInicial, form]);

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo usuário para conceder acesso ao sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          {/* Nome */}
          <div className="space-y-1.5">
            <Label htmlFor="nome">
              Nome Completo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nome"
              placeholder="Ex: Carlos Silva"
              {...register('nome')}
            />
            {errors.nome && (
              <p className="text-xs text-destructive">{errors.nome.message}</p>
            )}
          </div>

          {/* CPF */}
          <div className="space-y-1.5">
            <Label htmlFor="cpf">
              CPF <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="cpf"
              render={({ field }) => (
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(formatarCpf(e.target.value))}
                  maxLength={14}
                />
              )}
            />
            {errors.cpf && (
              <p className="text-xs text-destructive">{errors.cpf.message}</p>
            )}
          </div>

          {/* E-mail */}
          <div className="space-y-1.5">
            <Label htmlFor="email">
              E-mail <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="carlos@exemplo.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-1.5">
            <Label htmlFor="telefone">
              Telefone <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="telefone"
              render={({ field }) => (
                <Input
                  id="telefone"
                  placeholder="(11) 98765-4321"
                  value={field.value || ''}
                  onChange={(e) =>
                    field.onChange(formatarTelefone(e.target.value))
                  }
                  maxLength={15}
                />
              )}
            />
            {errors.telefone && (
              <p className="text-xs text-destructive">
                {errors.telefone.message}
              </p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <Label htmlFor="senha">
              Senha Inicial <span className="text-destructive">*</span>
            </Label>
            <Input
              id="senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              {...register('senha')}
            />
            {errors.senha && (
              <p className="text-xs text-destructive">{errors.senha.message}</p>
            )}
          </div>

          {/* Função / Role */}
          <div className="space-y-1.5">
            <Label htmlFor="role_id">
              Função no Sistema <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="role_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => field.onChange(Number(val))}
                  disabled={loadingRoles}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        loadingRoles
                          ? 'Carregando funções...'
                          : 'Selecione uma função'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesPermitidas.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {isSecretaria && (
              <p className="text-[11px] text-muted-foreground">
                Perfil Secretaria: permissão restrita para cadastrar apenas
                Técnicos.
              </p>
            )}
            {errors.role_id && (
              <p className="text-xs text-destructive">
                {errors.role_id.message}
              </p>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={salvando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                'Cadastrar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
