'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import type { Equipamento } from '@/src/types/equipamento';
import { EquipamentoModalCadastro } from '../EquipamentoModalCadastro';
import { Cpu, Plus, Check } from 'lucide-react';

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
    <div className="space-y-3 rounded-lg border bg-card/40 p-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Cpu className="h-4 w-4 text-primary" />
          <span>2. Equipamentos Vinculados</span>
          <span className="text-xs text-muted-foreground font-normal">
            ({equipamentoIdsSelecionados.length} selecionado(s))
          </span>
        </div>

        {clienteId > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setModalNovoEquipamentoAberto(true)}
            className="h-7 text-xs gap-1 border-dashed"
          >
            <Plus className="h-3.5 w-3.5" /> Novo Equipamento
          </Button>
        )}
      </div>

      {!clienteId ? (
        <p className="text-xs text-muted-foreground italic py-2">
          Selecione um cliente acima para visualizar e vincular equipamentos.
        </p>
      ) : loadingEquipamentos ? (
        <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
                {selecionado && <Check className="h-3 w-3" />}
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
    </div>
  );
}
