// Funções utilitárias gerais

export const formatadores = {
  moeda: (valor: number, moeda = "BRL"): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: moeda,
    }).format(valor)
  },

  data: (data: string | Date, formato = "pt-BR"): string => {
    return new Date(data).toLocaleDateString(formato, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  },

  dataHora: (data: string | Date): string => {
    return new Date(data).toLocaleString("pt-BR")
  },

  dataHoraCurta: (data?: string | Date | null): string => {
    if (!data) return "-"

    const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    })

    return dataFormatada.format(new Date(data))
  },

  telefone: (telefone: string): string => {
    const digitos = telefone.replace(/\D/g, "")
    if (digitos.length === 11) {
      return `(${digitos.slice(0, 2)}) 9${digitos.slice(2, 7)}-${digitos.slice(7)}`
    }
    if (digitos.length === 10) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`
    }
    return telefone
  },

  percentual: (valor: number, decimais = 1): string => {
    return `${(valor * 100).toFixed(decimais)}%`
  },

  tempoDecorrido: (dataInicio: string, dataFim?: string): string => {
    const inicio = new Date(dataInicio)
    const fim = dataFim ? new Date(dataFim) : new Date()
    const diferenca = fim.getTime() - inicio.getTime()
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24))
    const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24)

    if (dias > 0) return `${dias}d ${horas}h`
    return `${horas}h`
  },
}

export const geradores = {
  numeroOrdem: (): string => {
    const ano = new Date().getFullYear()
    const numero = Math.floor(Math.random() * 9000) + 1000
    return `OS-${ano}-${numero}`
  },

  corAleatoriaAvatar: (): string => {
    const cores = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-cyan-500",
    ]
    return cores[Math.floor(Math.random() * cores.length)]
  },

  iniciais: (nome: string): string => {
    return nome
      .split(" ")
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  },
}

export const calculadores = {
  diasAteVencimento: (dataVencimento: string): number => {
    const agora = new Date()
    const vencimento = new Date(dataVencimento)
    const diferenca = vencimento.getTime() - agora.getTime()
    return Math.ceil(diferenca / (1000 * 60 * 60 * 24))
  },

  progressoTarefas: (tarefas: any[]): number => {
    if (tarefas.length === 0) return 0
    const concluidas = tarefas.filter((t) => t.status === "concluida").length
    return (concluidas / tarefas.length) * 100
  },

  custoTotalDia: (ordens: any[]): number => {
    const hoje = new Date().toISOString().split("T")[0]
    return ordens
      .filter((o) => o.dataAbertura.startsWith(hoje))
      .reduce((total, o) => total + (o.custoReal || o.custoEstimado || 0), 0)
  },
}
