'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/src/components/Ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { Label } from '@/src/components/Ui/label';
import type { UseFormReturn } from 'react-hook-form';
import type { CriarOrdemFormData } from '@/src/types/ordem';
import type { Cliente } from '@/src/types/cliente';
import { MapPin, User as UserIcon } from 'lucide-react';

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
  const enderecos = clienteAtual?.enderecos || [];

  return (
    <Card className="bg-card/40 border-border/70 py-4 gap-4">
      <CardHeader className="px-4 pb-2 border-b">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <UserIcon className="size-4 text-primary" />
          <span>1. Cliente e Local de Atendimento</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Seleção de Cliente */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="os-cliente">
              Cliente <span className="text-destructive">*</span>
            </Label>
            <Select
              value={clienteId ? String(clienteId) : ''}
              onValueChange={(val) => onClienteChange(Number(val))}
              disabled={loadingClientes}
            >
              <SelectTrigger id="os-cliente" className="w-full">
                <SelectValue
                  placeholder={
                    loadingClientes
                      ? 'Carregando clientes...'
                      : 'Selecione um cliente'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nome} {c.email ? `(${c.email})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cliente_id && (
              <p className="text-xs text-destructive">
                {errors.cliente_id.message}
              </p>
            )}
          </div>

          {/* Seleção de Endereço */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="os-endereco">
              Endereço de Atendimento{' '}
              <span className="text-destructive">*</span>
            </Label>
            <Select
              value={enderecoId ? String(enderecoId) : ''}
              onValueChange={(val) => {
                setValue('endereco_id', Number(val), { shouldValidate: true });
              }}
              disabled={!clienteId || enderecos.length === 0}
            >
              <SelectTrigger id="os-endereco" className="w-full">
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
                {enderecos.map((end) => (
                  <SelectItem key={end.id} value={String(end.id)}>
                    {end.rua}, {end.numero} - {end.bairro} ({end.cidade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.endereco_id && (
              <p className="text-xs text-destructive">
                {errors.endereco_id.message}
              </p>
            )}
            {clienteId > 0 && enderecos.length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Atenção: O cliente precisa ter ao menos um endereço cadastrado.
              </p>
            )}
          </div>
        </div>

        {/* Preview do Endereço Selecionado */}
        {enderecoId > 0 && (
          <div className="flex items-start gap-2 rounded-md bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/50">
            <MapPin className="size-3.5 text-primary mt-0.5 shrink-0" />
            {(() => {
              const end = enderecos.find(
                (e) => Number(e.id) === Number(enderecoId),
              );
              if (!end) return null;
              return (
                <span>
                  <strong>
                    {end.rua}, {end.numero}
                  </strong>
                  {end.complemento ? ` (${end.complemento})` : ''} -{' '}
                  {end.bairro}, {end.cidade}
                  {end.cep ? ` • CEP: ${end.cep}` : ''}
                </span>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
