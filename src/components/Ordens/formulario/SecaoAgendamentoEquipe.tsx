'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/src/components/Ui/card';
import { Separator } from '@/src/components/Ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { Input } from '@/src/components/Ui/input';
import { Label } from '@/src/components/Ui/label';
import { Badge } from '@/src/components/Ui/badge';
import type { UseFormReturn } from 'react-hook-form';
import type { CriarOrdemFormData, Status, Prioridade } from '@/src/types/ordem';
import type { Usuario } from '@/src/types/usuario';
import { Check, Clock, UserCheck } from 'lucide-react';

interface SecaoAgendamentoEquipeProps {
  form: UseFormReturn<CriarOrdemFormData>;
  statusList: Status[];
  prioridadesList: Prioridade[];
  tecnicos: Usuario[];
  tecnicoIdsSelecionados: number[];
  loadingDados: boolean;
  onToggleTecnico: (id: number) => void;
}

export function SecaoAgendamentoEquipe({
  form,
  statusList,
  prioridadesList,
  tecnicos,
  tecnicoIdsSelecionados,
  loadingDados,
  onToggleTecnico,
}: SecaoAgendamentoEquipeProps) {
  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = form;

  const statusId = watch('status_id');
  const prioridadeId = watch('prioridade_id');

  return (
    <Card className="bg-card/40 border-border/70 py-4 gap-4">
      <CardHeader className="px-4 pb-2 border-b">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          <span>4. Planejamento, Agendamento e Equipe</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="os-status">
              Status Inicial <span className="text-destructive">*</span>
            </Label>
            <Select
              value={statusId ? String(statusId) : ''}
              onValueChange={(val) => {
                setValue('status_id', Number(val), { shouldValidate: true });
              }}
              disabled={loadingDados}
            >
              <SelectTrigger id="os-status" className="w-full">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusList.map((st) => (
                  <SelectItem key={st.id} value={String(st.id)}>
                    {st.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status_id && (
              <p className="text-xs text-destructive">
                {errors.status_id.message}
              </p>
            )}
          </div>

          {/* Prioridade */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="os-prioridade">
              Prioridade <span className="text-destructive">*</span>
            </Label>
            <Select
              value={prioridadeId ? String(prioridadeId) : ''}
              onValueChange={(val) => {
                setValue('prioridade_id', Number(val), {
                  shouldValidate: true,
                });
              }}
              disabled={loadingDados}
            >
              <SelectTrigger id="os-prioridade" className="w-full">
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                {prioridadesList.map((pr) => (
                  <SelectItem key={pr.id} value={String(pr.id)}>
                    {pr.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.prioridade_id && (
              <p className="text-xs text-destructive">
                {errors.prioridade_id.message}
              </p>
            )}
          </div>

          {/* Data de Agendamento */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="os-data">Data de Agendamento</Label>
            <div className="relative">
              <Input
                id="os-data"
                type="datetime-local"
                {...register('data_agendamento')}
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {/* Técnicos Atribuídos */}
        <div className="flex flex-col gap-2 pt-1">
          <Separator />
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground pt-1">
            <UserCheck className="size-3.5 text-primary" />
            <span>Técnicos Atribuídos</span>
            <span className="text-[11px] text-muted-foreground font-normal">
              ({tecnicoIdsSelecionados.length} selecionado(s))
            </span>
          </div>

          {tecnicos.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              Nenhum técnico cadastrado no sistema.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-0.5">
              {tecnicos.map((tec) => {
                const tecId = Number(tec.id);
                const selecionado = tecnicoIdsSelecionados.includes(tecId);
                return (
                  <Badge
                    key={tec.id}
                    variant={selecionado ? 'default' : 'outline'}
                    className="cursor-pointer gap-1.5 py-1 px-2.5 text-xs font-normal transition-all hover:border-primary"
                    onClick={() => onToggleTecnico(tecId)}
                  >
                    {selecionado && <Check className="size-3" />}
                    <span>{tec.nome}</span>
                    {tec.telefone && (
                      <span className="text-[10px] opacity-60">
                        • {tec.telefone}
                      </span>
                    )}
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
