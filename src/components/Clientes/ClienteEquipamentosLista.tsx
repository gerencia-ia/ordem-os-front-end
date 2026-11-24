'use client';

import { Fragment } from 'react';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/src/components/Ui/item';
import { Button } from '@/src/components/Ui/button';
import { Skeleton } from '@/src/components/Ui/skeleton';
import { Spinner } from '@/src/components/Ui/spinner';
import { AirVent, Pencil, Trash2 } from 'lucide-react';

export interface EquipamentoListaItem {
  id?: number | string;
  marca: string;
  btus: string;
  local_instalacao: string;
  observacao?: string | null;
  andar?: { descricao?: string | null } | null;
}

interface ClienteEquipamentosListaProps {
  itens: EquipamentoListaItem[];
  loading?: boolean;
  excluindoId?: number | string | null;
  emptyMessage?: string;
  onEditar: (index: number) => void;
  onExcluir: (index: number) => void;
}

export function ClienteEquipamentosLista({
  itens,
  loading = false,
  excluindoId = null,
  emptyMessage = 'Nenhum equipamento vinculado a este cliente.',
  onEditar,
  onExcluir,
}: ClienteEquipamentosListaProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-14 w-full rounded-md" />
        <Skeleton className="h-14 w-full rounded-md" />
      </div>
    );
  }

  if (itens.length === 0) {
    return (
      <p className="text-muted-foreground/70 text-xs italic">{emptyMessage}</p>
    );
  }

  return (
    <ItemGroup className="bg-background/60 overflow-hidden rounded-lg border">
      {itens.map((eq, index) => {
        const estaExcluindo =
          excluindoId !== null &&
          eq.id !== undefined &&
          String(excluindoId) === String(eq.id);

        const detalhes = [
          eq.local_instalacao,
          eq.andar?.descricao,
          eq.observacao?.trim(),
        ]
          .filter(Boolean)
          .join(' • ');

        return (
          <Fragment key={eq.id ?? `equip-mem-${index}`}>
            {index > 0 && <ItemSeparator />}
            <Item
              size="sm"
              className="flex-nowrap items-center gap-3 px-3 py-2.5"
            >
              <ItemMedia variant="icon" className="text-primary">
                <AirVent />
              </ItemMedia>

              <ItemContent className="min-w-0">
                <ItemTitle className="w-full truncate">
                  {eq.marca || 'Equipamento'}{' '}
                  {eq.btus ? `• ${eq.btus} BTUs` : ''}
                </ItemTitle>
                {detalhes && (
                  <ItemDescription className="truncate text-xs">
                    {detalhes}
                  </ItemDescription>
                )}
              </ItemContent>

              <ItemActions className="shrink-0 gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEditar(index)}
                  disabled={estaExcluindo}
                  aria-label={`Editar equipamento ${eq.marca}`}
                  title="Editar equipamento"
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onExcluir(index)}
                  disabled={estaExcluindo}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={`Excluir equipamento ${eq.marca}`}
                  title="Excluir equipamento"
                >
                  {estaExcluindo ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </Button>
              </ItemActions>
            </Item>
          </Fragment>
        );
      })}
    </ItemGroup>
  );
}
