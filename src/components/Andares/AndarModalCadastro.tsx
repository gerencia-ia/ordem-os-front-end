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
import { Loader2 } from 'lucide-react';
import { useAndarForm } from '@/src/hooks/useAndarForm';

interface AndarModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}

export function AndarModalCadastro({
  aberto,
  onOpenChange,
  onSucesso,
}: AndarModalCadastroProps) {
  const { form, salvando, onSubmit } = useAndarForm({
    andarAtual: null,
    onSucesso: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Andar</DialogTitle>
          <DialogDescription>
            Cadastre um andar ou pavimento para vincular equipamentos e definir
            valores de serviços.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="andar-descricao">
              Descrição do Andar <span className="text-destructive">*</span>
            </Label>
            <Input
              id="andar-descricao"
              placeholder="Ex: Térreo, 1º Andar, Cobertura..."
              {...register('descricao')}
              disabled={salvando}
            />
            {errors.descricao && (
              <p className="text-xs text-destructive">
                {errors.descricao.message}
              </p>
            )}
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
              {salvando ? 'Salvando...' : 'Cadastrar Andar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
