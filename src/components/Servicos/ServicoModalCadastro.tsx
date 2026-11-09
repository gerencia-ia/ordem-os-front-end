'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/Ui/dialog';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { Label } from '@/src/components/Ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { Controller } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import type { CategoriaServico } from '@/src/types/categoria';
import { useServicoForm } from '@/src/hooks/useServicoForm';

interface ServicoModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  categorias: CategoriaServico[];
  onSucesso: () => void;
}

export function ServicoModalCadastro({
  aberto,
  onOpenChange,
  categorias,
  onSucesso,
}: ServicoModalCadastroProps) {
  const { form, salvando, onSubmit } = useServicoForm({
    servicoAtual: null,
    onSucesso: () => {
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
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
          <DialogDescription>
            Cadastre um novo serviço para inclusão no catálogo e nas ordens de
            serviço.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          {/* Nome */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="servico-nome">
              Nome do Serviço <span className="text-destructive">*</span>
            </Label>
            <Input
              id="servico-nome"
              placeholder="Ex: Instalação de Split 9000 BTUs"
              {...register('nome')}
              disabled={salvando}
            />
            {errors.nome && (
              <p className="text-xs text-destructive">{errors.nome.message}</p>
            )}
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="servico-categoria">Categoria</Label>
            <Controller
              control={control}
              name="categorias_servico_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : 'nenhuma'}
                  onValueChange={(val) =>
                    field.onChange(val === 'nenhuma' ? null : Number(val))
                  }
                  disabled={salvando}
                >
                  <SelectTrigger id="servico-categoria" className="w-full">
                    <SelectValue placeholder="Selecione uma categoria (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="nenhuma">
                        Nenhuma (opcional)
                      </SelectItem>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.descricao}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Valor */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="servico-valor">
                Valor (R$) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="servico-valor"
                type="number"
                step="0.01"
                placeholder="Ex: 250.00"
                {...register('valor')}
                disabled={salvando}
              />
              {errors.valor && (
                <p className="text-xs text-destructive">
                  {errors.valor.message}
                </p>
              )}
            </div>

            {/* Tempo */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="servico-tempo">Tempo Estimado (min)</Label>
              <Input
                id="servico-tempo"
                type="number"
                min="1"
                placeholder="Ex: 60"
                {...register('tempo_servico')}
                disabled={salvando}
              />
              {errors.tempo_servico && (
                <p className="text-xs text-destructive">
                  {errors.tempo_servico.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={salvando}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando && <Loader2 className="mr-2 size-4 animate-spin" />}
              {salvando ? 'Salvando...' : 'Cadastrar Serviço'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
