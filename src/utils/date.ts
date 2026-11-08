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
