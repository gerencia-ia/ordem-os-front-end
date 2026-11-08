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
import type { Servico } from '@/src/types/ordem';

interface OrdemModalAdicionarServicoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servicos: Servico[];
  loadingServicos: boolean;
  servicoId: string;
  onServicoIdChange: (val: string) => void;
  quantidade: string;
  onQuantidadeChange: (val: string) => void;
  onSalvar: () => void | Promise<void>;
  salvando: boolean;
  podeVerMetricasFinanceiras: boolean;
}

export function OrdemModalAdicionarServico({
  open,
  onOpenChange,
  servicos,
  loadingServicos,
  servicoId,
  onServicoIdChange,
  quantidade,
  onQuantidadeChange,
  onSalvar,
  salvando,
  podeVerMetricasFinanceiras,
}: OrdemModalAdicionarServicoProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Serviço à Ordem</DialogTitle>
          <DialogDescription>
            Selecione o serviço do catálogo para vincular a esta ordem de
            serviço.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="select-servico">Serviço</Label>
            {loadingServicos ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Carregando catálogo de serviços...</span>
              </div>
            ) : servicos.length > 0 ? (
              <select
                id="select-servico"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={servicoId}
                onChange={(e) => onServicoIdChange(e.target.value)}
                disabled={salvando}
              >
                <option value="">Selecione um serviço</option>
                {servicos.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.nome}
                    {podeVerMetricasFinanceiras
                      ? ` - R$ ${Number(s.valor).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}`
                      : ''}
                    {s.tempo_servico ? ` (${s.tempo_servico} min)` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum serviço disponível para seleção.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="input-quantidade">Quantidade (opcional)</Label>
            <Input
              id="input-quantidade"
              type="number"
              min={1}
              placeholder="Ex: 1"
              value={quantidade}
              onChange={(e) => onQuantidadeChange(e.target.value)}
              disabled={salvando}
            />
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
              !servicoId.trim() ||
              salvando ||
              loadingServicos ||
              servicos.length === 0
            }
          >
            {salvando && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {salvando ? 'Adicionando...' : 'Adicionar Serviço'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
