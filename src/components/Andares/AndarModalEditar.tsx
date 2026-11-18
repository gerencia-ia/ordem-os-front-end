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
import type { Andar } from '@/src/types/andar';
import { useAndarForm } from '@/src/hooks/useAndarForm';

interface AndarModalEditarProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  andar: Andar | null;
  onSucesso: () => void;
}

export function AndarModalEditar({
  aberto,
  onOpenChange,
  andar,
  onSucesso,
}: AndarModalEditarProps) {
  const { form, salvando, onSubmit } = useAndarForm({
    andarAtual: andar,
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
          <DialogTitle>Editar Andar</DialogTitle>
          <DialogDescription>
            Atualize a descrição do andar selecionado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-andar-descricao">
              Descrição do Andar <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-andar-descricao"
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
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
