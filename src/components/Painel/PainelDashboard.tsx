'use client';

import { usePainel } from '@/src/hooks/usePainel';
import { PainelFiltros } from './PainelFiltros';
import { PainelKpis } from './PainelKpis';
import { PainelGraficoStatus } from './PainelGraficoStatus';
import { PainelGraficoPrioridades } from './PainelGraficoPrioridades';
import { LayoutDashboard, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/src/components/Ui/button';
import { Skeleton } from '@/src/components/Ui/skeleton';

export function PainelDashboard() {
  const {
    loading,
    erro,
    filtroMes,
    setFiltroMes,
    recarregar,
    metricas,
    dadosStatusPie,
    dadosPrioridadeBar,
    podeVerMetricasFinanceiras,
  } = usePainel();

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            Painel Analítico
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Acompanhamento de procedimentos, métricas de produtividade e visão
            operacional
          </p>
        </div>

        <PainelFiltros
          filtroMes={filtroMes}
          onFiltroMesChange={setFiltroMes}
          onRecarregar={recarregar}
          loading={loading}
        />
      </div>

      {/* Erro */}
      {erro && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">{erro}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={recarregar}
            className="border-destructive/30 hover:bg-destructive/10"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Estado de Carregamento */}
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[320px] w-full rounded-xl" />
            <Skeleton className="h-[320px] w-full rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          {/* Métricas Principais (KPIs) */}
          <PainelKpis
            metricas={metricas}
            podeVerMetricasFinanceiras={podeVerMetricasFinanceiras}
          />

          {/* Gráficos Analíticos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PainelGraficoStatus dados={dadosStatusPie} />
            <PainelGraficoPrioridades dados={dadosPrioridadeBar} />
          </div>
        </>
      )}
    </div>
  );
}
