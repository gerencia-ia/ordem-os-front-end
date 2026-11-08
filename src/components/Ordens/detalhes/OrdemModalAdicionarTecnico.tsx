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
import { Label } from '@/src/components/Ui/label';
import { Loader2 } from 'lucide-react';
import type { Usuario } from '@/src/types/usuario';

interface OrdemModalAdicionarTecnicoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tecnicos: Usuario[];
  loadingTecnicos: boolean;
  tecnicoId: string;
  onTecnicoIdChange: (val: string) => void;
  onSalvar: () => void | Promise<void>;
  salvando: boolean;
}

export function OrdemModalAdicionarTecnico({
  open,
  onOpenChange,
  tecnicos,
  loadingTecnicos,
  tecnicoId,
  onTecnicoIdChange,
  onSalvar,
  salvando,
}: OrdemModalAdicionarTecnicoProps) {
  // Filtra estritamente usuários com perfil de técnico
  const listaTecnicos = tecnicos.filter((u) => {
    const perfilNorm = (u.role?.nome || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    return perfilNorm === 'tecnico' || u.role_id === 2;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atribuir Técnico à Ordem</DialogTitle>
          <DialogDescription>
            Selecione o profissional que será responsável pela execução dos
            serviços.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="select-tecnico">Técnico</Label>
            {loadingTecnicos ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Carregando técnicos...</span>
              </div>
            ) : listaTecnicos.length > 0 ? (
              <select
                id="select-tecnico"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={tecnicoId}
                onChange={(e) => onTecnicoIdChange(e.target.value)}
                disabled={salvando}
              >
                <option value="">Selecione um técnico</option>
                {listaTecnicos.map((tec) => (
                  <option key={tec.id} value={String(tec.id)}>
                    {tec.nome}
                    {tec.telefone ? ` — (${tec.telefone})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum técnico disponível no momento.
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={salvando}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => void onSalvar()}
            disabled={
              !tecnicoId.trim() ||
              salvando ||
              loadingTecnicos ||
              listaTecnicos.length === 0
            }
          >
            {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {salvando ? 'Atribuindo...' : 'Salvar Atribuição'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
