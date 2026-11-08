'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useCategoriaForm } from '@/src/hooks/useCategoriaForm';

interface CategoriaModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}

export function CategoriaModalCadastro({
  aberto,
  onOpenChange,
  onSucesso,
}: CategoriaModalCadastroProps) {
  const { form, salvando, onSubmit } = useCategoriaForm({
    categoriaAtual: null,
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
          <DialogTitle>Nova Categoria de Serviço</DialogTitle>
          <DialogDescription>
            Crie uma categoria para agrupar e organizar os serviços oferecidos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="categoria-descricao">
              Descrição da Categoria <span className="text-destructive">*</span>
            </Label>
            <Input
              id="categoria-descricao"
              placeholder="Ex: Instalação, Manutenção Preventiva, Limpeza..."
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
              {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {salvando ? 'Salvando...' : 'Cadastrar Categoria'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
