"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  getOrdensServico,
} from "@/lib/api/ordem_servicos"

import type { OrdemServico } from "@/lib/tipos"

export function useOrdens() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([])
  const [loading, setLoading] = useState(false)

  // Filtros
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroData, setFiltroData] = useState("")
  const [filtroTecnico, setFiltroTecnico] = useState("todos")

  /*
   * Buscar ordens
   */
  const carregarOrdens = useCallback(async () => {
    try {
      setLoading(true)

      const data = await getOrdensServico()

      setOrdens(data)
    } catch (error) {
      console.error(
        "Erro ao buscar ordens:",
        error
      )
    } finally {
      setLoading(false)
    }
  }, [])

  /*
   * Buscar automaticamente ao montar
   */
  useEffect(() => {
    carregarOrdens()
  }, [carregarOrdens])

  /*
   * Filtrar ordens
   */
  const ordensFiltradas = useMemo(() => {
    const termo = normalizarTexto(busca)

    return ordens.filter((ordem) => {
      /*
       * Busca por cliente
       */
      const nomeCliente = normalizarTexto(
        ordem.cliente?.nome
      )

      const matchBusca =
        !termo ||
        nomeCliente.includes(termo)

      /*
       * Status
       */
      const matchStatus =
        filtroStatus === "todos" ||
        ordem.status?.nome === filtroStatus

      /*
       * Data
       */
      const dataOrdem =
        ordem.data_agendamento
          ?.split("T")[0] ?? ""

      const matchData =
        !filtroData ||
        dataOrdem === filtroData

      /*
       * Técnico
       */
      const matchTecnico =
        filtroTecnico === "todos" ||
        ordem.tecnicos?.some(
          (tecnico) =>
            String(tecnico.id) ===
            filtroTecnico
        )

      return (
        matchBusca &&
        matchStatus &&
        matchData &&
        matchTecnico
      )
    })
  }, [
    ordens,
    busca,
    filtroStatus,
    filtroData,
    filtroTecnico,
  ])

  /*
   * Limpar filtros
   */
  const limparFiltros = useCallback(() => {
    setBusca("")
    setFiltroStatus("todos")
    setFiltroData("")
    setFiltroTecnico("todos")
  }, [])

  /*
   * Adicionar uma OS na lista
   *
   * Útil depois de criar uma nova OS.
   */
  const adicionarOrdem = useCallback(
    (ordem: OrdemServico) => {
      setOrdens((atual) => [
        ordem,
        ...atual,
      ])
    },
    []
  )

  return {
    /*
     * Dados
     */
    ordens,
    ordensFiltradas,

    /*
     * Estado
     */
    loading,

    /*
     * Filtros
     */
    filtros: {
      busca,
      status: filtroStatus,
      data: filtroData,
      tecnico: filtroTecnico,
    },

    setBusca,
    setFiltroStatus,
    setFiltroData,
    setFiltroTecnico,

    limparFiltros,

    /*
     * Ações
     */
    carregarOrdens,
    adicionarOrdem,
  }
}

function normalizarTexto(
  valor?: string | null
) {
  return (valor ?? "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
}