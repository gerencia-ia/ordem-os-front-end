'use client';

import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@/src/lib/zod-resolver';
import type { Andar } from '@/src/types/andar';
import {
  equipamentoFormSchema,
  type EquipamentoFormData,
  type Equipamento,
} from '@/src/types/equipamento';
import { getAndares } from '@/src/services/andares.service';
import { createEquipamento } from '@/src/services/equipamentos.service';
import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { Textarea } from '@/src/components/Ui/textarea';
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
import { Spinner } from '@/src/components/Ui/spinner';
import { toast } from 'sonner';

interface EquipamentoModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  clienteId: number;
  onSucesso: (equipamento: Equipamento) => void;
}

export function EquipamentoModalCadastro({
  aberto,
  onOpenChange,
  clienteId,
  onSucesso,
}: EquipamentoModalCadastroProps) {
  const [salvando, setSalvando] = useState(false);
  const [andares, setAndares] = useState<Andar[]>([]);
  const [carregandoAndares, setCarregandoAndares] = useState(false);

  const form = useForm<EquipamentoFormData>({
    resolver: zodResolver(equipamentoFormSchema),
    defaultValues: {
      marca: '',
      btus: '',
      local_instalacao: '',
      observacao: '',
      cliente_id: clienteId,
      andar_id: 0,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!aberto) return;
    let ativo = true;

    async function carregarAndares() {
      try {
        const lista = await getAndares();
        if (ativo) setAndares(lista);
      } catch (err) {
        if (ativo) {
          const msg =
            err instanceof Error ? err.message : 'Erro ao carregar andares';
          toast.error(msg);
        }
      } finally {
        if (ativo) setCarregandoAndares(false);
      }
    }

    void carregarAndares();

    return () => {
      ativo = false;
    };
  }, [aberto]);

  const onSubmit = async (data: EquipamentoFormData) => {
    try {
      setSalvando(true);
      const novo = await createEquipamento({
        marca: data.marca.trim(),
        btus: data.btus.trim(),
        local_instalacao: data.local_instalacao.trim(),
        observacao: data.observacao?.trim() || undefined,
        cliente_id: Number(clienteId),
        andar_id: Number(data.andar_id),
      });

      toast.success('Equipamento cadastrado com sucesso!');
      reset({
        marca: '',
        btus: '',
        local_instalacao: '',
        observacao: '',
        cliente_id: clienteId,
        andar_id: 0,
      });
      onOpenChange(false);
      onSucesso(novo);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao cadastrar equipamento';
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ModalFormulario open={aberto} onOpenChange={onOpenChange} tamanho="sm">
      <ModalFormularioHeader
        title="Novo Equipamento"
        description="Cadastre um equipamento para vinculá-lo a esta ordem de serviço."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <ModalFormularioBody>
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.marca)}>
              <FieldLabel htmlFor="eq-marca">
                Marca / Modelo <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="eq-marca"
                placeholder="Ex: LG Dual Inverter"
                aria-invalid={Boolean(errors.marca)}
                {...register('marca')}
              />
              <FieldError errors={[errors.marca]} />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.btus)}>
                <FieldLabel htmlFor="eq-btus">
                  Capacidade / BTUs <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="eq-btus"
                  placeholder="Ex: 12.000 BTUs"
                  aria-invalid={Boolean(errors.btus)}
                  {...register('btus')}
                />
                <FieldError errors={[errors.btus]} />
              </Field>

              <Field data-invalid={Boolean(errors.local_instalacao)}>
                <FieldLabel htmlFor="eq-local">
                  Local de Instalação{' '}
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="eq-local"
                  placeholder="Ex: Sala de Reunião"
                  aria-invalid={Boolean(errors.local_instalacao)}
                  {...register('local_instalacao')}
                />
                <FieldError errors={[errors.local_instalacao]} />
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.andar_id)}>
              <FieldLabel htmlFor="eq-andar">
                Andar <span className="text-destructive">*</span>
              </FieldLabel>
              <Controller
                control={control}
                name="andar_id"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(Number(val))}
                    disabled={salvando || carregandoAndares}
                  >
                    <SelectTrigger
                      id="eq-andar"
                      className="w-full"
                      aria-invalid={Boolean(errors.andar_id)}
                    >
                      <SelectValue
                        placeholder={
                          carregandoAndares
                            ? 'Carregando andares...'
                            : 'Selecione o andar'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {andares.map((andar) => (
                          <SelectItem key={andar.id} value={String(andar.id)}>
                            {andar.descricao}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.andar_id]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="eq-obs">Observações Adicionais</FieldLabel>
              <Textarea
                id="eq-obs"
                placeholder="Ex: Unidade condensadora no telhado"
                rows={2}
                {...register('observacao')}
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
          <Button type="submit" disabled={salvando}>
            {salvando && <Spinner data-icon="inline-start" />}
            Adicionar Equipamento
          </Button>
        </ModalFormularioFooter>
      </form>
    </ModalFormulario>
  );
}
