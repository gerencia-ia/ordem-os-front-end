'use client';

import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Button } from '@/src/components/Ui/button';
import { Separator } from '@/src/components/Ui/separator';
import {
  HardHat,
  Phone,
  UserCheck,
  Plus,
  Trash2,
  Edit,
  Crown,
} from 'lucide-react';
import { Badge } from '@/src/components/Ui/badge';
import type { Usuario } from '@/src/types/usuario';
import { formatarTelefone } from '@/src/utils/phone';

interface DetalheTecnicosProps {
  tecnicos?: Usuario[] | null;
  tecnicoResponsavel?: Usuario | null;
  podeAtribuirTecnicos: boolean;
  onAtribuirTecnico: (tecnicoAtual?: Usuario | null) => void;
  onRemoverTecnico: (tecnicoId?: number | string) => void | Promise<void>;
  salvando: boolean;
}

export function DetalheTecnicos({
  tecnicos,
  tecnicoResponsavel,
  podeAtribuirTecnicos,
  onAtribuirTecnico,
  onRemoverTecnico,
  salvando,
}: DetalheTecnicosProps) {
  // Normaliza lista de técnicos (sempre array no Rails 8)
  const lista: Usuario[] = Array.isArray(tecnicos)
    ? tecnicos
    : tecnicoResponsavel
      ? [tecnicoResponsavel]
      : [];

  return (
    <CardColapsavel
      titulo={
        <span className="text-base sm:text-lg">
          Técnicos Atribuídos ({lista.length})
        </span>
      }
      icone={<HardHat className="text-muted-foreground size-5" />}
      resumo={
        lista.length > 0
          ? lista.map((t) => t.nome).join(', ')
          : 'Nenhum técnico vinculado'
      }
      defaultOpenMobile={false}
      headerAction={
        podeAtribuirTecnicos && lista.length === 0 ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAtribuirTecnico()}
            disabled={salvando}
            className="gap-1.5"
          >
            <Plus className="size-4" />
            Atribuir
          </Button>
        ) : undefined
      }
      contentClassName="flex flex-col gap-4"
    >
      {lista.length > 0 ? (
        <div className="flex flex-col gap-3">
          {lista.map((tec) => {
            const ehResponsavel =
              tecnicoResponsavel &&
              String(tec.id) === String(tecnicoResponsavel.id);

            return (
              <div
                key={tec.id}
                className="p-3 border rounded-lg bg-card flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <UserCheck className="text-success size-4" />
                      <span className="text-sm font-semibold">{tec.nome}</span>
                      {ehResponsavel && (
                        <Badge
                          variant="secondary"
                          className="border-warning/40 bg-warning/15 text-warning-foreground dark:text-warning gap-1 border px-1.5 py-0 text-[10px]"
                        >
                          <Crown className="size-3" />
                          Responsável
                        </Badge>
                      )}
                    </div>
                    {tec.telefone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="size-3" />
                        {formatarTelefone(tec.telefone)}
                      </p>
                    )}
                  </div>
                </div>

                {podeAtribuirTecnicos && (
                  <div className="flex flex-col gap-2 pt-1">
                    <Separator />
                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 gap-1"
                        onClick={() => onAtribuirTecnico(tec)}
                        disabled={salvando}
                      >
                        <Edit className="size-3" />
                        Alterar
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                        onClick={() => onRemoverTecnico(tec.id)}
                        disabled={salvando}
                      >
                        <Trash2 className="size-3" />
                        Remover
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {podeAtribuirTecnicos && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs gap-1.5 mt-2"
              onClick={() => onAtribuirTecnico()}
              disabled={salvando}
            >
              <Plus className="size-3.5" />
              Adicionar mais um técnico
            </Button>
          )}
        </div>
      ) : (
        <div className="py-6 text-center text-sm text-muted-foreground">
          <p>Nenhum técnico vinculado a esta ordem.</p>
          {podeAtribuirTecnicos && (
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => onAtribuirTecnico()}
              disabled={salvando}
              className="mt-1"
            >
              Clique para atribuir técnico
            </Button>
          )}
        </div>
      )}
    </CardColapsavel>
  );
}
