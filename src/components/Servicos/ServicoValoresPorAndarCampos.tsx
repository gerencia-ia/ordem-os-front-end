'use client';

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { FieldLabel } from '@/src/components/Ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
} from '@/src/components/Ui/empty';
import { Plus, Trash2, Layers } from 'lucide-react';
import type { Andar } from '@/src/types/andar';
import type { ServicoFormData } from '@/src/types/servico';

interface ValorFieldItem {
  fieldKey: string;
  id?: number;
  andar_id: number;
  valor: number;
  _destroy?: boolean;
}

interface ServicoValoresPorAndarCamposProps {
  control: Control<ServicoFormData>;
  register: UseFormRegister<ServicoFormData>;
  errors: FieldErrors<ServicoFormData>;
  fields: ValorFieldItem[];
  andares: Andar[];
  carregandoAndares: boolean;
  salvando: boolean;
  onAdicionar: () => void;
  onRemover: (index: number) => void;
}

export function ServicoValoresPorAndarCampos({
  control,
  register,
  errors,
  fields,
  andares,
  carregandoAndares,
  salvando,
  onAdicionar,
  onRemover,
}: ServicoValoresPorAndarCamposProps) {
  const itensAtivos = fields.filter((f) => !f._destroy);

  return (
    <div className="flex flex-col gap-2.5 pt-1">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel className="flex items-center gap-1.5">
          <Layers className="size-3.5 text-muted-foreground" />
          <span>Valores por Andar</span>
        </FieldLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdicionar}
          disabled={salvando || carregandoAndares || andares.length === 0}
          className="h-7 gap-1 text-xs"
        >
          <Plus className="size-3.5" /> Adicionar Andar
        </Button>
      </div>

      {andares.length === 0 && !carregandoAndares ? (
        <Empty className="gap-2 border p-4 md:p-4">
          <EmptyHeader>
            <EmptyDescription className="text-xs">
              Nenhum andar cadastrado. Cadastre andares em Configurações &gt;
              Andares para definir preços.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : itensAtivos.length === 0 ? (
        <Empty className="gap-2 border p-4 md:p-4">
          <EmptyHeader>
            <EmptyDescription className="text-xs">
              Nenhum valor por andar configurado. Clique em &quot;Adicionar
              Andar&quot; para definir o preço deste serviço por pavimento.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex max-h-56 flex-col gap-2 overflow-y-auto overscroll-contain pr-1">
          {fields.map((field, index) => {
            if (field._destroy) return null;

            const erroItem = errors.valores_por_andares_attributes?.[index];

            return (
              <div
                key={field.fieldKey}
                className="bg-muted/20 flex flex-col gap-1.5 rounded-md border p-2.5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex-1">
                    <Controller
                      control={control}
                      name={`valores_por_andares_attributes.${index}.andar_id`}
                      render={({ field: selectField }) => (
                        <Select
                          value={
                            selectField.value ? String(selectField.value) : ''
                          }
                          onValueChange={(val) =>
                            selectField.onChange(Number(val))
                          }
                          disabled={salvando || carregandoAndares}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o andar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {andares.map((andar) => (
                                <SelectItem
                                  key={andar.id}
                                  value={String(andar.id)}
                                >
                                  {andar.descricao}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 sm:w-32 sm:flex-none">
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        placeholder="R$ 0,00"
                        {...register(
                          `valores_por_andares_attributes.${index}.valor`,
                        )}
                        disabled={salvando}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => onRemover(index)}
                      disabled={salvando}
                      aria-label="Remover valor do andar"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                {(erroItem?.andar_id || erroItem?.valor) && (
                  <p className="text-destructive text-xs">
                    {erroItem?.andar_id?.message || erroItem?.valor?.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
