'use client';

import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Button } from '@/src/components/Ui/button';
import { Textarea } from '@/src/components/Ui/textarea';
import { Field, FieldGroup, FieldLabel } from '@/src/components/Ui/field';
import { Spinner } from '@/src/components/Ui/spinner';
import type { OsEquipamentoItem } from '@/src/types/ordem';

interface OrdemModalLaudoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipamento: OsEquipamentoItem | null;
  textoLaudo: string;
  onTextoLaudoChange: (val: string) => void;
  onSalvar: () => void | Promise<void>;
  salvando: boolean;
}

export function OrdemModalLaudo({
  open,
  onOpenChange,
  equipamento,
  textoLaudo,
  onTextoLaudoChange,
  onSalvar,
  salvando,
}: OrdemModalLaudoProps) {
  return (
    <ModalFormulario open={open} onOpenChange={onOpenChange} tamanho="sm">
      <ModalFormularioHeader
        title="Laudo Técnico do Equipamento"
        description={
          equipamento
            ? `${equipamento.marca} (${equipamento.btus} BTUs) — Local: ${equipamento.local_instalacao}`
            : 'Selecione um equipamento.'
        }
      />

      <ModalFormularioBody>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="laudo-texto">
              Descrição do Laudo Técnico
            </FieldLabel>
            <Textarea
              id="laudo-texto"
              rows={5}
              placeholder="Descreva o estado, testes realizados e parecer técnico..."
              value={textoLaudo}
              onChange={(e) => onTextoLaudoChange(e.target.value)}
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
          disabled={!equipamento || !textoLaudo.trim() || salvando}
        >
          {salvando && <Spinner data-icon="inline-start" />}
          {salvando ? 'Salvando...' : 'Salvar Laudo'}
        </Button>
      </ModalFormularioFooter>
    </ModalFormulario>
  );
}
