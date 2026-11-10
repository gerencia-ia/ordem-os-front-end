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
import type { CategoriaServico } from '@/src/types/categoria';
import { useCategoriaForm } from '@/src/hooks/useCategoriaForm';

interface CategoriaModalEditarProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  categoria: CategoriaServico | null;
  onSucesso: () => void;
}

export function CategoriaModalEditar({
  aberto,
  onOpenChange,
  categoria,
  onSucesso,
}: CategoriaModalEditarProps) {
  const { form, salvando, onSubmit } = useCategoriaForm({
    categoriaAtual: categoria,
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
          <DialogTitle>Editar Categoria de Serviço</DialogTitle>
          <DialogDescription>
            Atualize a descrição da categoria selecionada.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-categoria-descricao">
              Descrição da Categoria <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-categoria-descricao"
              placeholder="Ex: Instalação, Manutenção Preventiva..."
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
