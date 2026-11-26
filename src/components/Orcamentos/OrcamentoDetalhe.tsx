'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/Ui/select';
import { StatusBadge } from '@/src/components/Ui/status-badge';
import { useOrcamentoDetalhe } from '@/src/hooks/useOrcamentoDetalhe';
import {
  ORCAMENTO_STATUS_EDITAVEIS_OPTIONS,
  ORCAMENTO_STATUS_LABELS,
  type OrcamentoStatusEditavel,
} from '@/src/types/orcamento';
import { OrcamentoModalForm } from './OrcamentoModalForm';
import { OrcamentoModalConverterOs } from './OrcamentoModalConverterOs';
import { OrcamentoModalExcluir } from './OrcamentoModalExcluir';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRightCircle,
  Cpu,
  ExternalLink,
  Eye,
  FileDown,
  Loader2,
  MapPin,
  MessageCircle,
  Package,
  Pencil,
  Phone,
  RefreshCw,
  Trash2,
  User,
  Wrench,
} from 'lucide-react';

interface OrcamentoDetalheProps {
  orcamentoId: string | number;
}

function formatarMoeda(valor: string | number | null | undefined): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valor) || 0);
}

function formatarData(dataStr?: string | null): string {
  if (!dataStr) return '-';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  const d = new Date(dataStr);
  if (Number.isNaN(d.getTime())) return dataStr;
  return d.toLocaleDateString('pt-BR');
}

