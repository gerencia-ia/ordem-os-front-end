'use client';

import { useState } from 'react';
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
import { Badge } from '@/src/components/ui/badge';
import { useClienteForm } from '@/src/hooks/useClienteForm';
import { CadastrarEquipamento } from '@/src/components/cadastrar-equipamento';
import { Plus, Trash2, Search, Loader2 } from 'lucide-react';

interface ClienteModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}

export function ClienteModalCadastro({
  aberto,
  onOpenChange,
  onSucesso,
}: ClienteModalCadastroProps) {
  const [modalEquipAberto, setModalEquipAberto] = useState(false);

  const {
    form,
    telefonesFieldArray,
    enderecosFieldArray,
    equipamentos,
    salvando,
    buscandoCep,
    consultarCep,
    adicionarEquipamento,
    removerEquipamento,
    onSubmit,
  } = useClienteForm({
    clienteParaEdicao: null,
    onSuccess: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <>
      <Dialog open={aberto} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados cadastrais, telefones e endereços do cliente.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-6 pt-2">
            {/* Dados Básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="nome">
                  Nome Completo <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="nome"
                  placeholder="Ex: João da Silva"
                  {...register('nome')}
                />
                {errors.nome && (
                  <p className="text-xs text-destructive">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@dominio.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="data_ultima_visita">
                  Data da Última Visita
                </Label>
                <Input
                  id="data_ultima_visita"
                  type="date"
                  {...register('data_ultima_visita')}
                />
              </div>
            </div>

            {/* Seção Telefones */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Telefones</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => telefonesFieldArray.append({ numero: '' })}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Adicionar Telefone
                </Button>
              </div>

              {telefonesFieldArray.fields.map((field, index) => (
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
                  {telefonesFieldArray.fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => telefonesFieldArray.remove(index)}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Seção Endereços */}
            <div className="space-y-4 border-t pt-4">
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
                  <Plus className="h-3.5 w-3.5" /> Adicionar Endereço
                </Button>
              </div>

              {enderecosFieldArray.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-3 border rounded-md bg-muted/20 space-y-3 relative"
                >
                  {enderecosFieldArray.fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => enderecosFieldArray.remove(index)}
                      className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-destructive"
                      title="Remover endereço"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
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
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Search className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1 md:col-span-2">
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
                    <div className="space-y-1">
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

                    <div className="space-y-1">
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

                    <div className="space-y-1">
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

                    <div className="space-y-1">
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

            {/* Equipamentos em Memória (Opcional) */}
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-semibold">
                    Equipamentos (Opcional)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Vincule aparelhos a este cliente agora mesmo.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalEquipAberto(true)}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Adicionar Equipamento
                </Button>
              </div>

              {equipamentos.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {equipamentos.map((eq, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs py-1 px-2 flex items-center gap-1.5"
                    >
                      <span>
                        {eq.marca} - {eq.btus} BTUs ({eq.local_instalacao})
                      </span>
                      <button
                        type="button"
                        onClick={() => removerEquipamento(idx)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/70 italic">
                  Nenhum equipamento adicionado até o momento.
                </p>
              )}
            </div>

            {/* Ações */}
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
                  'Cadastrar Cliente'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CadastrarEquipamento
        open={modalEquipAberto}
        setOpen={setModalEquipAberto}
        onSalvarEquipamento={adicionarEquipamento}
      />
    </>
  );
}
