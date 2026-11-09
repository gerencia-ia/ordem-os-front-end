'use client';

import dynamic from 'next/dynamic';
import { usePainel } from '@/src/hooks/usePainel';
import { PainelFiltros } from './PainelFiltros';
import { PainelKpis } from './PainelKpis';
import { LayoutDashboard, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/src/components/Ui/button';
import { Skeleton } from '@/src/components/Ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/src/components/Ui/alert';

const PainelGraficoStatus = dynamic(
  () => import('./PainelGraficoStatus').then((m) => m.PainelGraficoStatus),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[320px] w-full rounded-xl" />,
  },
);

const PainelGraficoPrioridades = dynamic(
  () =>
    import('./PainelGraficoPrioridades').then(
      (m) => m.PainelGraficoPrioridades,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[320px] w-full rounded-xl" />,
  },
);

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
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">
              Painel Analítico
            </h1>
          </div>
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
        <Alert variant="destructive" className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="size-4 shrink-0" />
            <div>
              <AlertTitle className="text-sm font-semibold">Falha ao carregar dados</AlertTitle>
              <AlertDescription className="text-xs">{erro}</AlertDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={recarregar}
            className="border-destructive/30 hover:bg-destructive/10 text-xs"
          >
            <RefreshCw className="size-3.5 mr-1.5" />
            Tentar novamente
          </Button>
        </Alert>
      )}

      {/* Estado de Carregamento */}
      {loading ? (
        <div className="flex flex-col gap-6">
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
