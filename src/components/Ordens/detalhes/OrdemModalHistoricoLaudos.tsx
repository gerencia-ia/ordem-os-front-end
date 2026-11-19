'use client';

import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Button } from '@/src/components/Ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/Ui/table';
import { Skeleton } from '@/src/components/Ui/skeleton';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/Ui/empty';
import { StatusBadge } from '@/src/components/Ui/status-badge';
import { History } from 'lucide-react';
import type { HistoricoLaudo } from '@/src/types/equipamento';
import type { OsEquipamentoItem } from '@/src/types/ordem';
import { formatarDataHoraCurta } from '@/src/utils/date';

interface OrdemModalHistoricoLaudosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipamento: OsEquipamentoItem | null;
  laudos: HistoricoLaudo[];
  loading: boolean;
}

export function OrdemModalHistoricoLaudos({
  open,
  onOpenChange,
  equipamento,
  laudos,
  loading,
}: OrdemModalHistoricoLaudosProps) {
  return (
    <ModalFormulario open={open} onOpenChange={onOpenChange} tamanho="2xl">
      <ModalFormularioHeader
        title="Histórico de Laudos do Equipamento"
        description={
          equipamento
            ? `${equipamento.marca} (${equipamento.btus} BTUs) — ${equipamento.local_instalacao}`
            : 'Selecione um equipamento.'
        }
      />

      <ModalFormularioBody>
        {loading ? (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[140px]">Data Fechamento</TableHead>
                  <TableHead>Parecer do Laudo</TableHead>
                  <TableHead className="w-[80px]">OS</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : laudos.length > 0 ? (
          <>
            {/* Cards empilhados no mobile */}
            <div className="flex flex-col gap-3 md:hidden">
              {laudos.map((item) => (
                <div
                  key={item.id}
                  className="bg-card/60 flex flex-col gap-2 rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">
                      OS #{item.ordem_servico?.id || '-'}
                    </span>
                    <StatusBadge
                      status={item.ordem_servico?.status || 'Registrado'}
                      className="text-xs"
                    />
                  </div>
                  <p className="text-xs leading-relaxed">{item.laudo}</p>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {item.ordem_servico?.data_fechamento
                      ? formatarDataHoraCurta(
                          item.ordem_servico.data_fechamento,
                        )
                      : formatarDataHoraCurta(item.created_at)}
                  </span>
                </div>
              ))}
            </div>

            {/* Tabela no desktop */}
            <div className="hidden overflow-hidden rounded-md border md:block">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[140px]">Data Fechamento</TableHead>
                    <TableHead>Parecer do Laudo</TableHead>
                    <TableHead className="w-[80px]">OS</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {laudos.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      <TableCell className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                        {item.ordem_servico?.data_fechamento
                          ? formatarDataHoraCurta(
                              item.ordem_servico.data_fechamento,
                            )
                          : formatarDataHoraCurta(item.created_at)}
                      </TableCell>
                      <TableCell>
                        <p className="line-clamp-3 text-xs leading-relaxed">
                          {item.laudo}
                        </p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <span className="text-xs font-semibold">
                          #{item.ordem_servico?.id || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <StatusBadge
                          status={item.ordem_servico?.status || 'Registrado'}
                          className="text-xs"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <Empty className="bg-card/40 rounded-lg border">
            <EmptyMedia variant="icon">
              <History className="text-muted-foreground size-5" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Nenhum laudo anterior</EmptyTitle>
              <EmptyDescription>
                Nenhum laudo técnico anterior registrado para este equipamento.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ModalFormularioBody>

      <ModalFormularioFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Fechar
        </Button>
      </ModalFormularioFooter>
    </ModalFormulario>
  );
}
