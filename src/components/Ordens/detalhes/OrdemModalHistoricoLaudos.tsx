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
import type { Equipamento, HistoricoLaudo } from '@/src/types/equipamento';
import { formatarDataHoraCurta } from '@/src/utils/date';

interface OrdemModalHistoricoLaudosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipamento: Equipamento | null;
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Laudos do Equipamento</DialogTitle>
          <DialogDescription>
            {equipamento ? (
              <span>
                {equipamento.marca} ({equipamento.btus} BTUs) —{' '}
                {equipamento.local_instalacao}
              </span>
            ) : (
              'Selecione um equipamento.'
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="rounded-md border overflow-hidden mt-4">
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
          <div className="mt-4 rounded-md border overflow-hidden">
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
                    <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                      {item.ordem_servico?.data_fechamento
                        ? formatarDataHoraCurta(
                            item.ordem_servico.data_fechamento,
                          )
                        : formatarDataHoraCurta(item.created_at)}
                    </TableCell>
                    <TableCell>
                      <p className="text-xs leading-relaxed line-clamp-3">
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
        ) : (
          <Empty className="border rounded-lg bg-card/40 my-4">
            <EmptyMedia variant="icon">
              <History className="size-5 text-muted-foreground" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Nenhum laudo anterior</EmptyTitle>
              <EmptyDescription>
                Nenhum laudo técnico anterior registrado para este equipamento.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
