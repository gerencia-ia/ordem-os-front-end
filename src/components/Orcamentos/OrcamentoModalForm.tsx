'use client';

import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/Ui/field';
import { Spinner } from '@/src/components/Ui/spinner';
import { useOrcamentoForm } from '@/src/hooks/useOrcamentoForm';
import {
  ORCAMENTO_STATUS_EDITAVEIS_OPTIONS,
  type Orcamento,
  type OrcamentoStatusEditavel,
} from '@/src/types/orcamento';
import { SecaoClienteEndereco } from '@/src/components/Ordens/formulario/SecaoClienteEndereco';
import { SecaoEquipamentos } from '@/src/components/Ordens/formulario/SecaoEquipamentos';
import { SecaoServicos } from '@/src/components/Ordens/formulario/SecaoServicos';
import { SecaoMateriais } from '@/src/components/Ordens/formulario/SecaoMateriais';
import { CalendarClock, FileText, Pencil, PlusCircle } from 'lucide-react';

interface OrcamentoModalFormProps {
  aberto: boolean;
  orcamentoInicial?: Orcamento | null;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}

const formatarMoeda = (valor: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);

export function OrcamentoModalForm({
  aberto,
  orcamentoInicial,
  onOpenChange,
  onSucesso,
}: OrcamentoModalFormProps) {
  const {
    form,
    isEdicao,
    salvando,
    loadingDados,
    loadingEquipamentos,
    clientes,
    clienteAtual,
    servicos,
    equipamentos,
    materiais,
    materiaisSelecionados,
    adicionarMaterial,
    removerMaterial,
    orcamentoServicosSelecionados,
    equipamentoIdsSelecionados,
    valorTotalServicos,
    subtotalBruto,
    descontoNumerico,
    valorTotalFinal,
    onClienteChange,
    setEquipamentosSelecionados,
    setServicosPorEquipamento,
    atualizarQuantidadeServico,
    adicionarNovoEquipamento,
    adicionarNovoCliente,
    onSubmit,
  } = useOrcamentoForm({
    orcamentoInicial,
    onSuccess: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const clienteId = Number(watch('cliente_id')) || 0;
  const statusAtual = watch('status');
  const equipamentosSelecionados = equipamentos.filter((eq) =>
    equipamentoIdsSelecionados.includes(Number(eq.id)),
  );

  return (
    <ModalFormulario open={aberto} onOpenChange={onOpenChange} tamanho="xl">
      <ModalFormularioHeader
        icon={
          isEdicao ? (
            <Pencil className="size-5" />
          ) : (
            <PlusCircle className="size-5" />
          )
        }
        title={
          isEdicao
            ? `Editar Orçamento #${orcamentoInicial?.numero_orcamento}`
            : 'Novo Orçamento'
        }
        description={
          isEdicao
            ? 'Atualize os itens, valores e condições da proposta comercial.'
            : 'Monte a proposta comercial com serviços, materiais, validade e desconto.'
        }
      />

      <form
        onSubmit={onSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <ModalFormularioBody className="flex flex-col gap-4">
          <SecaoClienteEndereco
            form={form}
            clientes={clientes}
            clienteAtual={clienteAtual}
            loadingClientes={loadingDados}
            onClienteChange={onClienteChange}
            onAdicionarCliente={adicionarNovoCliente}
          />

          <SecaoEquipamentos
            clienteId={clienteId}
            equipamentos={equipamentos}
            equipamentoIdsSelecionados={equipamentoIdsSelecionados}
            loadingEquipamentos={loadingEquipamentos}
            onChangeEquipamentos={setEquipamentosSelecionados}
            onAdicionarEquipamento={adicionarNovoEquipamento}
          />

          <SecaoServicos
            servicos={servicos}
            equipamentosSelecionados={equipamentosSelecionados}
            osServicosSelecionados={orcamentoServicosSelecionados}
            valorTotal={valorTotalServicos}
            loadingServicos={loadingDados}
            onChangeServicosEquipamento={setServicosPorEquipamento}
            onAlterarQuantidade={atualizarQuantidadeServico}
          />

          <SecaoMateriais
            materiais={materiais}
            itens={materiaisSelecionados}
            loading={loadingDados}
            onAdicionar={adicionarMaterial}
            onRemover={removerMaterial}
          />

          <CardColapsavel
            titulo="5. Validade, Desconto e Condições"
            icone={<CalendarClock className="size-4 text-primary" />}
            resumo={`Status: ${statusAtual} • Desconto: ${formatarMoeda(descontoNumerico)}`}
            defaultOpenMobile={true}
            hasError={Boolean(errors.desconto || errors.data_validade)}
            className="bg-card/40 border-border/70"
            contentClassName="flex flex-col gap-4"
          >
            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="orc-status">Status</FieldLabel>
                <Select
                  value={statusAtual}
                  onValueChange={(val) =>
                    setValue('status', val as OrcamentoStatusEditavel, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="orc-status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORCAMENTO_STATUS_EDITAVEIS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field data-invalid={Boolean(errors.data_validade)}>
                <FieldLabel htmlFor="orc-validade">Data de Validade</FieldLabel>
                <Input
                  id="orc-validade"
                  type="date"
                  {...register('data_validade')}
                />
                <FieldError errors={[errors.data_validade]} />
              </Field>

              <Field data-invalid={Boolean(errors.desconto)}>
                <FieldLabel htmlFor="orc-desconto">Desconto (R$)</FieldLabel>
                <Input
                  id="orc-desconto"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register('desconto')}
                />
                <FieldError errors={[errors.desconto]} />
              </Field>
            </FieldGroup>

            <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="orc-condicoes">
                  Condições de Pagamento
                </FieldLabel>
                <Textarea
                  id="orc-condicoes"
                  rows={3}
                  placeholder="Ex.: 50% na aprovação e 50% na conclusão..."
                  {...register('condicoes_pagamento')}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="orc-observacao">Observações</FieldLabel>
                <Textarea
                  id="orc-observacao"
                  rows={3}
                  placeholder="Informações adicionais que aparecerão no PDF..."
                  {...register('observacao')}
                />
              </Field>
            </FieldGroup>
          </CardColapsavel>
        </ModalFormularioBody>

        <ModalFormularioFooter
          leftSlot={
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-muted-foreground text-xs">Subtotal:</span>
                <span className="text-xs font-medium tabular-nums">
                  {formatarMoeda(subtotalBruto)}
                </span>
              </div>
              {descontoNumerico > 0 && (
                <div className="flex items-baseline gap-1.5">
                  <span className="text-muted-foreground text-xs">
                    Desconto:
                  </span>
                  <span className="text-xs font-medium text-rose-600 tabular-nums">
                    - {formatarMoeda(descontoNumerico)}
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="text-muted-foreground text-xs font-medium">
                  Total:
                </span>
                <span className="text-success text-base font-bold tabular-nums">
                  {formatarMoeda(valorTotalFinal)}
                </span>
              </div>
            </div>
          }
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={salvando}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando || loadingDados}>
            {salvando ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <FileText className="size-4 mr-1.5" />
            )}
            {isEdicao ? 'Salvar Alterações' : 'Criar Orçamento'}
          </Button>
        </ModalFormularioFooter>
      </form>
    </ModalFormulario>
  );
}
