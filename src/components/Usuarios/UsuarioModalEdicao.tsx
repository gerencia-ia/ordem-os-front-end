'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { useUsuarioForm } from '@/src/hooks/useUsuarioForm';
import { useRoles } from '@/src/hooks/useRoles';
import { usePermissions } from '@/src/hooks/usePermissions';
import { formatarCpf } from '@/src/utils/cpf';
import { formatarTelefone } from '@/src/utils/phone';
import type { Usuario } from '@/src/types/usuario';
import { Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

interface UsuarioModalEdicaoProps {
  user: Usuario | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
  titulo?: string;
}

function UsuarioModalEdicaoForm({
  user,
  onOpenChange,
  onSucesso,
}: {
  user: Usuario;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}) {
  const { roles, loading: loadingRoles } = useRoles();
  const {
    usuario,
    podeAlterarFuncaoDeUsuario,
    filtrarRolesPermitidas,
  } = usePermissions();

  const podeAlterarFuncao = podeAlterarFuncaoDeUsuario(user.id);
  const rolesPermitidas = filtrarRolesPermitidas(roles);
  const isAutoEdicao = String(user.id) === String(usuario?.user_id);

  const { form, salvando, onSubmit } = useUsuarioForm({
    userParaEdicao: user,
    onSuccess: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-2">
      {/* Nome */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-nome">
          Nome Completo <span className="text-destructive">*</span>
        </Label>
        <Input id="edit-nome" placeholder="Nome" {...register('nome')} />
        {errors.nome && (
          <p className="text-xs text-destructive">{errors.nome.message}</p>
        )}
      </div>

      {/* CPF */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-cpf">
          CPF <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="cpf"
          render={({ field }) => (
            <Input
              id="edit-cpf"
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
        <Label htmlFor="edit-email">
          E-mail <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-email"
          type="email"
          placeholder="E-mail"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {/* Telefone */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-telefone">
          Telefone <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="telefone"
          render={({ field }) => (
            <Input
              id="edit-telefone"
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
          <p className="text-xs text-destructive">{errors.telefone.message}</p>
        )}
      </div>

      {/* Nova Senha (Opcional) */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-senha">Nova Senha (Opcional)</Label>
        <Input
          id="edit-senha"
          type="password"
          placeholder="Deixe em branco para manter a atual"
          {...register('senha')}
        />
        {errors.senha && (
          <p className="text-xs text-destructive">{errors.senha.message}</p>
        )}
      </div>

      {/* Função / Role */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-role_id">Função no Sistema</Label>
        <Controller
          control={control}
          name="role_id"
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ''}
              onValueChange={(val) => field.onChange(Number(val))}
              disabled={loadingRoles || !podeAlterarFuncao}
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
        {!podeAlterarFuncao && (
          <p className="text-[11px] text-muted-foreground italic">
            {isAutoEdicao
              ? 'Você não pode alterar sua própria função no sistema.'
              : 'Você não possui permissão para alterar a função deste usuário.'}
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
              Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </div>
    </form>
  );
}

export function UsuarioModalEdicao({
  user,
  aberto,
  onOpenChange,
  onSucesso,
  titulo = 'Editar Usuário',
}: UsuarioModalEdicaoProps) {
  if (!user) return null;

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{titulo}: {user.nome}</DialogTitle>
          <DialogDescription>
            Atualize as informações cadastrais e permissões do usuário.
          </DialogDescription>
        </DialogHeader>

        <UsuarioModalEdicaoForm
          key={user.id}
          user={user}
          onOpenChange={onOpenChange}
          onSucesso={onSucesso}
        />
      </DialogContent>
    </Dialog>
  );
}
