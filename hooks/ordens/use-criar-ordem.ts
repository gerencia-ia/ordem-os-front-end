"use client"

import {
  useCallback,
  useState,
} from "react"

import {
  createOrdemServico,
} from "@/lib/api/ordem_servicos"

import {
  getClientes,
} from "@/lib/api/clientes"

import {
  getUsers,
} from "@/lib/api/users"

import {
  getServicos,
} from "@/lib/api/servicos"

import {
  getStatus,
} from "@/lib/api/status"

import {
  getPrioridades,
} from "@/lib/api/prioridades"

import {
  getEquipamentosByCliente,
  createEquipamento as apiCreateEquipamento,
} from "@/lib/api/equipamentos"

import type {
  Cliente,
  User,
  Equipamento,
  Servico,
  Status,
  OrdemServico,
  Prioridade,
} from "@/lib/tipos"

/*
 * ============================================================
 * TIPOS DO FORMULÁRIO
 * ============================================================
 */

export interface NovaOrdem {
  clienteId: string
  enderecoId: string

  tecnicoIds: string[]
  equipamentoIds: string[]
  servicoIds: string[]

  descricao: string

  prioridade: string
  status: string

  dataAgendamento: string

  custoEstimado: string
}

export interface NovoEquipamento {
  marca: string
  localInstalacao: string
  capacidade: string
  observacao: string
  clienteId: string
}

/*
 * ============================================================
 * ESTADO INICIAL
 * ============================================================
 */

const estadoInicialNovaOrdem: NovaOrdem = {
  clienteId: "",
  enderecoId: "",

  tecnicoIds: [],
  equipamentoIds: [],
  servicoIds: [],

  descricao: "",

  prioridade: "",
  status: "",

  dataAgendamento: "",

  custoEstimado: "",
}

/*
 * ============================================================
 * HOOK
 * ============================================================
 */

