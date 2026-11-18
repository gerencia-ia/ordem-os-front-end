'use client';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@/src/lib/zod-resolver';
import type { Andar } from '@/src/types/andar';
import {
  equipamentoFormSchema,
  type EquipamentoFormData,
  type Equipamento,
} from '@/src/types/equipamento';
import { getAndares } from '@/src/services/andares.service';
import { createEquipamento } from '@/src/services/equipamentos.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/Ui/dialog';
import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { Label } from '@/src/components/Ui/label';
import { Textarea } from '@/src/components/Ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface EquipamentoModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  clienteId: number;
  onSucesso: (equipamento: Equipamento) => void;
}

export function EquipamentoModalCadastro({
  aberto,
  onOpenChange,
  clienteId,
  onSucesso,
}: EquipamentoModalCadastroProps) {
  const [salvando, setSalvando] = useState(false);
  const [andares, setAndares] = useState<Andar[]>([]);
  const [carregandoAndares, setCarregandoAndares] = useState(false);

  const form = useForm<EquipamentoFormData>({
    resolver: zodResolver(equipamentoFormSchema),
    defaultValues: {
      marca: '',
      btus: '',
      local_instalacao: '',
      observacao: '',
      cliente_id: clienteId,
      andar_id: 0,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!aberto) return;
    let ativo = true;

    async function carregarAndares() {
      try {
        const lista = await getAndares();
        if (ativo) setAndares(lista);
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar andares';
          toast.error(msg);
        }
      } finally {
        if (ativo) setCarregandoAndares(false);
      }
    }

    void carregarAndares();

    return () => {
      ativo = false;
    };
  }, [aberto]);

  const onSubmit = async (data: EquipamentoFormData) => {
    try {
      setSalvando(true);
      const novo = await createEquipamento({
        marca: data.marca.trim(),
        btus: data.btus.trim(),
        local_instalacao: data.local_instalacao.trim(),
        observacao: data.observacao?.trim() || undefined,
        cliente_id: Number(clienteId),
        andar_id: Number(data.andar_id),
      });

      toast.success('Equipamento cadastrado com sucesso!');
      reset({
        marca: '',
        btus: '',
        local_instalacao: '',
        observacao: '',
        cliente_id: clienteId,
        andar_id: 0,
      });
      onOpenChange(false);
      onSucesso(novo);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao cadastrar equipamento';
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Equipamento</DialogTitle>
          <DialogDescription>
            Cadastre um equipamento para vinculá-lo a esta ordem de serviço.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 py-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eq-marca">
              Marca / Modelo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="eq-marca"
              placeholder="Ex: LG Dual Inverter"
              {...register('marca')}
            />
            {errors.marca && (
              <p className="text-xs text-destructive">{errors.marca.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="eq-btus">
                Capacidade / BTUs <span className="text-destructive">*</span>
              </Label>
              <Input
                id="eq-btus"
                placeholder="Ex: 12.000 BTUs"
                {...register('btus')}
              />
              {errors.btus && (
                <p className="text-xs text-destructive">
                  {errors.btus.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="eq-local">
                Local de Instalação <span className="text-destructive">*</span>
              </Label>
              <Input
                id="eq-local"
                placeholder="Ex: Sala de Reunião"
                {...register('local_instalacao')}
              />
              {errors.local_instalacao && (
                <p className="text-xs text-destructive">
                  {errors.local_instalacao.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eq-andar">
              Andar <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="andar_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => field.onChange(Number(val))}
                  disabled={salvando || carregandoAndares}
                >
                  <SelectTrigger id="eq-andar" className="w-full">
                    <SelectValue
                      placeholder={
                        carregandoAndares
                          ? 'Carregando andares...'
                          : 'Selecione o andar'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {andares.map((andar) => (
                      <SelectItem key={andar.id} value={String(andar.id)}>
                        {andar.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.andar_id && (
              <p className="text-xs text-destructive">
                {errors.andar_id.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="eq-obs">Observações Adicionais</Label>
            <Textarea
              id="eq-obs"
              placeholder="Ex: Unidade condensadora no telhado"
              rows={2}
              {...register('observacao')}
            />
          </div>

          <DialogFooter className="pt-2">
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
              Adicionar Equipamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
