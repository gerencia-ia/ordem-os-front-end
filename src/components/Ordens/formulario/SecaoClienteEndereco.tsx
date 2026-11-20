'use client';

import { useMemo } from 'react';
import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
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
import type { UseFormReturn } from 'react-hook-form';
import type { CriarOrdemFormData } from '@/src/types/ordem';
import type { Cliente } from '@/src/types/cliente';
import { AlertTriangle, MapPin, User as UserIcon } from 'lucide-react';

interface SecaoClienteEnderecoProps {
  form: UseFormReturn<CriarOrdemFormData>;
  clientes: Cliente[];
  clienteAtual: Cliente | null;
  loadingClientes: boolean;
  onClienteChange: (clienteId: number) => void;
}

export function SecaoClienteEndereco({
  form,
  clientes,
  clienteAtual,
  loadingClientes,
  onClienteChange,
}: SecaoClienteEnderecoProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const clienteId = watch('cliente_id');
  const enderecoId = watch('endereco_id');
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
      className="bg-card/40 border-border/70"
      contentClassName="flex flex-col gap-4"
    >
      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field data-invalid={Boolean(errors.cliente_id)}>
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
            aria-invalid={Boolean(errors.cliente_id)}
          />
          <FieldError errors={[errors.cliente_id]} />
        </Field>

        <Field data-invalid={Boolean(errors.endereco_id)}>
          <FieldLabel htmlFor="os-endereco">
            Endereço de Atendimento <span className="text-destructive">*</span>
          </FieldLabel>
          <Select
            value={enderecoId ? String(enderecoId) : ''}
            onValueChange={(val) => {
              setValue('endereco_id', Number(val), { shouldValidate: true });
            }}
            disabled={!clienteId || enderecos.length === 0}
          >
            <SelectTrigger
              id="os-endereco"
              className="w-full"
              aria-invalid={Boolean(errors.endereco_id)}
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
          <FieldError errors={[errors.endereco_id]} />
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
    </CardColapsavel>
  );
}
