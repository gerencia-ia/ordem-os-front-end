'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@/src/lib/zod-resolver';
import {
  equipamentoFormSchema,
  type EquipamentoFormData,
  type Equipamento,
} from '@/src/types/equipamento';
import { createEquipamento } from '@/src/services/equipamentos.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
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

  const form = useForm<EquipamentoFormData>({
    resolver: zodResolver(equipamentoFormSchema),
    defaultValues: {
      marca: '',
      btus: '',
      local_instalacao: '',
      observacao: '',
      cliente_id: clienteId,
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data: EquipamentoFormData) => {
    try {
      setSalvando(true);
      const novo = await createEquipamento({
        marca: data.marca.trim(),
        btus: data.btus.trim(),
        local_instalacao: data.local_instalacao.trim(),
        observacao: data.observacao?.trim() || undefined,
        cliente_id: Number(clienteId),
      });

      toast.success('Equipamento cadastrado com sucesso!');
      reset();
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1.5">
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
            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
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

          <div className="space-y-1.5">
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
              {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adicionar Equipamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default EquipamentoModalCadastro;
