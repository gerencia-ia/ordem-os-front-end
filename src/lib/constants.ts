export interface OpcaoMes {
  value: string;
  label: string;
}

export const MESES: readonly OpcaoMes[] = [
  { value: 'todos', label: 'Todos os meses' },
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

export function gerarAnosDisponiveis(
  anosPassados = 3,
  anosFuturos = 1,
): number[] {
  const anoAtual = new Date().getFullYear();
  const lista: number[] = [];
  for (let a = anoAtual + anosFuturos; a >= anoAtual - anosPassados; a--) {
    lista.push(a);
  }
  return lista;
}
