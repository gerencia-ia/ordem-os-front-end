'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { useOrcamentos } from '@/src/hooks/useOrcamentos';
import type { Orcamento } from '@/src/types/orcamento';
import { OrcamentoFiltros } from './OrcamentoFiltros';
import { OrcamentoTabela } from './OrcamentoTabela';
import { OrcamentoModalForm } from './OrcamentoModalForm';
import { OrcamentoModalExcluir } from './OrcamentoModalExcluir';
import { CheckCircle2, FileText, Plus, Send, Wallet } from 'lucide-react';

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor || 0);
}

export function OrcamentoLista() {
  const {
    orcamentos,
    orcamentosFiltrados,
    resumo,
    loading,
    filtros,
    setBusca,
    setFiltroStatus,
    limparFiltros,
    recarregar,
    excluirOrcamento,
  } = useOrcamentos();

  const [modalFormAberto, setModalFormAberto] = useState(false);
  const [orcamentoEmEdicao, setOrcamentoEmEdicao] = useState<Orcamento | null>(
    null,
  );
  const [orcamentoParaExclusao, setOrcamentoParaExclusao] =
    useState<Orcamento | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const abrirNovoOrcamento = () => {
    setOrcamentoEmEdicao(null);
    setModalFormAberto(true);
  };

  const abrirEdicao = (orcamento: Orcamento) => {
    setOrcamentoEmEdicao(orcamento);
    setModalFormAberto(true);
  };

  const handleConfirmarExclusao = async (id: number) => {
    try {
      setExcluindo(true);
      await excluirOrcamento(id);
    } finally {
      setExcluindo(false);
      setOrcamentoParaExclusao(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Orçamentos</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Elabore propostas comerciais, gere PDFs e converta orçamentos
            aprovados em Ordens de Serviço.
          </p>
        </div>

        <Button onClick={abrirNovoOrcamento} className="gap-1.5 shadow-sm">
          <Plus className="size-4" /> Novo Orçamento
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="shadow-xs border-border/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-bold tabular-nums">{resumo.total}</p>
            </div>
            <FileText className="size-8 text-primary/25" />
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Enviados</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {resumo.enviados}
              </p>
            </div>
            <Send className="size-8 text-blue-500/25" />
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                Aprovados / Convertidos
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {resumo.aprovados}
              </p>
            </div>
            <CheckCircle2 className="size-8 text-emerald-500/25" />
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Valor Aprovado</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {formatarMoeda(resumo.valorAprovado)}
              </p>
            </div>
            <Wallet className="size-8 text-emerald-500/25" />
          </CardContent>
        </Card>
      </div>

      {/* Card Principal */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
          <OrcamentoFiltros
            busca={filtros.busca}
            filtroStatus={filtros.status}
            totalOrcamentos={orcamentos.length}
            totalFiltrados={orcamentosFiltrados.length}
            onBuscaChange={setBusca}
            onStatusChange={setFiltroStatus}
            onLimparFiltros={limparFiltros}
          />
        </CardHeader>
        <CardContent>
          <OrcamentoTabela
            orcamentos={orcamentosFiltrados}
            loading={loading}
            onEditar={abrirEdicao}
            onExcluir={(orcamento) => setOrcamentoParaExclusao(orcamento)}
            onLimparFiltros={limparFiltros}
          />
        </CardContent>
      </Card>

      {/* Modal de Criação/Edição - Montagem sob demanda */}
      {modalFormAberto && (
        <OrcamentoModalForm
          key={orcamentoEmEdicao?.id ?? 'novo'}
          aberto={modalFormAberto}
          orcamentoInicial={orcamentoEmEdicao}
          onOpenChange={(aberto) => {
            setModalFormAberto(aberto);
            if (!aberto) setOrcamentoEmEdicao(null);
          }}
          onSucesso={recarregar}
        />
      )}

      {/* Modal de Exclusão */}
      <OrcamentoModalExcluir
        orcamento={orcamentoParaExclusao}
        aberto={orcamentoParaExclusao !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setOrcamentoParaExclusao(null);
        }}
        onConfirmar={handleConfirmarExclusao}
        excluindo={excluindo}
      />
    </div>
  );
}
