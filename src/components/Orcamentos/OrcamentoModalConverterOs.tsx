'use client';

import { useEffect, useState } from 'react';
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
import { Textarea } from '@/src/components/Ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { Field, FieldLabel } from '@/src/components/Ui/field';
import {
  ComboboxMultiple,
  type ComboboxOption,
} from '@/src/components/Ui/combobox';
import { Spinner } from '@/src/components/Ui/spinner';
import { getPrioridades } from '@/src/services/prioridades.service';
import { getUsuarios } from '@/src/services/usuarios.service';
import type { Prioridade } from '@/src/types/ordem';
import type { Usuario } from '@/src/types/usuario';
import type {
  ConverterOrcamentoPayload,
  Orcamento,
} from '@/src/types/orcamento';
import { ArrowRightCircle } from 'lucide-react';

interface OrcamentoModalConverterOsProps {
  orcamento: Orcamento;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onConfirmar: (payload: ConverterOrcamentoPayload) => Promise<void>;
  convertendo: boolean;
}

export function OrcamentoModalConverterOs({
  orcamento,
  aberto,
  onOpenChange,
  onConfirmar,
  convertendo,
}: OrcamentoModalConverterOsProps) {
  const [prioridades, setPrioridades] = useState<Prioridade[]>([]);
  const [tecnicos, setTecnicos] = useState<Usuario[]>([]);
  const [loadingApoio, setLoadingApoio] = useState(false);

  const [prioridadeId, setPrioridadeId] = useState('');
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [tecnicoIds, setTecnicoIds] = useState<number[]>([]);
  const [descricao, setDescricao] = useState(
    `Ordem de serviço gerada a partir do orçamento ${orcamento.numero_orcamento}`,
  );
  const [observacao, setObservacao] = useState(orcamento.observacao || '');

  useEffect(() => {
    if (!aberto) return;

    let ativo = true;
    async function carregar() {
      try {
        setLoadingApoio(true);
        const [prios, usuarios] = await Promise.all([
          getPrioridades(),
          getUsuarios(),
        ]);

        if (ativo) {
          setPrioridades(prios);
          if (prios.length > 0) {
            setPrioridadeId(String(prios[0].id));
          }
          const apenasTecnicos = usuarios.filter(
            (u) =>
              (u.role?.nome || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase() === 'tecnico',
          );
          setTecnicos(apenasTecnicos);
        }
      } catch {
        // Silencioso: backend resolve defaults se não informado
      } finally {
        if (ativo) {
          setLoadingApoio(false);
        }
      }
    }

    void carregar();
    return () => {
      ativo = false;
    };
  }, [aberto]);

  const tecnicoOptions: ComboboxOption[] = tecnicos.map((t) => ({
    value: String(t.id),
    label: t.nome,
  }));

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ConverterOrcamentoPayload = {
      prioridade_id: prioridadeId ? Number(prioridadeId) : undefined,
      data_agendamento: dataAgendamento || undefined,
      tecnico_ids: tecnicoIds.length > 0 ? tecnicoIds : undefined,
      descricao: descricao.trim() || undefined,
      observacao: observacao.trim() || undefined,
    };
    await onConfirmar(payload);
  };

  return (
    <Dialog open={aberto} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightCircle className="size-5 text-primary" />
            Converter Orçamento em OS
          </DialogTitle>
          <DialogDescription>
            Será criada uma nova Ordem de Serviço com todos os equipamentos,
            serviços e materiais do orçamento{' '}
            <strong>#{orcamento.numero_orcamento}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleConfirmar} className="flex flex-col gap-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="conv-prioridade">Prioridade</FieldLabel>
              <Select
                value={prioridadeId}
                onValueChange={setPrioridadeId}
                disabled={loadingApoio || prioridades.length === 0}
              >
                <SelectTrigger id="conv-prioridade">
                  <SelectValue placeholder="Padrão do sistema" />
                </SelectTrigger>
                <SelectContent>
                  {prioridades.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="conv-agendamento">
                Data de Agendamento
              </FieldLabel>
              <Input
                id="conv-agendamento"
                type="datetime-local"
                value={dataAgendamento}
                onChange={(e) => setDataAgendamento(e.target.value)}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel>Técnicos Responsáveis (opcional)</FieldLabel>
            <ComboboxMultiple
              options={tecnicoOptions}
              value={tecnicoIds.map(String)}
              onValueChange={(vals) => setTecnicoIds(vals.map(Number))}
              placeholder={
                loadingApoio ? 'Carregando técnicos...' : 'Selecionar técnicos'
              }
              searchPlaceholder="Buscar técnico..."
              emptyMessage="Nenhum técnico encontrado."
              disabled={loadingApoio}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="conv-descricao">Descrição da OS</FieldLabel>
            <Input
              id="conv-descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do atendimento"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="conv-observacao">Observações</FieldLabel>
            <Textarea
              id="conv-observacao"
              rows={2}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Observações adicionais para a equipe técnica..."
            />
          </Field>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={convertendo}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={convertendo}>
              {convertendo && <Spinner data-icon="inline-start" />}
              Confirmar e Gerar OS
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
