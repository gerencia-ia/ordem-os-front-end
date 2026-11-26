'use client';

import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { Textarea } from '@/src/components/Ui/textarea';
import { Field, FieldGroup, FieldLabel } from '@/src/components/Ui/field';
import { Spinner } from '@/src/components/Ui/spinner';

interface OrdemModalEditarInfoGeralProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dataAgendamento: string;
  onDataAgendamentoChange: (val: string) => void;
  descricao: string;
  onDescricaoChange: (val: string) => void;
  observacao: string;
  onObservacaoChange: (val: string) => void;
  onSalvar: () => void | Promise<void>;
  salvando: boolean;
}

export function OrdemModalEditarInfoGeral({
  open,
  onOpenChange,
  dataAgendamento,
  onDataAgendamentoChange,
  descricao,
  onDescricaoChange,
  observacao,
  onObservacaoChange,
  onSalvar,
  salvando,
}: OrdemModalEditarInfoGeralProps) {
  return (
    <ModalFormulario open={open} onOpenChange={onOpenChange} tamanho="md">
      <ModalFormularioHeader
        title="Editar Informações Gerais"
        description="Atualize a data de agendamento, a descrição do serviço e as observações finais desta ordem."
      />

      <ModalFormularioBody>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="info-data-agendamento">
              Data de Agendamento
            </FieldLabel>
            <Input
              id="info-data-agendamento"
              type="datetime-local"
              value={dataAgendamento}
              onChange={(e) => onDataAgendamentoChange(e.target.value)}
              disabled={salvando}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="info-descricao">
              Descrição do Serviço
            </FieldLabel>
            <Textarea
              id="info-descricao"
              rows={3}
              placeholder="Descreva a solicitação do cliente..."
              value={descricao}
              onChange={(e) => onDescricaoChange(e.target.value)}
              disabled={salvando}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="info-observacao">
              Observações Finais / Parecer
            </FieldLabel>
            <Textarea
              id="info-observacao"
              rows={3}
              placeholder="Observações internas ou parecer final..."
              value={observacao}
              onChange={(e) => onObservacaoChange(e.target.value)}
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
          disabled={salvando}
        >
          {salvando && <Spinner data-icon="inline-start" />}
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </ModalFormularioFooter>
    </ModalFormulario>
  );
}
