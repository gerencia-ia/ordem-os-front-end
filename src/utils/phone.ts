export function formatarTelefone(telefone?: string | null): string {
  if (!telefone) return '-';
  const digitos = telefone.replace(/\D/g, '');
  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return telefone;
}

export function limparTelefone(telefone: string): string {
  return telefone.replace(/\D/g, '');
}
