import { limparTelefone } from './phone';
import type { Orcamento } from '@/src/types/orcamento';

export function gerarLinkWhatsApp(
  telefone: string,
  nomeCliente?: string,
): string {
  const digitos = limparTelefone(telefone);
  const numeroCompleto = digitos.startsWith('55') ? digitos : `55${digitos}`;
  const texto = nomeCliente
    ? `Olá ${nomeCliente}, tudo bem? Entramos em contato a respeito da sua Ordem de Serviço.`
    : 'Olá, tudo bem?';
  return `https://wa.me/${numeroCompleto}?text=${encodeURIComponent(texto)}`;
}

function formatarMoedaWhatsApp(valor: string | number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valor) || 0);
}

export function gerarLinkWhatsAppOrcamento(
  telefone: string,
  orcamento: Orcamento,
): string {
  const digitos = limparTelefone(telefone);
  const numeroCompleto = digitos.startsWith('55') ? digitos : `55${digitos}`;
  const nome = orcamento.cliente?.nome || 'cliente';

  const linhas: string[] = [
    `Olá ${nome}, tudo bem?`,
    `Segue o resumo do seu *Orçamento #${orcamento.numero_orcamento}*:`,
  ];

  if (orcamento.servicos?.length) {
    linhas.push('', '*Serviços:*');
    orcamento.servicos.slice(0, 6).forEach((s) => {
      const qtd = Number(s.quantidade) || 1;
      const subtotal = (Number(s.valor) || 0) * qtd;
      linhas.push(`• ${s.nome} (${qtd}x) - ${formatarMoedaWhatsApp(subtotal)}`);
    });
    if (orcamento.servicos.length > 6) {
      linhas.push(`• ... e mais ${orcamento.servicos.length - 6} serviço(s)`);
    }
  }

  if (orcamento.materiais?.length) {
    linhas.push('', '*Materiais:*');
    orcamento.materiais.slice(0, 5).forEach((m) => {
      linhas.push(`• ${m.nome} - ${formatarMoedaWhatsApp(m.valor)}`);
    });
    if (orcamento.materiais.length > 5) {
      linhas.push(
        `• ... e mais ${orcamento.materiais.length - 5} material(is)`,
      );
    }
  }

  const desconto = Number(orcamento.desconto) || 0;
  if (desconto > 0) {
    linhas.push('', `Desconto: -${formatarMoedaWhatsApp(desconto)}`);
  }

  linhas.push(
    '',
    `*Valor Total: ${formatarMoedaWhatsApp(orcamento.valor_total)}*`,
  );

  if (orcamento.data_validade) {
    const validade = /^\d{4}-\d{2}-\d{2}$/.test(orcamento.data_validade)
      ? orcamento.data_validade.split('-').reverse().join('/')
      : new Date(orcamento.data_validade).toLocaleDateString('pt-BR');
    linhas.push(`Validade: ${validade}`);
  }

  return `https://wa.me/${numeroCompleto}?text=${encodeURIComponent(linhas.join('\n'))}`;
}
