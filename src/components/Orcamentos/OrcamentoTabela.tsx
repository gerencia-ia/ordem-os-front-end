'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/Ui/table';
import { Button } from '@/src/components/Ui/button';
import { Skeleton } from '@/src/components/Ui/skeleton';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/Ui/empty';
import { StatusBadge } from '@/src/components/Ui/status-badge';
import { ORCAMENTO_STATUS_LABELS, type Orcamento } from '@/src/types/orcamento';
import { baixarPdfOrcamento } from '@/src/utils/pdf-orcamento';
import { gerarLinkWhatsAppOrcamento } from '@/src/utils/whatsapp';
import {
  Eye,
  FileDown,
  FileText,
  Loader2,
  MessageCircle,
  Pencil,
  Phone,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

interface OrcamentoTabelaProps {
  orcamentos: Orcamento[];
  loading: boolean;
  onEditar: (orcamento: Orcamento) => void;
  onExcluir: (orcamento: Orcamento) => void;
  onLimparFiltros: () => void;
}

function formatarMoeda(valor: string | number): string {
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

export function OrcamentoTabela({
  orcamentos,
  loading,
  onEditar,
  onExcluir,
  onLimparFiltros,
}: OrcamentoTabelaProps) {
  const [pdfGerandoId, setPdfGerandoId] = useState<number | null>(null);

  const handleBaixarPdf = async (orcamento: Orcamento) => {
    try {
      setPdfGerandoId(orcamento.id);
      await baixarPdfOrcamento(orcamento);
      toast.success('PDF do orçamento gerado!');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao gerar PDF do orçamento';
      toast.error(msg);
    } finally {
      setPdfGerandoId(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[140px]">Número</TableHead>
              <TableHead className="min-w-[200px]">Cliente</TableHead>
              <TableHead className="w-[120px]">Validade</TableHead>
              <TableHead className="w-[140px]">Status</TableHead>
              <TableHead className="w-[130px]">Valor Total</TableHead>
              <TableHead className="w-[180px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (orcamentos.length === 0) {
    return (
      <Empty className="border rounded-lg bg-card/40 my-4">
        <EmptyMedia variant="icon">
          <FileText className="size-5 text-muted-foreground" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Nenhum orçamento encontrado</EmptyTitle>
          <EmptyDescription>
            Ajuste os filtros de busca ou crie um novo orçamento.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            size="sm"
            onClick={onLimparFiltros}
            className="text-xs"
          >
            Limpar filtros
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[150px]">Número</TableHead>
            <TableHead className="min-w-[200px]">Cliente</TableHead>
            <TableHead className="w-[120px]">Validade</TableHead>
            <TableHead className="w-[150px]">Status</TableHead>
            <TableHead className="w-[130px]">Valor Total</TableHead>
            <TableHead className="w-[200px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orcamentos.map((orcamento) => {
            const statusTexto =
              ORCAMENTO_STATUS_LABELS[orcamento.status] || orcamento.status;
            const telefone = orcamento.cliente?.telefones?.[0]?.numero;
            const isConvertido = orcamento.status === 'convertido';
            const gerandoEstePdf = pdfGerandoId === orcamento.id;

            return (
              <TableRow key={orcamento.id} className="hover:bg-muted/30">
                <TableCell className="font-mono font-bold text-primary text-xs">
                  #{orcamento.numero_orcamento || orcamento.id}
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground text-xs">
                      {orcamento.cliente?.nome || '-'}
                    </span>
                    {telefone && (
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Phone className="h-2.5 w-2.5 shrink-0" />
                        {telefone}
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {formatarData(orcamento.data_validade)}
                </TableCell>

                <TableCell>
                  <StatusBadge status={statusTexto} className="text-xs" />
                </TableCell>

                <TableCell className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {formatarMoeda(orcamento.valor_total)}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/orcamentos/${orcamento.id}`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        title="Ver detalhes"
                        aria-label="Ver detalhes do orçamento"
                      >
                        <Eye className="size-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleBaixarPdf(orcamento)}
                      disabled={gerandoEstePdf}
                      title="Baixar PDF"
                      aria-label="Baixar PDF do orçamento"
                    >
                      {gerandoEstePdf ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <FileDown className="size-4" />
                      )}
                    </Button>

                    {telefone && (
                      <a
                        href={gerarLinkWhatsAppOrcamento(telefone, orcamento)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-emerald-600"
                          title="Enviar via WhatsApp"
                          aria-label="Enviar orçamento via WhatsApp"
                        >
                          <MessageCircle className="size-4" />
                        </Button>
                      </a>
                    )}

                    {!isConvertido && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-foreground"
                          onClick={() => onEditar(orcamento)}
                          title="Editar orçamento"
                          aria-label="Editar orçamento"
                        >
                          <Pencil className="size-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => onExcluir(orcamento)}
                          title="Excluir orçamento"
                          aria-label="Excluir orçamento"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
