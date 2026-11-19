'use client';

import { useMemo } from 'react';
import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { Skeleton } from '@/src/components/Ui/skeleton';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/Ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import {
  ComboboxSingle,
  type ComboboxOption,
} from '@/src/components/Ui/combobox';
import { Spinner } from '@/src/components/Ui/spinner';
import type { OsEquipamentoItem } from '@/src/types/ordem';
import type { Servico } from '@/src/types/servico';
import { formatarDuracaoHHMM } from '@/src/utils/date';

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

  const opcoesServico: ComboboxOption[] = useMemo(
    () =>
      servicos.map((s) => {
        const vpa =
          andarIdSelecionado !== undefined
            ? s.valores_por_andares?.find(
                (v) => Number(v.andar_id) === Number(andarIdSelecionado),
              )
            : undefined;

        const semPreco = Boolean(equipamentoSelecionado) && !vpa;
        const precoTexto =
          podeVerMetricasFinanceiras && vpa
            ? `R$ ${Number(vpa.valor).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}`
            : undefined;
        const tempoTexto = s.tempo_servico
          ? formatarDuracaoHHMM(s.tempo_servico)
          : undefined;
        const meta = [precoTexto, tempoTexto].filter(Boolean).join(' • ');

        return {
          value: String(s.id),
          label: s.nome,
          meta: meta || undefined,
          disabled: semPreco,
          disabledReason: semPreco ? 'Sem preço p/ andar' : undefined,
        };
      }),
    [
      servicos,
      andarIdSelecionado,
      equipamentoSelecionado,
      podeVerMetricasFinanceiras,
    ],
  );

  return (
    <ModalFormulario open={open} onOpenChange={onOpenChange} tamanho="sm">
      <ModalFormularioHeader
        title="Adicionar Serviço à Ordem"
        description="Selecione o equipamento e o serviço do catálogo para vincular a esta ordem de serviço."
      />

      <ModalFormularioBody>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="select-equipamento-servico">
              Equipamento
            </FieldLabel>
            {equipamentos.length > 0 ? (
              <Select
                value={equipamentoId}
                onValueChange={onEquipamentoIdChange}
                disabled={salvando}
              >
                <SelectTrigger
                  id="select-equipamento-servico"
                  className="w-full"
                >
                  <SelectValue placeholder="Selecione o equipamento da OS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {equipamentos.map((eq) => {
                      const eqValue = String(eq.equipamento_id || eq.id);
                      return (
                        <SelectItem key={eqValue} value={eqValue}>
                          {eq.marca} ({eq.btus}) • {eq.local_instalacao}
                          {eq.andar?.descricao
                            ? ` — ${eq.andar.descricao}`
                            : ''}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground text-sm">
                Nenhum equipamento vinculado a esta ordem de serviço.
              </p>
            )}
          </Field>

          <Field data-invalid={servicoSemPrecoNoAndar}>
            <FieldLabel htmlFor="select-servico">Serviço</FieldLabel>
            {loadingServicos ? (
              <Skeleton className="h-9 w-full" />
            ) : servicos.length > 0 ? (
              <ComboboxSingle
                id="select-servico"
                options={opcoesServico}
                value={servicoId}
                onValueChange={onServicoIdChange}
                placeholder={
                  equipamentoId
                    ? 'Selecione um serviço'
                    : 'Selecione primeiro um equipamento'
                }
                searchPlaceholder="Buscar serviço..."
                emptyMessage="Nenhum serviço encontrado."
                disabled={salvando || !equipamentoId}
                aria-invalid={servicoSemPrecoNoAndar}
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                Nenhum serviço disponível para seleção.
              </p>
            )}
            {servicoSemPrecoNoAndar && (
              <FieldError>
                Este serviço não possui valor cadastrado para o andar do
                equipamento selecionado.
              </FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="input-quantidade">
              Quantidade (opcional)
            </FieldLabel>
            <Input
              id="input-quantidade"
              type="number"
              inputMode="numeric"
              min={1}
              placeholder="Ex: 1"
              value={quantidade}
              onChange={(e) => onQuantidadeChange(e.target.value)}
              disabled={salvando}
            />
          </Field>
        </FieldGroup>
      </ModalFormularioBody>

      <ModalFormularioFooter>
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
          {salvando && <Spinner data-icon="inline-start" />}
          {salvando ? 'Adicionando...' : 'Adicionar Serviço'}
        </Button>
      </ModalFormularioFooter>
    </ModalFormulario>
  );
}
