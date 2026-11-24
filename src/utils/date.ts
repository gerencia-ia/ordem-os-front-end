/**
 * Formata data e hora no padrão curto brasileiro (dd/mm/aaaa, hh:mm).
 * Retorna '-' caso a data seja nula ou indefinida.
 */
export function formatarDataHoraCurta(data?: string | Date | null): string {
  if (!data) return '-';

  try {
    const d = new Date(data);
    if (isNaN(d.getTime())) return '-';

    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(d);
  } catch {
    return '-';
  }
}

/**
 * Formata apenas a data no padrão brasileiro longo (Ex: 7 de novembro de 2026).
 */
export function formatarDataPorExtenso(data?: string | Date | null): string {
  if (!data) return '-';

  try {
    const d = new Date(data);
    if (isNaN(d.getTime())) return '-';

    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch {
    return '-';
  }
}

/**
 * Formata uma duração em minutos inteiros para o padrão hh:mm (ex: 90 -> "01:30").
 * Retorna "—" quando nulo, inválido ou menor/igual a zero.
 */
export function formatarDuracaoHHMM(minutos?: number | string | null): string {
  if (minutos == null || minutos === '') return '—';
  const total = Math.round(Number(minutos));
  if (!Number.isFinite(total) || total <= 0) return '—';

  const horas = Math.floor(total / 60);
  const mins = total % 60;
  return `${String(horas).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}
