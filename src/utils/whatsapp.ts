import { limparTelefone } from './phone';

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
