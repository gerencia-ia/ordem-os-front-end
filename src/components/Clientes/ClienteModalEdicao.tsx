'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/src/components/Ui/dialog';
import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { Label } from '@/src/components/Ui/label';
import { useClienteForm } from '@/src/hooks/useClienteForm';
import type { Cliente } from '@/src/types/cliente';
import { Plus, Trash2, Search, Loader2 } from 'lucide-react';

interface ClienteModalEdicaoProps {
  cliente: Cliente | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}

function ClienteModalEdicaoForm({
  cliente,
  onOpenChange,
  onSucesso,
}: {
  cliente: Cliente;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}) {
  const {
    form,
    telefonesFieldArray,
    enderecosFieldArray,
    salvando,
    buscandoCep,
    consultarCep,
    removerTelefone,
    removerEndereco,
    onSubmit,
  } = useClienteForm({
    clienteParaEdicao: cliente,
    onSuccess: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  const telefonesAtivos = telefonesFieldArray.fields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => !field._destroy);

  const enderecosAtivos = enderecosFieldArray.fields
    .map((field, index) => ({ field, index }))
    .filter(({ field }) => !field._destroy);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 pt-2">
      {/* Dados Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <Label htmlFor="edit-nome">
            Nome Completo <span className="text-destructive">*</span>
          </Label>
          <Input id="edit-nome" placeholder="Nome" {...register('nome')} />
          {errors.nome && (
            <p className="text-xs text-destructive">{errors.nome.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-email">Email</Label>
          <Input
            id="edit-email"
            type="email"
            placeholder="Email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="edit-data-visita">Data da Última Visita</Label>
          <Input
            id="edit-data-visita"
            type="date"
            {...register('data_ultima_visita')}
          />
        </div>
      </div>

      {/* Telefones */}
      <div className="flex flex-col gap-3 border-t pt-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Telefones</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => telefonesFieldArray.append({ numero: '' })}
            className="h-7 text-xs gap-1"
          >
            <Plus className="size-3.5" /> Adicionar Telefone
          </Button>
        </div>

        {telefonesAtivos.map(({ field, index }) => (
          <div key={field.id} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                placeholder="(11) 98765-4321"
                {...register(`telefones.${index}.numero`)}
              />
              {errors.telefones?.[index]?.numero && (
                <p className="text-xs text-destructive mt-1">
                  {errors.telefones[index]?.numero?.message}
                </p>
              )}
            </div>
            {telefonesAtivos.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removerTelefone(index)}
                className="size-9 text-muted-foreground hover:text-destructive shrink-0"
                title="Remover telefone"
              >
                <Trash2 className="size-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Endereços */}
      <div className="flex flex-col gap-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Endereços</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              enderecosFieldArray.append({
                cep: '',
                rua: '',
                numero: '',
                bairro: '',
                complemento: '',
                cidade: '',
              })
            }
            className="h-7 text-xs gap-1"
          >
            <Plus className="size-3.5" /> Adicionar Endereço
          </Button>
        </div>

        {enderecosAtivos.map(({ field, index }) => (
          <div
            key={field.id}
            className="p-3 border rounded-md bg-muted/20 flex flex-col gap-3 relative"
          >
            {enderecosAtivos.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removerEndereco(index)}
                className="absolute top-2 right-2 size-7 text-muted-foreground hover:text-destructive"
                title="Remover endereço"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs">CEP</Label>
                <div className="flex gap-1.5">
                  <Input
                    placeholder="00000-000"
                    {...register(`enderecos.${index}.cep`, {
                      onBlur: () => consultarCep(index),
                    })}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => consultarCep(index)}
                    disabled={buscandoCep === index}
                    className="shrink-0"
                    title="Buscar CEP"
                  >
                    {buscandoCep === index ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Search className="size-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <Label className="text-xs">Rua / Logradouro *</Label>
                <Input
                  placeholder="Rua das Flores"
                  {...register(`enderecos.${index}.rua`)}
                />
                {errors.enderecos?.[index]?.rua && (
                  <p className="text-xs text-destructive">
                    {errors.enderecos[index]?.rua?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Número *</Label>
                <Input
                  placeholder="123"
                  {...register(`enderecos.${index}.numero`)}
                />
                {errors.enderecos?.[index]?.numero && (
                  <p className="text-xs text-destructive">
                    {errors.enderecos[index]?.numero?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs">Bairro *</Label>
                <Input
                  placeholder="Centro"
                  {...register(`enderecos.${index}.bairro`)}
                />
                {errors.enderecos?.[index]?.bairro && (
                  <p className="text-xs text-destructive">
                    {errors.enderecos[index]?.bairro?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs">Cidade *</Label>
                <Input
                  placeholder="São Paulo"
                  {...register(`enderecos.${index}.cidade`)}
                />
                {errors.enderecos?.[index]?.cidade && (
                  <p className="text-xs text-destructive">
                    {errors.enderecos[index]?.cidade?.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs">Complemento</Label>
                <Input
                  placeholder="Apto 101"
                  {...register(`enderecos.${index}.complemento`)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ações */}
      <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
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
              <Loader2 className="mr-2 size-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ClienteModalEdicao({
  cliente,
  aberto,
  onOpenChange,
  onSucesso,
}: ClienteModalEdicaoProps) {
  if (!cliente) return null;

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente: {cliente.nome}</DialogTitle>
          <DialogDescription>
            Atualize os dados cadastrais, telefones ou endereços do cliente.
          </DialogDescription>
        </DialogHeader>

        <ClienteModalEdicaoForm
          key={cliente.id}
          cliente={cliente}
          onOpenChange={onOpenChange}
          onSucesso={onSucesso}
        />
      </DialogContent>
    </Dialog>
  );
}
