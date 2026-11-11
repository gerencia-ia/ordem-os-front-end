'use client';

import { Package, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/src/components/Ui/empty';
import type { OsMaterialItem } from '@/src/types/material';

interface Props {
  materiais?: OsMaterialItem[] | null;
  statusId?: number;
  podeAlterarMateriais: boolean;
  podeVerMetricasFinanceiras: boolean;
  onAdicionar: () => void;
  onRemover: (id: number) => void;
  removendoId: number | null;
}

export function DetalheMateriais({ materiais, statusId, podeAlterarMateriais, podeVerMetricasFinanceiras, onAdicionar, onRemover, removendoId }: Props) {
  const lista = materiais ?? [];
  const formatar = (valor: number | string) => Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg flex items-center gap-2"><Package className="size-5 text-muted-foreground" /> Materiais ({lista.length})</CardTitle>
        {statusId !== 3 && podeAlterarMateriais && <Button size="sm" variant="outline" onClick={onAdicionar} className="gap-1.5"><Plus className="size-4" /> Lançar material</Button>}
      </CardHeader>
      <CardContent>
        {lista.length ? <div className="divide-y rounded-lg border overflow-hidden">
          {lista.map((item) => <div key={item.id} className="flex items-center justify-between gap-3 p-3.5">
            <div className="min-w-0"><p className="truncate text-sm font-medium">{item.nome}</p>{item.material_id == null && <p className="text-xs text-muted-foreground">Lançamento avulso</p>}</div>
            <div className="flex items-center gap-3">{podeVerMetricasFinanceiras && <span className="text-sm font-semibold">R$ {formatar(item.valor)}</span>}{statusId !== 3 && podeAlterarMateriais && <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => onRemover(item.id)} disabled={removendoId === item.id} aria-label={`Remover ${item.nome}`}><Trash2 className="size-4" /></Button>}</div>
          </div>)}
          {podeVerMetricasFinanceiras && <div className="flex justify-end gap-2 border-t p-3 text-sm"><span className="text-muted-foreground">Subtotal dos materiais:</span><strong>R$ {formatar(lista.reduce((total, item) => total + Number(item.valor || 0), 0))}</strong></div>}
        </div> : <Empty className="py-5 border rounded-lg"><EmptyHeader><EmptyMedia variant="icon"><Package className="size-5" /></EmptyMedia><EmptyTitle className="text-sm">Nenhum material lançado</EmptyTitle><EmptyDescription className="text-xs">Materiais cadastrados ou avulsos podem ser incluídos nesta ordem.</EmptyDescription></EmptyHeader></Empty>}
      </CardContent>
    </Card>
  );
}
