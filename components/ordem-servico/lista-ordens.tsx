"use client"

import { useEffect, useState } from "react"

import { useOrdens } from "@/hooks/ordens/use-ordens"
import { useCriarOrdem } from "@/hooks/ordens/use-criar-ordem"

import { FiltrosOrdens } from "./filtros-ordens"
import { TabelaOrdens } from "./tabela-ordens"
import { ModalCriarOrdem } from "./modal-criar-ordem"

export default function ListaOrdens() {
  const [modalAberta, setModalAberta] =
    useState(false)

  /*
   * ============================================================
   * ORDENS
   * ============================================================
   */

  const {
    ordensFiltradas,

    filtros,

    setBusca,
    setFiltroStatus,
    setFiltroData,
    setFiltroTecnico,

    limparFiltros,

    loading: loadingOrdens,
  } = useOrdens()

  /*
   * ============================================================
   * CRIAÇÃO DA ORDEM
   * ============================================================
   */

  const {
    clientes,
    tecnicos,
    equipamentos,
    servicos,
    statusList,
    prioridadesList,

    novaOrdem,
    setNovaOrdem,

    loading,
    saving,

    criarOrdem,
    criarEquipamento,

    carregarDados,
  } = useCriarOrdem()

  /*
   * ============================================================
   * CARREGAR DADOS DA MODAL
   * ============================================================
   */

  useEffect(() => {
    if (!modalAberta) {
      return
    }

    carregarDados()
  }, [
    modalAberta,
    carregarDados,
  ])

  return (
    <div className="space-y-6 p-6">

      {/* ======================================================
          CABEÇALHO
          ====================================================== */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Ordens de Serviço
          </h1>

          <p className="text-muted-foreground">
            Visualize e gerencie todas as suas ordens
          </p>
        </div>

        {/* ====================================================
            MODAL
            ==================================================== */}

        <ModalCriarOrdem
          open={modalAberta}
          onOpenChange={setModalAberta}

          novaOrdem={novaOrdem}
          setNovaOrdem={setNovaOrdem}

          clientes={clientes}
          tecnicos={tecnicos}
          equipamentos={equipamentos}
          servicos={servicos}
          statusList={statusList}
          prioridadesList={prioridadesList}

          loadingClientes={
            loading.clientes
          }

          loadingTecnicos={
            loading.tecnicos
          }

          loadingEquipamentos={
            loading.equipamentos
          }

          loadingServicos={
            loading.servicos
          }

          loadingStatus={
            loading.status
          }

          loadingPrioridades={
            loading.prioridades
          }

          saving={saving}

          onCriarOrdem={async () => {
            await criarOrdem()
            setModalAberta(false)
          }}

          onCriarEquipamento={
            criarEquipamento
          }
        />
      </div>

      {/* ======================================================
          FILTROS
          ====================================================== */}

      <FiltrosOrdens
        busca={filtros.busca}

        filtroStatus={
          filtros.status
        }

        filtroDataAgendamento={
          filtros.data
        }

        filtroTecnico={
          filtros.tecnico
        }

        tecnicos={tecnicos}

        onBuscaChange={
          setBusca
        }

        onStatusChange={
          setFiltroStatus
        }

        onDataChange={
          setFiltroData
        }

        onTecnicoChange={
          setFiltroTecnico
        }
      />

      {/* ======================================================
          TABELA
          ====================================================== */}

      <TabelaOrdens
        ordens={ordensFiltradas}
        loading={loadingOrdens}
        onLimparFiltros={
          limparFiltros
        }
      />

    </div>
  )
}