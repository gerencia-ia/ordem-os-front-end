import type { jsPDF as JsPDFInstance } from 'jspdf';
import { DADOS_EMPRESA } from '@/src/lib/empresa';
import { ORCAMENTO_STATUS_LABELS, type Orcamento } from '@/src/types/orcamento';

interface JsPDFWithAutoTable extends JsPDFInstance {
  lastAutoTable?: {
    finalY: number;
  };
}

function formatarMoeda(valor: string | number | null | undefined): string {
  const num = Number(valor) || 0;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
}

function formatarDataSimples(dataStr?: string | null): string {
  if (!dataStr) return '-';
  // Evita deslocamento de fuso em datas YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  const d = new Date(dataStr);
  if (Number.isNaN(d.getTime())) return dataStr;
  return d.toLocaleDateString('pt-BR');
}

function formatarEndereco(orcamento: Orcamento): string {
  const end = orcamento.endereco;
  if (!end) return 'Não informado';
  const partes = [
    `${end.rua}, ${end.numero}`,
    end.complemento ? `(${end.complemento})` : null,
    end.bairro,
    end.cidade,
    end.cep ? `CEP: ${end.cep}` : null,
  ].filter(Boolean);
  return partes.join(' - ');
}

function garantirEspaco(
  doc: JsPDFInstance,
  yAtual: number,
  alturaNecessaria: number,
): number {
  const alturaPagina = doc.internal.pageSize.getHeight();
  if (yAtual + alturaNecessaria > alturaPagina - 20) {
    doc.addPage();
    return 18;
  }
  return yAtual;
}

