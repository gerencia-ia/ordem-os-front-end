'use client';

import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { Label } from '@/src/components/Ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
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
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5">
          <Layers className="size-3.5 text-muted-foreground" />
          Valores por Andar
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdicionar}
          disabled={salvando || carregandoAndares || andares.length === 0}
          className="h-7 text-xs gap-1"
        >
          <Plus className="size-3.5" /> Adicionar Andar
        </Button>
      </div>

      {andares.length === 0 && !carregandoAndares ? (
        <p className="text-xs text-muted-foreground italic border rounded-md p-3">
          Nenhum andar cadastrado. Cadastre andares em Configurações &gt;
          Andares para definir preços.
        </p>
      ) : itensAtivos.length === 0 ? (
        <p className="text-xs text-muted-foreground italic border border-dashed rounded-md p-3 text-center">
          Nenhum valor por andar configurado. Clique em &quot;Adicionar
          Andar&quot; para definir o preço deste serviço por pavimento.
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
          {fields.map((field, index) => {
            if (field._destroy) return null;

            const erroItem = errors.valores_por_andares_attributes?.[index];

            return (
              <div
                key={field.fieldKey}
                className="flex flex-col gap-1 border rounded-md p-2.5 bg-muted/20"
              >
                <div className="flex items-start gap-2">
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
                          <SelectTrigger className="w-full h-9 text-xs">
                            <SelectValue placeholder="Selecione o andar" />
                          </SelectTrigger>
                          <SelectContent>
                            {andares.map((andar) => (
                              <SelectItem
                                key={andar.id}
                                value={String(andar.id)}
                              >
                                {andar.descricao}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="w-32">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="R$ 0,00"
                      className="h-9 text-xs"
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
                    className="size-9 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => onRemover(index)}
                    disabled={salvando}
                    aria-label="Remover valor do andar"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {(erroItem?.andar_id || erroItem?.valor) && (
                  <p className="text-xs text-destructive">
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
