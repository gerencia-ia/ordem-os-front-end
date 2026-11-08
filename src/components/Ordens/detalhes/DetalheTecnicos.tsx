'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { HardHat, Phone, UserCheck, Plus, Trash2, Edit } from 'lucide-react';
import type { Usuario } from '@/src/types/usuario';
import { formatarTelefone } from '@/src/utils/phone';

interface DetalheTecnicosProps {
  tecnicos?: Usuario[] | Usuario | null;
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
  // Normaliza tecnicos caso o serializer Rails retorne um objeto único ou array
  const lista: Usuario[] = Array.isArray(tecnicos)
    ? tecnicos
    : tecnicos &&
        typeof tecnicos === 'object' &&
        'id' in (tecnicos as object) &&
        (tecnicos as Usuario).id
      ? [tecnicos as Usuario]
      : tecnicoResponsavel
        ? [tecnicoResponsavel]
        : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <HardHat className="h-5 w-5 text-muted-foreground" />
          Técnicos Atribuídos ({lista.length})
        </CardTitle>
        {podeAtribuirTecnicos && lista.length === 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAtribuirTecnico()}
            disabled={salvando}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Atribuir
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {lista.length > 0 ? (
          <div className="space-y-3">
            {lista.map((tec) => (
              <div
                key={tec.id}
                className="p-3 border rounded-lg bg-card space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold text-sm">{tec.nome}</span>
                    </div>
                    {tec.telefone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" />
                        {formatarTelefone(tec.telefone)}
                      </p>
                    )}
                  </div>
                </div>

                {podeAtribuirTecnicos && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 gap-1"
                      onClick={() => onAtribuirTecnico(tec)}
                      disabled={salvando}
                    >
                      <Edit className="h-3 w-3" />
                      Alterar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 gap-1"
                      onClick={() => onRemoverTecnico(tec.id)}
                      disabled={salvando}
                    >
                      <Trash2 className="h-3 w-3" />
                      Remover
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {podeAtribuirTecnicos && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs gap-1.5 mt-2"
                onClick={() => onAtribuirTecnico()}
                disabled={salvando}
              >
                <Plus className="h-3.5 w-3.5" />
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
      </CardContent>
    </Card>
  );
}