async function gerarDocumentoPdfOrcamento(
  orcamento: Orcamento,
): Promise<JsPDFInstance> {
  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  }) as JsPDFWithAutoTable;

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2;

  // 1. Cabeçalho Corporativo
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 34, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(DADOS_EMPRESA.nome, marginX, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text(
    `${DADOS_EMPRESA.razaoSocial} • CNPJ: ${DADOS_EMPRESA.cnpj}`,
    marginX,
    18,
  );
  doc.text(
    `Tel: ${DADOS_EMPRESA.telefone} • E-mail: ${DADOS_EMPRESA.email}`,
    marginX,
    23,
  );
  doc.text(DADOS_EMPRESA.endereco, marginX, 28);

  // Bloco direito: Número, Emissão, Validade
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('ORÇAMENTO', pageWidth - marginX, 11, { align: 'right' });

  doc.setFontSize(10);
  doc.text(`#${orcamento.numero_orcamento}`, pageWidth - marginX, 17, {
    align: 'right',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    `Emissão: ${formatarDataSimples(orcamento.created_at)}`,
    pageWidth - marginX,
    23,
    { align: 'right' },
  );
  doc.text(
    `Validade: ${formatarDataSimples(orcamento.data_validade)}`,
    pageWidth - marginX,
    28,
    { align: 'right' },
  );

  let y = 42;

  // 2. Dados do Cliente e Local de Atendimento
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(marginX, y, contentWidth, 24, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('DADOS DO CLIENTE', marginX + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const telefoneCliente =
    orcamento.cliente?.telefones?.[0]?.numero || 'Não informado';
  const emailCliente = orcamento.cliente?.email || 'Não informado';
  const statusLabel =
    ORCAMENTO_STATUS_LABELS[orcamento.status] || orcamento.status;

  doc.text(
    `Cliente: ${orcamento.cliente?.nome || 'Não informado'}`,
    marginX + 4,
    y + 12,
  );
  doc.text(`Status: ${statusLabel}`, pageWidth - marginX - 4, y + 12, {
    align: 'right',
  });
  doc.text(
    `Telefone: ${telefoneCliente} • E-mail: ${emailCliente}`,
    marginX + 4,
    y + 17,
  );

  const enderecoLines = doc.splitTextToSize(
    `Endereço: ${formatarEndereco(orcamento)}`,
    contentWidth - 8,
  );
  doc.text(enderecoLines[0] || '', marginX + 4, y + 22);

  y += 30;

  // 3. Tabela de Serviços
  const equipamentosMap = new Map(
    (orcamento.equipamentos || []).map((eq) => [
      Number(eq.equipamento_id ?? eq.id),
      eq,
    ]),
  );

  if (orcamento.servicos && orcamento.servicos.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('SERVIÇOS E MÃO DE OBRA', marginX, y);
    y += 2;

    const servicosRows = orcamento.servicos.map((srv) => {
      const eq = equipamentosMap.get(Number(srv.equipamento_id));
      const eqTexto = eq
        ? `${eq.marca} ${eq.btus ? `${eq.btus} BTUs` : ''} (${eq.local_instalacao})`.trim()
        : `Equipamento #${srv.equipamento_id}`;
      const andarTexto = srv.andar?.descricao || eq?.andar?.descricao || '-';
      const qtd = Number(srv.quantidade) || 1;
      const unitario = Number(srv.valor) || 0;
      const subtotal = unitario * qtd;

      return [
        eqTexto,
        andarTexto,
        srv.nome,
        String(qtd),
        formatarMoeda(unitario),
        formatarMoeda(subtotal),
      ];
    });

    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [
        ['Equipamento', 'Andar', 'Serviço', 'Qtd', 'Valor Unit.', 'Subtotal'],
      ],
      body: servicosRows,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { cellWidth: 46 },
        1: { cellWidth: 24 },
        2: { cellWidth: 48 },
        3: { halign: 'center', cellWidth: 12 },
        4: { halign: 'right', cellWidth: 26 },
        5: { halign: 'right', cellWidth: 26 },
      },
    });

    y = (doc.lastAutoTable?.finalY ?? y) + 8;
  }

  // 4. Tabela de Materiais
  if (orcamento.materiais && orcamento.materiais.length > 0) {
    y = garantirEspaco(doc, y, 25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('MATERIAIS E PEÇAS', marginX, y);
    y += 2;

    const materiaisRows = orcamento.materiais.map((mat) => [
      mat.nome,
      formatarMoeda(mat.valor),
    ]);

    autoTable(doc, {
      startY: y,
      margin: { left: marginX, right: marginX },
      head: [['Descrição do Material', 'Valor']],
      body: materiaisRows,
      theme: 'striped',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { cellWidth: 146 },
        1: { halign: 'right', cellWidth: 36 },
      },
    });

    y = (doc.lastAutoTable?.finalY ?? y) + 8;
  }

  // 5. Resumo Financeiro
  const subtotalServicos = Number(orcamento.subtotal_servicos) || 0;
  const subtotalMateriais = Number(orcamento.subtotal_materiais) || 0;
  const desconto = Number(orcamento.desconto) || 0;
  const valorTotal = Number(orcamento.valor_total) || 0;

  const linhasResumo: Array<{
    label: string;
    valor: string;
    destaque?: boolean;
  }> = [
    { label: 'Subtotal Serviços:', valor: formatarMoeda(subtotalServicos) },
    { label: 'Subtotal Materiais:', valor: formatarMoeda(subtotalMateriais) },
  ];
  if (desconto > 0) {
    linhasResumo.push({
      label: 'Desconto:',
      valor: `- ${formatarMoeda(desconto)}`,
    });
  }
  linhasResumo.push({
    label: 'VALOR TOTAL:',
    valor: formatarMoeda(valorTotal),
    destaque: true,
  });

  const boxHeight = linhasResumo.length * 6 + 6;
  y = garantirEspaco(doc, y, boxHeight + 10);

  const boxWidth = 78;
  const boxX = pageWidth - marginX - boxWidth;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(boxX, y, boxWidth, boxHeight, 2, 2, 'FD');

  let linhaY = y + 6;
  for (const item of linhasResumo) {
    if (item.destaque) {
      doc.setDrawColor(203, 213, 225);
      doc.line(boxX + 3, linhaY - 3.5, boxX + boxWidth - 3, linhaY - 3.5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
    }

    doc.text(item.label, boxX + 4, linhaY);
    doc.text(item.valor, boxX + boxWidth - 4, linhaY, { align: 'right' });
    linhaY += 6;
  }

  y += boxHeight + 8;

  // 6. Condições de Pagamento e Observações
  if (orcamento.condicoes_pagamento || orcamento.observacao) {
    y = garantirEspaco(doc, y, 28);

    if (orcamento.condicoes_pagamento) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('CONDIÇÕES DE PAGAMENTO', marginX, y);
      y += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const condLines = doc.splitTextToSize(
        orcamento.condicoes_pagamento,
        contentWidth,
      );
      doc.text(condLines, marginX, y);
      y += condLines.length * 4 + 4;
    }

    if (orcamento.observacao) {
      y = garantirEspaco(doc, y, 20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('OBSERVAÇÕES', marginX, y);
      y += 4.5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const obsLines = doc.splitTextToSize(orcamento.observacao, contentWidth);
      doc.text(obsLines, marginX, y);
      y += obsLines.length * 4 + 4;
    }
  }

  // 7. Bloco de Aprovação / Assinatura
  y = garantirEspaco(doc, y, 28);
  y += 6;

  doc.setDrawColor(148, 163, 184);
  doc.line(marginX, y + 10, marginX + 85, y + 10);
  doc.line(pageWidth - marginX - 55, y + 10, pageWidth - marginX, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Assinatura do Cliente (Aprovação)', marginX, y + 14.5);
  doc.text('Data: ____/____/________', pageWidth - marginX - 55, y + 14.5);

  // 8. Rodapé com numeração de páginas
  const totalPaginas = doc.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, pageHeight - 13, pageWidth - marginX, pageHeight - 13);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `${DADOS_EMPRESA.nome} • Orçamento #${orcamento.numero_orcamento}`,
      marginX,
      pageHeight - 8.5,
    );
    doc.text(
      `Página ${i} de ${totalPaginas}`,
      pageWidth - marginX,
      pageHeight - 8.5,
      { align: 'right' },
    );
  }

  return doc;
}

export async function baixarPdfOrcamento(orcamento: Orcamento): Promise<void> {
  const doc = await gerarDocumentoPdfOrcamento(orcamento);
  const nomeArquivo = `orcamento-${orcamento.numero_orcamento || orcamento.id}.pdf`;
  doc.save(nomeArquivo);
}

export async function visualizarPdfOrcamento(
  orcamento: Orcamento,
): Promise<void> {
  const doc = await gerarDocumentoPdfOrcamento(orcamento);
  const blobUrl = doc.output('bloburl');
  window.open(blobUrl, '_blank', 'noopener,noreferrer');
}