export function OrcamentoDetalhe({ orcamentoId }: OrcamentoDetalheProps) {
  const {
    orcamento,
    loading,
    error,
    acaoLoading,
    gerandoPdf,
    convertendo,
    recarregar,
    atualizarStatus,
    baixarPdf,
    visualizarPdf,
    abrirWhatsApp,
    converterEmOrdem,
    excluir,
  } = useOrcamentoDetalhe(orcamentoId);

  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalConverterAberto, setModalConverterAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Carregando detalhes do orçamento...
        </p>
      </div>
    );
  }

  if (error || !orcamento) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card className="border-destructive/30">
          <CardContent className="p-8 flex flex-col items-center text-center gap-4">
            <AlertCircle className="size-10 text-destructive" />
            <div>
              <h2 className="text-lg font-semibold">
                Não foi possível carregar o orçamento
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {error || 'Orçamento não encontrado.'}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/orcamentos">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="size-4 mr-1.5" />
                  Voltar
                </Button>
              </Link>
              <Button size="sm" onClick={recarregar}>
                <RefreshCw className="size-4 mr-1.5" />
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isConvertido = orcamento.status === 'convertido';
  const podeConverter = orcamento.status === 'aprovado' && !isConvertido;
  const telefoneCliente = orcamento.cliente?.telefones?.[0]?.numero;
  const statusLabel =
    ORCAMENTO_STATUS_LABELS[orcamento.status] || orcamento.status;

  const equipamentosMap = new Map(
    (orcamento.equipamentos || []).map((eq) => [
      Number(eq.equipamento_id ?? eq.id),
      eq,
    ]),
  );

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6">
      {/* Barra Superior */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <Link href="/orcamentos">
            <Button variant="outline" size="icon" className="shrink-0">
              <ArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold font-mono tracking-tight">
                #{orcamento.numero_orcamento}
              </h1>
              <StatusBadge status={statusLabel} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Emitido em {formatarData(orcamento.created_at)} • Validade:{' '}
              {formatarData(orcamento.data_validade)}
            </p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={baixarPdf}
            disabled={gerandoPdf}
          >
            {gerandoPdf ? (
              <Loader2 className="size-4 mr-1.5 animate-spin" />
            ) : (
              <FileDown className="size-4 mr-1.5" />
            )}
            Baixar PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={visualizarPdf}
            disabled={gerandoPdf}
          >
            <Eye className="size-4 mr-1.5" />
            Visualizar PDF
          </Button>

          {telefoneCliente && (
            <Button
              variant="outline"
              size="sm"
              onClick={abrirWhatsApp}
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              <MessageCircle className="size-4 mr-1.5" />
              WhatsApp
            </Button>
          )}

          {!isConvertido && (
            <>
              <Select
                value={orcamento.status}
                onValueChange={(val) =>
                  atualizarStatus(val as OrcamentoStatusEditavel)
                }
                disabled={acaoLoading}
              >
                <SelectTrigger className="h-8 w-[150px] text-xs">
                  <SelectValue placeholder="Alterar status" />
                </SelectTrigger>
                <SelectContent>
                  {ORCAMENTO_STATUS_EDITAVEIS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalEditarAberto(true)}
                disabled={acaoLoading}
              >
                <Pencil className="size-4 mr-1.5" />
                Editar
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setModalExcluirAberto(true)}
                disabled={acaoLoading}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
              </Button>
            </>
          )}

          {podeConverter && (
            <Button
              size="sm"
              onClick={() => setModalConverterAberto(true)}
              disabled={convertendo}
              className="gap-1.5"
            >
              <ArrowRightCircle className="size-4" />
              Converter em OS
            </Button>
          )}

          {isConvertido && orcamento.ordem_servico_id && (
            <Link href={`/ordens/${orcamento.ordem_servico_id}`}>
              <Button size="sm" variant="secondary" className="gap-1.5">
                <ExternalLink className="size-4" />
                Ver OS #
                {orcamento.ordem_servico?.numero_ordem ||
                  orcamento.ordem_servico_id}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Coluna Esquerda (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Serviços */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench className="size-4 text-primary" />
                Serviços e Mão de Obra ({orcamento.servicos?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!orcamento.servicos?.length ? (
                <p className="text-xs text-muted-foreground italic">
                  Nenhum serviço incluído neste orçamento.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs text-muted-foreground">
                      <tr>
                        <th className="text-left p-2.5 font-medium">Serviço</th>
                        <th className="text-left p-2.5 font-medium">
                          Equipamento / Andar
                        </th>
                        <th className="text-center p-2.5 font-medium">Qtd</th>
                        <th className="text-right p-2.5 font-medium">
                          Unitário
                        </th>
                        <th className="text-right p-2.5 font-medium">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orcamento.servicos.map((srv) => {
                        const eq = equipamentosMap.get(
                          Number(srv.equipamento_id),
                        );
                        const qtd = Number(srv.quantidade) || 1;
                        const unit = Number(srv.valor) || 0;
                        return (
                          <tr key={srv.id} className="text-xs">
                            <td className="p-2.5 font-medium">{srv.nome}</td>
                            <td className="p-2.5 text-muted-foreground">
                              {eq
                                ? `${eq.marca} ${eq.btus ? `${eq.btus} BTUs` : ''} • ${eq.local_instalacao}`
                                : `Equipamento #${srv.equipamento_id}`}
                              {srv.andar?.descricao
                                ? ` (${srv.andar.descricao})`
                                : ''}
                            </td>
                            <td className="p-2.5 text-center tabular-nums">
                              {qtd}
                            </td>
                            <td className="p-2.5 text-right tabular-nums">
                              {formatarMoeda(unit)}
                            </td>
                            <td className="p-2.5 text-right font-semibold tabular-nums">
                              {formatarMoeda(unit * qtd)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Materiais */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="size-4 text-primary" />
                Materiais e Peças ({orcamento.materiais?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!orcamento.materiais?.length ? (
                <p className="text-xs text-muted-foreground italic">
                  Nenhum material incluído neste orçamento.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-xs text-muted-foreground">
                      <tr>
                        <th className="text-left p-2.5 font-medium">
                          Material
                        </th>
                        <th className="text-right p-2.5 font-medium">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {orcamento.materiais.map((mat) => (
                        <tr key={mat.id} className="text-xs">
                          <td className="p-2.5 font-medium">{mat.nome}</td>
                          <td className="p-2.5 text-right font-semibold tabular-nums">
                            {formatarMoeda(mat.valor)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Condições e Observações */}
          {(orcamento.condicoes_pagamento || orcamento.observacao) && (
            <Card className="shadow-xs border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  Condições e Observações
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                {orcamento.condicoes_pagamento && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Condições de Pagamento
                    </p>
                    <p className="text-sm whitespace-pre-line">
                      {orcamento.condicoes_pagamento}
                    </p>
                  </div>
                )}
                {orcamento.observacao && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Observações
                    </p>
                    <p className="text-sm whitespace-pre-line">
                      {orcamento.observacao}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Coluna Direita (1/3) */}
        <div className="flex flex-col gap-6">
          {/* Resumo Financeiro */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal Serviços</span>
                <span className="font-medium tabular-nums">
                  {formatarMoeda(orcamento.subtotal_servicos)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal Materiais
                </span>
                <span className="font-medium tabular-nums">
                  {formatarMoeda(orcamento.subtotal_materiais)}
                </span>
              </div>
              {Number(orcamento.desconto) > 0 && (
                <div className="flex justify-between text-rose-600 dark:text-rose-400">
                  <span>Desconto</span>
                  <span className="font-medium tabular-nums">
                    - {formatarMoeda(orcamento.desconto)}
                  </span>
                </div>
              )}
              <div className="border-t pt-2.5 mt-1 flex justify-between items-baseline">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {formatarMoeda(orcamento.valor_total)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Cliente e Endereço */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="size-4 text-primary" />
                Cliente e Local
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-xs">
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {orcamento.cliente?.nome || 'Não informado'}
                </p>
                {orcamento.cliente?.email && (
                  <p className="text-muted-foreground mt-0.5">
                    {orcamento.cliente.email}
                  </p>
                )}
                {telefoneCliente && (
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <Phone className="size-3" />
                    {telefoneCliente}
                  </p>
                )}
              </div>

              {orcamento.endereco && (
                <div className="border-t pt-3 flex items-start gap-2 text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0 mt-0.5 text-primary" />
                  <span>
                    {orcamento.endereco.rua}, {orcamento.endereco.numero}
                    {orcamento.endereco.complemento
                      ? ` (${orcamento.endereco.complemento})`
                      : ''}{' '}
                    - {orcamento.endereco.bairro}, {orcamento.endereco.cidade}
                    {orcamento.endereco.cep
                      ? ` • CEP: ${orcamento.endereco.cep}`
                      : ''}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Equipamentos */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="size-4 text-primary" />
                Equipamentos ({orcamento.equipamentos?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-xs">
              {!orcamento.equipamentos?.length ? (
                <p className="text-muted-foreground italic">
                  Nenhum equipamento vinculado.
                </p>
              ) : (
                orcamento.equipamentos.map((eq) => (
                  <div
                    key={eq.equipamento_id ?? eq.id}
                    className="rounded-md border bg-muted/30 p-2.5 flex flex-col gap-0.5"
                  >
                    <span className="font-medium text-foreground">
                      {eq.marca} {eq.btus ? `• ${eq.btus} BTUs` : ''}
                    </span>
                    <span className="text-muted-foreground">
                      {eq.local_instalacao}
                      {eq.andar?.descricao ? ` (${eq.andar.descricao})` : ''}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modais */}
      {modalEditarAberto && !isConvertido && (
        <OrcamentoModalForm
          key={orcamento.id}
          aberto={modalEditarAberto}
          orcamentoInicial={orcamento}
          onOpenChange={setModalEditarAberto}
          onSucesso={recarregar}
        />
      )}

      {modalConverterAberto && podeConverter && (
        <OrcamentoModalConverterOs
          orcamento={orcamento}
          aberto={modalConverterAberto}
          onOpenChange={setModalConverterAberto}
          onConfirmar={converterEmOrdem}
          convertendo={convertendo}
        />
      )}

      <OrcamentoModalExcluir
        orcamento={orcamento}
        aberto={modalExcluirAberto}
        onOpenChange={setModalExcluirAberto}
        onConfirmar={async () => {
          await excluir();
        }}
        excluindo={acaoLoading}
      />
    </div>
  );
}