export function useCriarOrdem() {

  /*
   * ==========================================================
   * DADOS NECESSÁRIOS PARA A MODAL
   * ==========================================================
   */

  const [clientes, setClientes] =
    useState<Cliente[]>([])

  const [tecnicos, setTecnicos] =
    useState<User[]>([])

  const [equipamentos, setEquipamentos] =
    useState<Equipamento[]>([])

  const [servicos, setServicos] =
    useState<Servico[]>([])

  const [statusList, setStatusList] =
    useState<Status[]>([])

  const [prioridadesList, setPrioridadesList] =
    useState<Prioridade[]>([])

  /*
   * ==========================================================
   * FORMULÁRIO
   * ==========================================================
   */

  const [novaOrdem, setNovaOrdem] =
    useState<NovaOrdem>(
      estadoInicialNovaOrdem
    )

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  const [loadingClientes, setLoadingClientes] =
    useState(false)

  const [loadingTecnicos, setLoadingTecnicos] =
    useState(false)

  const [loadingEquipamentos, setLoadingEquipamentos] =
    useState(false)

  const [loadingServicos, setLoadingServicos] =
    useState(false)

  const [loadingStatus, setLoadingStatus] =
    useState(false)

  const [loadingPrioridades, setLoadingPrioridades] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  /*
   * ==========================================================
   * CARREGAR DADOS DA MODAL
   * ==========================================================
   */

  const carregarDados = useCallback(
    async () => {
      try {
        setLoadingClientes(true)
        setLoadingTecnicos(true)
        setLoadingServicos(true)
        setLoadingStatus(true)
        setLoadingPrioridades(true)

        const [
          clientesData,
          tecnicosData,
          servicosData,
          statusData,
          prioridadesData,
        ] = await Promise.all([
          getClientes(),
          getUsers(),
          getServicos(),
          getStatus(),
          getPrioridades(),
        ])

        setClientes(clientesData)
        setTecnicos(tecnicosData)
        setServicos(servicosData)
        setStatusList(statusData)
        setPrioridadesList(
          prioridadesData
        )
      } catch (error) {
        console.error(
          "Erro ao carregar dados da ordem:",
          error
        )

        throw error
      } finally {
        setLoadingClientes(false)
        setLoadingTecnicos(false)
        setLoadingServicos(false)
        setLoadingStatus(false)
        setLoadingPrioridades(false)
      }
    },
    []
  )


  /*
   * ==========================================================
   * CARREGAR EQUIPAMENTOS DO CLIENTE
   * ==========================================================
   */

  const carregarEquipamentos =
    useCallback(
      async (clienteId: number) => {
        try {
          setLoadingEquipamentos(true)

          const data =
            await getEquipamentosByCliente(
              clienteId
            )

          setEquipamentos(data)
        } catch (error) {
          console.error(
            "Erro ao carregar equipamentos:",
            error
          )

          setEquipamentos([])
        } finally {
          setLoadingEquipamentos(false)
        }
      },
      []
    )


  /*
   * ==========================================================
   * CRIAR EQUIPAMENTO
   * ==========================================================
   */

  const criarEquipamento =
    useCallback(
      async (
        equipamento: NovoEquipamento
      ) => {
        try {
          const criado =
            await apiCreateEquipamento({
              marca:
                equipamento.marca,

              btus:
                equipamento.capacidade,

              local_instalacao:
                equipamento.localInstalacao,

              observacao:
                equipamento.observacao,

              cliente_id:
                Number(
                  equipamento.clienteId
                ),
            })

          /*
           * Adiciona o novo equipamento
           * à lista atual.
           */
          setEquipamentos(
            (atual) => [
              ...atual,
              criado,
            ]
          )

          return criado
        } catch (error) {
          console.error(
            "Erro ao criar equipamento:",
            error
          )

          throw error
        }
      },
      []
    )


  /*
   * ==========================================================
   * CRIAR ORDEM DE SERVIÇO
   * ==========================================================
   */

  const criarOrdem =
    useCallback(
      async (): Promise<OrdemServico> => {
        try {
          setSaving(true)

          const payload = {
            ordem_servico: {
              cliente_id:
                Number(
                  novaOrdem.clienteId
                ),

              endereco_id:
                novaOrdem.enderecoId
                  ? Number(
                      novaOrdem.enderecoId
                    )
                  : undefined,

              tecnico_ids:
                novaOrdem.tecnicoIds.map(
                  Number
                ),

              equipamento_ids:
                novaOrdem.equipamentoIds.map(
                  Number
                ),

              servico_ids:
                novaOrdem.servicoIds.map(
                  Number
                ),

              descricao:
                novaOrdem.descricao,

              status_id:
                Number(
                  novaOrdem.status
                ),

              prioridade_id:
                Number(
                  novaOrdem.prioridade
                ),

              data_agendamento:
                converterData(
                  novaOrdem.dataAgendamento
                ),

              custo_estimado:
                novaOrdem.custoEstimado
                  ? Number(
                      novaOrdem.custoEstimado
                    )
                  : undefined,
            },
          }

          const ordem =
            await createOrdemServico(
              payload
            )

          /*
           * Limpa o formulário depois
           * de criar com sucesso.
           */
          resetarFormulario()

          return ordem

        } catch (error) {
          console.error(
            "Erro ao criar ordem:",
            error
          )

          /*
           * O erro continua sendo lançado
           * para a modal decidir como exibi-lo.
           */
          throw error

        } finally {
          setSaving(false)
        }
      },
      [novaOrdem]
    )

  /*
   * ==========================================================
   * RESETAR FORMULÁRIO
   * ==========================================================
   */

  const resetarFormulario =
    useCallback(() => {
      setNovaOrdem(
        estadoInicialNovaOrdem
      )

      setEquipamentos([])
    }, [])

  /*
   * ==========================================================
   * RETORNO
   * ==========================================================
   */

  return {

    /*
     * Dados
     */
    clientes,
    tecnicos,
    equipamentos,
    servicos,
    statusList,
    prioridadesList,

    /*
     * Formulário
     */
    novaOrdem,
    setNovaOrdem,

    /*
     * Loading
     */
    loading: {
      clientes: loadingClientes,
      tecnicos: loadingTecnicos,
      equipamentos:
        loadingEquipamentos,
      servicos: loadingServicos,
      status: loadingStatus,
      prioridades:
        loadingPrioridades,
    },

    saving,

    /*
     * Ações
     */
    carregarDados,
    carregarEquipamentos,
    criarEquipamento,
    criarOrdem,
    resetarFormulario,
  }
}


/*
 * ============================================================
 * AUXILIAR
 * ============================================================
 */

function converterData(
  valor: string
) {
  if (!valor) {
    return undefined
  }

  const data = new Date(valor)

  if (Number.isNaN(data.getTime())) {
    return undefined
  }

  return data.toISOString()
}