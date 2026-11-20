'use client';

import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/src/components/Ui/input';
import { Button } from '@/src/components/Ui/button';
import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/src/components/Ui/field';
import { Spinner } from '@/src/components/Ui/spinner';
import type { ClienteFormData } from '@/src/types/cliente';
import { MapPin, Phone, Plus, Search, Trash2 } from 'lucide-react';

interface TelefoneFieldItem {
  id: string;
  index: number;
}

interface EnderecoFieldItem {
  id: string;
  index: number;
}

interface ClienteModalCamposProps {
  form: UseFormReturn<ClienteFormData>;
  idPrefix?: string;
  telefonesAtivos: TelefoneFieldItem[];
  enderecosAtivos: EnderecoFieldItem[];
  buscandoCep: number | null;
  onAdicionarTelefone: () => void;
  onRemoverTelefone: (index: number) => void;
  onAdicionarEndereco: () => void;
  onRemoverEndereco: (index: number) => void;
  onConsultarCep: (index: number) => void;
}

export function ClienteModalCampos({
  form,
  idPrefix = '',
  telefonesAtivos,
  enderecosAtivos,
  buscandoCep,
  onAdicionarTelefone,
  onRemoverTelefone,
  onAdicionarEndereco,
  onRemoverEndereco,
  onConsultarCep,
}: ClienteModalCamposProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="flex flex-col gap-6">
      {/* Dados Básicos */}
      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field className="md:col-span-2" data-invalid={Boolean(errors.nome)}>
          <FieldLabel htmlFor={`${idPrefix}nome`}>
            Nome Completo <span className="text-destructive">*</span>
          </FieldLabel>
          <Input
            id={`${idPrefix}nome`}
            placeholder="Ex: João da Silva"
            aria-invalid={Boolean(errors.nome)}
            {...register('nome')}
          />
          <FieldError errors={[errors.nome]} />
        </Field>

        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor={`${idPrefix}email`}>Email</FieldLabel>
          <Input
            id={`${idPrefix}email`}
            type="email"
            placeholder="exemplo@dominio.com"
            aria-invalid={Boolean(errors.email)}
            {...register('email')}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field>
          <FieldLabel htmlFor={`${idPrefix}data_ultima_visita`}>
            Data da Última Visita
          </FieldLabel>
          <Input
            id={`${idPrefix}data_ultima_visita`}
            type="date"
            {...register('data_ultima_visita')}
          />
        </Field>
      </FieldGroup>

      {/* Telefones */}
      <CardColapsavel
        titulo="Telefones"
        icone={<Phone className="size-4 text-primary" />}
        resumo={`${telefonesAtivos.length} telefone(s)`}
        defaultOpenMobile={false}
        hasError={Boolean(errors.telefones)}
        headerAction={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdicionarTelefone}
            className="h-7 gap-1 text-xs"
          >
            <Plus className="size-3.5" /> Adicionar
            <span className="hidden sm:inline">Telefone</span>
          </Button>
        }
        className="bg-card/40 border-border/70"
      >
        <FieldGroup className="gap-3">
          {telefonesAtivos.map(({ id, index }) => {
            const erroTel = errors.telefones?.[index]?.numero;
            return (
              <Field key={id} data-invalid={Boolean(erroTel)}>
                <div className="flex items-center gap-2">
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="(11) 98765-4321"
                    aria-invalid={Boolean(erroTel)}
                    {...register(`telefones.${index}.numero`)}
                  />
                  {telefonesAtivos.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoverTelefone(index)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      aria-label="Remover telefone"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>
                <FieldError errors={[erroTel]} />
              </Field>
            );
          })}
        </FieldGroup>
      </CardColapsavel>

      {/* Endereços */}
      <CardColapsavel
        titulo="Endereços"
        icone={<MapPin className="size-4 text-primary" />}
        resumo={`${enderecosAtivos.length} endereço(s)`}
        defaultOpenMobile={false}
        hasError={Boolean(errors.enderecos)}
        headerAction={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdicionarEndereco}
            className="h-7 gap-1 text-xs"
          >
            <Plus className="size-3.5" /> Adicionar
            <span className="hidden sm:inline">Endereço</span>
          </Button>
        }
        className="bg-card/40 border-border/70"
        contentClassName="flex flex-col gap-4"
      >
        {enderecosAtivos.map(({ id, index }) => {
          const erroEnd = errors.enderecos?.[index];
          return (
            <div
              key={id}
              className="bg-muted/20 relative flex flex-col gap-3 rounded-lg border p-3 sm:p-4"
            >
              {enderecosAtivos.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onRemoverEndereco(index)}
                  className="text-muted-foreground hover:text-destructive absolute top-2 right-2"
                  aria-label="Remover endereço"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              )}

              <FieldGroup className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Field>
                  <FieldLabel className="text-xs">CEP</FieldLabel>
                  <div className="flex gap-1.5">
                    <Input
                      inputMode="numeric"
                      placeholder="00000-000"
                      {...register(`enderecos.${index}.cep`, {
                        onBlur: () => onConsultarCep(index),
                      })}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => onConsultarCep(index)}
                      disabled={buscandoCep === index}
                      className="shrink-0"
                      aria-label="Buscar CEP"
                    >
                      {buscandoCep === index ? (
                        <Spinner />
                      ) : (
                        <Search className="size-4" />
                      )}
                    </Button>
                  </div>
                </Field>

                <Field
                  className="md:col-span-2"
                  data-invalid={Boolean(erroEnd?.rua)}
                >
                  <FieldLabel className="text-xs">
                    Rua / Logradouro <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    placeholder="Rua das Flores"
                    aria-invalid={Boolean(erroEnd?.rua)}
                    {...register(`enderecos.${index}.rua`)}
                  />
                  <FieldError errors={[erroEnd?.rua]} />
                </Field>
              </FieldGroup>

              <FieldGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                <Field data-invalid={Boolean(erroEnd?.numero)}>
                  <FieldLabel className="text-xs">
                    Número <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    placeholder="123"
                    aria-invalid={Boolean(erroEnd?.numero)}
                    {...register(`enderecos.${index}.numero`)}
                  />
                  <FieldError errors={[erroEnd?.numero]} />
                </Field>

                <Field data-invalid={Boolean(erroEnd?.bairro)}>
                  <FieldLabel className="text-xs">
                    Bairro <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    placeholder="Centro"
                    aria-invalid={Boolean(erroEnd?.bairro)}
                    {...register(`enderecos.${index}.bairro`)}
                  />
                  <FieldError errors={[erroEnd?.bairro]} />
                </Field>

                <Field data-invalid={Boolean(erroEnd?.cidade)}>
                  <FieldLabel className="text-xs">
                    Cidade <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    placeholder="São Paulo"
                    aria-invalid={Boolean(erroEnd?.cidade)}
                    {...register(`enderecos.${index}.cidade`)}
                  />
                  <FieldError errors={[erroEnd?.cidade]} />
                </Field>

                <Field>
                  <FieldLabel className="text-xs">Complemento</FieldLabel>
                  <Input
                    placeholder="Apto 101"
                    {...register(`enderecos.${index}.complemento`)}
                  />
                </Field>
              </FieldGroup>
            </div>
          );
        })}
      </CardColapsavel>
    </div>
  );
}
