'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { Badge } from '@/src/components/Ui/badge';
import type { Equipamento } from '@/src/types/equipamento';
import { EquipamentoModalCadastro } from '../EquipamentoModalCadastro';
import { Cpu, Plus, Check, Loader2 } from 'lucide-react';

interface SecaoEquipamentosProps {
  clienteId: number;
  equipamentos: Equipamento[];
  equipamentoIdsSelecionados: number[];
  loadingEquipamentos: boolean;
  onToggleEquipamento: (id: number) => void;
  onAdicionarEquipamento: (equipamento: Equipamento) => void;
}

export function SecaoEquipamentos({
  clienteId,
  equipamentos,
  equipamentoIdsSelecionados,
  loadingEquipamentos,
  onToggleEquipamento,
  onAdicionarEquipamento,
}: SecaoEquipamentosProps) {
  const [modalNovoEquipamentoAberto, setModalNovoEquipamentoAberto] =
    useState(false);

  return (
    <Card className="bg-card/40 border-border/70 py-4 gap-4">
      <CardHeader className="px-4 pb-2 border-b">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Cpu className="size-4 text-primary" />
          <span>2. Equipamentos Vinculados</span>
          <span className="text-xs text-muted-foreground font-normal">
            ({equipamentoIdsSelecionados.length} selecionado(s))
          </span>
        </CardTitle>

        {clienteId > 0 && (
          <CardAction>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalNovoEquipamentoAberto(true)}
              className="h-7 text-xs gap-1 border-dashed"
            >
              <Plus className="size-3.5" /> Novo Equipamento
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="px-4 flex flex-col gap-3">
        {!clienteId ? (
          <p className="text-xs text-muted-foreground italic py-2">
            Selecione um cliente acima para visualizar e vincular equipamentos.
          </p>
        ) : loadingEquipamentos ? (
          <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            Carregando equipamentos do cliente...
          </div>
        ) : equipamentos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-4 text-center">
            <p className="text-xs text-muted-foreground">
              Nenhum equipamento cadastrado para este cliente.
            </p>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setModalNovoEquipamentoAberto(true)}
              className="h-7 text-xs mt-1"
            >
              + Cadastrar primeiro equipamento
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {equipamentos.map((eq) => {
              const eqId = Number(eq.id);
              const selecionado = equipamentoIdsSelecionados.includes(eqId);
              return (
                <Badge
                  key={eq.id}
                  variant={selecionado ? 'default' : 'outline'}
                  className="cursor-pointer gap-1.5 py-1 px-2.5 text-xs font-normal transition-all hover:border-primary"
                  onClick={() => onToggleEquipamento(eqId)}
                >
                  {selecionado && <Check className="size-3" />}
                  <span className="font-medium">{eq.marca}</span>
                  <span className="opacity-80">({eq.btus})</span>
                  <span className="text-[10px] opacity-60">
                    • {eq.local_instalacao}
                  </span>
                </Badge>
              );
            })}
          </div>
        )}

        {/* Modal Desacoplado para Cadastro Rápido de Equipamento */}
        {clienteId > 0 && (
          <EquipamentoModalCadastro
            aberto={modalNovoEquipamentoAberto}
            onOpenChange={setModalNovoEquipamentoAberto}
            clienteId={clienteId}
            onSucesso={onAdicionarEquipamento}
          />
        )}
      </CardContent>
    </Card>
  );
}
