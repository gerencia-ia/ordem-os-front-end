'use client';

import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/Ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { Spinner } from '@/src/components/Ui/spinner';
import { useUsuarioForm } from '@/src/hooks/useUsuarioForm';
import { useRoles } from '@/src/hooks/useRoles';
import { usePermissions } from '@/src/hooks/usePermissions';
import { formatarCpf } from '@/src/utils/cpf';
import { formatarTelefone } from '@/src/utils/phone';
import type { Usuario } from '@/src/types/usuario';

interface UsuarioModalFormProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  usuario?: Usuario | null;
  roleIdPadrao?: number;
  titulo?: string;
  onSucesso: () => void;
}

export function UsuarioModalForm({
  aberto,
  onOpenChange,
  usuario: user = null,
  roleIdPadrao,
  titulo,
  onSucesso,
}: UsuarioModalFormProps) {
  const isEdicao = Boolean(user);
  const { roles, loading: loadingRoles } = useRoles();
  const {
    usuario: usuarioLogado,
    podeAlterarFuncaoDeUsuario,
    filtrarRolesPermitidas,
    isSecretaria,
  } = usePermissions();

  const rolesPermitidas = filtrarRolesPermitidas(roles);
  const roleIdInicial =
    roleIdPadrao ||
    (rolesPermitidas.length === 1 ? Number(rolesPermitidas[0].id) : undefined);

  const podeAlterarFuncao = user ? podeAlterarFuncaoDeUsuario(user.id) : true;
  const isAutoEdicao = user
    ? String(user.id) === String(usuarioLogado?.id)
    : false;

  const { form, salvando, onSubmit } = useUsuarioForm({
    userParaEdicao: user,
    roleIdPadrao: isEdicao ? undefined : roleIdInicial,
    onSuccess: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  useEffect(() => {
    if (aberto && !user) {
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
  }, [aberto, user, roleIdInicial, form]);

  const {
    register,
    control,
    formState: { errors },
  } = form;

  const prefix = isEdicao ? 'edit-' : '';

  return (
    <ModalFormulario open={aberto} onOpenChange={onOpenChange} tamanho="md">
      <ModalFormularioHeader
        title={
          user
            ? `${titulo || 'Editar Usuário'}: ${user.nome}`
            : titulo || 'Cadastrar Novo Usuário'
        }
        description={
          isEdicao
            ? 'Atualize as informações cadastrais e permissões do usuário.'
            : 'Preencha os dados do novo usuário para conceder acesso ao sistema.'
        }
      />

      <form
        onSubmit={onSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <ModalFormularioBody>
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.nome)}>
              <FieldLabel htmlFor={`${prefix}nome`}>
                Nome Completo <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id={`${prefix}nome`}
                placeholder="Ex: Carlos Silva"
                aria-invalid={Boolean(errors.nome)}
                {...register('nome')}
              />
              <FieldError errors={[errors.nome]} />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.cpf)}>
                <FieldLabel htmlFor={`${prefix}cpf`}>
                  CPF <span className="text-destructive">*</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="cpf"
                  render={({ field }) => (
                    <Input
                      id={`${prefix}cpf`}
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      aria-invalid={Boolean(errors.cpf)}
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(formatarCpf(e.target.value))
                      }
                      maxLength={14}
                    />
                  )}
                />
                <FieldError errors={[errors.cpf]} />
              </Field>

              <Field data-invalid={Boolean(errors.telefone)}>
                <FieldLabel htmlFor={`${prefix}telefone`}>
                  Telefone <span className="text-destructive">*</span>
                </FieldLabel>
                <Controller
                  control={control}
                  name="telefone"
                  render={({ field }) => (
                    <Input
                      id={`${prefix}telefone`}
                      type="tel"
                      inputMode="tel"
                      placeholder="(11) 98765-4321"
                      aria-invalid={Boolean(errors.telefone)}
                      value={field.value || ''}
                      onChange={(e) =>
                        field.onChange(formatarTelefone(e.target.value))
                      }
                      maxLength={15}
                    />
                  )}
                />
                <FieldError errors={[errors.telefone]} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.email)}>
                <FieldLabel htmlFor={`${prefix}email`}>
                  E-mail <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id={`${prefix}email`}
                  type="email"
                  placeholder="carlos@exemplo.com"
                  aria-invalid={Boolean(errors.email)}
                  {...register('email')}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field data-invalid={Boolean(errors.role_id)}>
                <FieldLabel htmlFor={`${prefix}role_id`}>
                  Função no Sistema{' '}
                  {!isEdicao && <span className="text-destructive">*</span>}
                </FieldLabel>
                <Controller
                  control={control}
                  name="role_id"
                  render={({ field }) => (
                    <Select
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(val) => field.onChange(Number(val))}
                      disabled={loadingRoles || !podeAlterarFuncao}
                    >
                      <SelectTrigger
                        id={`${prefix}role_id`}
                        className="w-full"
                        aria-invalid={Boolean(errors.role_id)}
                      >
                        <SelectValue
                          placeholder={
                            loadingRoles
                              ? 'Carregando funções...'
                              : 'Selecione uma função'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {rolesPermitidas.map((role) => (
                            <SelectItem key={role.id} value={String(role.id)}>
                              {role.nome}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError errors={[errors.role_id]} />
              </Field>
            </div>

            {!isEdicao && isSecretaria && (
              <FieldDescription className="text-xs">
                Perfil Secretaria: permissão restrita para cadastrar apenas
                Técnicos.
              </FieldDescription>
            )}

            {isEdicao && !podeAlterarFuncao && (
              <FieldDescription className="text-xs italic">
                {isAutoEdicao
                  ? 'Você não pode alterar sua própria função no sistema.'
                  : 'Você não possui permissão para alterar a função deste usuário.'}
              </FieldDescription>
            )}

            <Field data-invalid={Boolean(errors.senha)}>
              <FieldLabel htmlFor={`${prefix}senha`}>
                {isEdicao ? (
                  'Nova Senha (Opcional)'
                ) : (
                  <>
                    Senha Inicial <span className="text-destructive">*</span>
                  </>
                )}
              </FieldLabel>
              <Input
                id={`${prefix}senha`}
                type="password"
                placeholder={
                  isEdicao
                    ? 'Deixe em branco para manter a atual'
                    : 'Mínimo 6 caracteres'
                }
                aria-invalid={Boolean(errors.senha)}
                {...register('senha')}
              />
              <FieldError errors={[errors.senha]} />
            </Field>
          </FieldGroup>
        </ModalFormularioBody>

        <ModalFormularioFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={salvando}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando}>
            {salvando && <Spinner data-icon="inline-start" />}
            {salvando
              ? isEdicao
                ? 'Salvando...'
                : 'Cadastrando...'
              : isEdicao
                ? 'Salvar Alterações'
                : 'Cadastrar'}
          </Button>
        </ModalFormularioFooter>
      </form>
    </ModalFormulario>
  );
}
