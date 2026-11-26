'use client';

import { useMemo, useState } from 'react';
import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Button } from '@/src/components/Ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/Ui/field';
import {
  ComboboxSingle,
  type ComboboxOption,
} from '@/src/components/Ui/combobox';
import { ClienteModalCadastro } from '@/src/components/Clientes/ClienteModalCadastro';
import type { Path, PathValue, UseFormReturn } from 'react-hook-form';
import type { CriarOrdemFormData } from '@/src/types/ordem';
import type { Cliente } from '@/src/types/cliente';
import { AlertTriangle, MapPin, Plus, User as UserIcon } from 'lucide-react';

interface ClienteEnderecoFields {
  cliente_id: number;
  endereco_id: number;
}

interface SecaoClienteEnderecoProps<
  T extends ClienteEnderecoFields = CriarOrdemFormData,
> {
  form: UseFormReturn<T>;
  clientes: Cliente[];
  clienteAtual: Cliente | null;
  loadingClientes: boolean;
  onClienteChange: (clienteId: number) => void;
  onAdicionarCliente?: (cliente?: Cliente) => void;
}

export function SecaoClienteEndereco<
  T extends ClienteEnderecoFields = CriarOrdemFormData,
>({
  form,
  clientes,
  clienteAtual,
  loadingClientes,
  onClienteChange,
  onAdicionarCliente,
}: SecaoClienteEnderecoProps<T>) {
  const [modalNovoClienteAberto, setModalNovoClienteAberto] = useState(false);
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const clienteId = Number(watch('cliente_id' as Path<T>)) || 0;
  const enderecoId = Number(watch('endereco_id' as Path<T>)) || 0;
  const clienteError = errors.cliente_id as { message?: string } | undefined;
  const enderecoError = errors.endereco_id as { message?: string } | undefined;
  const enderecos = useMemo(
    () => clienteAtual?.enderecos || [],
    [clienteAtual?.enderecos],
  );

  const clienteOptions: ComboboxOption[] = useMemo(
    () =>
      clientes.map((c) => ({
        value: String(c.id),
        label: c.nome,
        description: c.email || undefined,
      })),
    [clientes],
  );

  const enderecoSelecionado = useMemo(
    () => enderecos.find((e) => Number(e.id) === Number(enderecoId)),
    [enderecos, enderecoId],
  );

  return (
    <CardColapsavel
      titulo="1. Cliente e Local de Atendimento"
      icone={<UserIcon className="size-4 text-primary" />}
      resumo={clienteAtual?.nome || 'Selecione cliente e endereço'}
      defaultOpenMobile={true}
      hasError={Boolean(errors.cliente_id || errors.endereco_id)}
      headerAction={
        onAdicionarCliente ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setModalNovoClienteAberto(true)}
            className="h-7 gap-1 border-dashed text-xs"
          >
            <Plus className="size-3.5" /> Novo
            <span className="hidden sm:inline">Cliente</span>
          </Button>
        ) : undefined
      }
      className="bg-card/40 border-border/70"
      contentClassName="flex flex-col gap-4"
    >
      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field data-invalid={Boolean(clienteError)}>
          <FieldLabel htmlFor="os-cliente">
            Cliente <span className="text-destructive">*</span>
          </FieldLabel>
          <ComboboxSingle
            id="os-cliente"
            options={clienteOptions}
            value={clienteId ? String(clienteId) : ''}
            onValueChange={(val) => onClienteChange(val ? Number(val) : 0)}
            placeholder={
              loadingClientes
                ? 'Carregando clientes...'
                : 'Selecione um cliente'
            }
            searchPlaceholder="Buscar cliente por nome ou e-mail..."
            emptyMessage="Nenhum cliente encontrado."
            disabled={loadingClientes}
            aria-invalid={Boolean(clienteError)}
          />
          <FieldError errors={[clienteError]} />
        </Field>

        <Field data-invalid={Boolean(enderecoError)}>
          <FieldLabel htmlFor="os-endereco">
            Endereço de Atendimento <span className="text-destructive">*</span>
          </FieldLabel>
          <Select
            value={enderecoId ? String(enderecoId) : ''}
            onValueChange={(val) => {
              setValue(
                'endereco_id' as Path<T>,
                Number(val) as PathValue<T, Path<T>>,
                { shouldValidate: true },
              );
            }}
            disabled={!clienteId || enderecos.length === 0}
          >
            <SelectTrigger
              id="os-endereco"
              className="w-full"
              aria-invalid={Boolean(enderecoError)}
            >
              <SelectValue
                placeholder={
                  !clienteId
                    ? 'Selecione o cliente primeiro'
                    : enderecos.length === 0
                      ? 'Cliente não possui endereços'
                      : 'Selecione o endereço'
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {enderecos.map((end) => (
                  <SelectItem key={end.id} value={String(end.id)}>
                    {end.rua}, {end.numero} - {end.bairro} ({end.cidade})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldError errors={[enderecoError]} />
          {clienteId > 0 && enderecos.length === 0 && (
            <p className="text-warning flex items-center gap-1.5 text-xs">
              <AlertTriangle className="size-3.5 shrink-0" />
              <span>
                O cliente precisa ter ao menos um endereço cadastrado.
              </span>
            </p>
          )}
        </Field>
      </FieldGroup>

      {enderecoSelecionado && (
        <div className="bg-muted/40 border-border/50 text-muted-foreground flex items-start gap-2 rounded-md border p-2.5 text-xs">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
          <span>
            <strong className="text-foreground">
              {enderecoSelecionado.rua}, {enderecoSelecionado.numero}
            </strong>
            {enderecoSelecionado.complemento
              ? ` (${enderecoSelecionado.complemento})`
              : ''}{' '}
            - {enderecoSelecionado.bairro}, {enderecoSelecionado.cidade}
            {enderecoSelecionado.cep
              ? ` • CEP: ${enderecoSelecionado.cep}`
              : ''}
          </span>
        </div>
      )}

      {onAdicionarCliente && (
        <ClienteModalCadastro
          aberto={modalNovoClienteAberto}
          onOpenChange={setModalNovoClienteAberto}
          onSucesso={onAdicionarCliente}
        />
      )}
    </CardColapsavel>
  );
}
