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
import { Loader2 } from 'lucide-react';
import type { OsEquipamentoItem } from '@/src/types/ordem';
import type { Servico } from '@/src/types/servico';

interface OrdemModalAdicionarServicoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipamentos: OsEquipamentoItem[];
  equipamentoId: string;
  onEquipamentoIdChange: (val: string) => void;
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
  equipamentos,
  equipamentoId,
  onEquipamentoIdChange,
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
  const equipamentoSelecionado = equipamentos.find(
    (eq) => String(eq.equipamento_id || eq.id) === equipamentoId,
  );
  const andarIdSelecionado = equipamentoSelecionado?.andar_id;

  const servicoSelecionado = servicos.find((s) => String(s.id) === servicoId);
  const valorServicoSelecionado =
    andarIdSelecionado !== undefined
      ? servicoSelecionado?.valores_por_andares?.find(
          (v) => Number(v.andar_id) === Number(andarIdSelecionado),
        )
      : undefined;

  const servicoSemPrecoNoAndar =
    Boolean(equipamentoSelecionado) &&
    Boolean(servicoSelecionado) &&
    !valorServicoSelecionado;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Serviço à Ordem</DialogTitle>
          <DialogDescription>
            Selecione o equipamento e o serviço do catálogo para vincular a esta
            ordem de serviço.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="select-equipamento-servico">Equipamento</Label>
            {equipamentos.length > 0 ? (
              <Select
                value={equipamentoId}
                onValueChange={onEquipamentoIdChange}
                disabled={salvando}
              >
                <SelectTrigger id="select-equipamento-servico" className="w-full">
                  <SelectValue placeholder="Selecione o equipamento da OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {equipamentos.map((eq) => {
                      const eqValue = String(eq.equipamento_id || eq.id);
                      return (
                        <SelectItem key={eqValue} value={eqValue}>
                          {eq.marca} ({eq.btus}) • {eq.local_instalacao}
                          {eq.andar?.descricao ? ` — ${eq.andar.descricao}` : ''}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum equipamento vinculado a esta ordem de serviço.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="select-servico">Serviço</Label>
            {loadingServicos ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span>Carregando catálogo de serviços...</span>
              </div>
            ) : servicos.length > 0 ? (
              <Select
                value={servicoId}
                onValueChange={onServicoIdChange}
                disabled={salvando || !equipamentoId}
              >
                <SelectTrigger id="select-servico" className="w-full">
                  <SelectValue
                    placeholder={
                      equipamentoId
                        ? 'Selecione um serviço'
                        : 'Selecione primeiro um equipamento'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {servicos.map((s) => {
                      const vpa =
                        andarIdSelecionado !== undefined
                          ? s.valores_por_andares?.find(
                              (v) =>
                                Number(v.andar_id) === Number(andarIdSelecionado),
                            )
                          : undefined;

                      return (
                        <SelectItem
                          key={s.id}
                          value={String(s.id)}
                          disabled={Boolean(equipamentoSelecionado) && !vpa}
                        >
                          {s.nome}
                          {podeVerMetricasFinanceiras && vpa
                            ? ` - R$ ${Number(vpa.valor).toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                              })}`
                            : equipamentoSelecionado && !vpa
                              ? ' (Sem preço p/ este andar)'
                              : ''}
                          {s.tempo_servico ? ` (${s.tempo_servico} min)` : ''}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum serviço disponível para seleção.
              </p>
            )}
            {servicoSemPrecoNoAndar && (
              <p className="text-xs text-destructive">
                Este serviço não possui valor cadastrado para o andar do
                equipamento selecionado.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
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
              !equipamentoId.trim() ||
              !servicoId.trim() ||
              servicoSemPrecoNoAndar ||
              salvando ||
              loadingServicos ||
              servicos.length === 0
            }
          >
            {salvando && <Loader2 className="mr-2 size-4 animate-spin" />}
            {salvando ? 'Adicionando...' : 'Adicionar Serviço'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
