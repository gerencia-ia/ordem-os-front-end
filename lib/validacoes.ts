// Utilitários de validação para o sistema

export const validacoes = {
  email: (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  telefone: (telefone: string): boolean => {
    const regex = /^(\d{2})\s?9?\d{4}-?\d{4}$/;
    return regex.test(telefone.replace(/\D/g, ''));
  },

  descricao: (desc: string): boolean => {
    return desc.trim().length >= 3 && desc.trim().length <= 500;
  },

  custo: (custo: string): boolean => {
    const valor = Number.parseFloat(custo);
    return !isNaN(valor) && valor >= 0;
  },

  dataFutura: (data: string): boolean => {
    return new Date(data) > new Date();
  },

  dataValida: (data: string): boolean => {
    return !isNaN(new Date(data).getTime());
  },

  campos: {
    nome: (nome: string): boolean => nome.trim().length >= 2,
    endereco: (end: string): boolean => end.trim().length >= 5,
    numeroOrdem: (num: string): boolean => /^OS-\d+/.test(num),
  },
};

export const mensagensErro: { [key: string]: string } = {
  email_invalido: 'Email inválido. Use o formato correto.',
  telefone_invalido: 'Telefone inválido. Use o formato (XX) 9XXXX-XXXX',
  descricao_curta: 'Descrição muito curta. Mínimo 3 caracteres.',
  descricao_longa: 'Descrição muito longa. Máximo 500 caracteres.',
  custo_invalido: 'Custo inválido. Use um valor numérico positivo.',
  nome_vazio: 'Nome é obrigatório.',
  endereco_vazio: 'Endereço é obrigatório.',
  data_invalida: 'Data inválida.',
  data_passada: 'A data não pode ser no passado.',
};
