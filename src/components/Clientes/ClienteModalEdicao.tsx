'use client';

import { useEffect, useState } from 'react';
import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Button } from '@/src/components/Ui/button';
import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Spinner } from '@/src/components/Ui/spinner';
import { useClienteForm } from '@/src/hooks/useClienteForm';
import {
  deleteEquipamento,
  getEquipamentosByCliente,
} from '@/src/services/equipamentos.service';
import type { Cliente } from '@/src/types/cliente';
import type { Equipamento } from '@/src/types/equipamento';
import { toast } from 'sonner';
import { ClienteModalCampos } from './ClienteModalCampos';
import { ClienteEquipamentosLista } from './ClienteEquipamentosLista';
import {
  EquipamentoModalCliente,
  type EquipamentoEdicaoInput,
} from './EquipamentoModalCliente';
import { EquipamentoModalExcluir } from './EquipamentoModalExcluir';
import { Cpu, Plus } from 'lucide-react';

interface ClienteModalEdicaoProps {
  cliente: Cliente | null;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}

function ClienteModalEdicaoForm({
  cliente,
  onOpenChange,
  onSucesso,
}: {
  cliente: Cliente;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}) {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [loadingEquipamentos, setLoadingEquipamentos] = useState(true);
  const [versaoEquipamentos, setVersaoEquipamentos] = useState(0);
  const [modalEquipAberto, setModalEquipAberto] = useState(false);
  const [equipamentoEditando, setEquipamentoEditando] =
    useState<EquipamentoEdicaoInput | null>(null);
  const [equipamentoExcluindo, setEquipamentoExcluindo] =
    useState<Equipamento | null>(null);
  const [excluindoEquipamento, setExcluindoEquipamento] = useState(false);

  const {
    form,
    telefonesFieldArray,
    enderecosFieldArray,
    salvando,
    buscandoCep,
    consultarCep,
    removerTelefone,
    removerEndereco,
    onSubmit,
  } = useClienteForm({
    clienteParaEdicao: cliente,
    onSuccess: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  useEffect(() => {
    let ativo = true;

    async function carregarEquipamentos() {
      try {
        const lista = await getEquipamentosByCliente(cliente.id);
        if (ativo) {
          setEquipamentos(lista);
        }
      } catch {
        if (ativo) {
          setEquipamentos([]);
        }
      } finally {
        if (ativo) {
          setLoadingEquipamentos(false);
        }
      }
    }

    void carregarEquipamentos();

    return () => {
      ativo = false;
    };
  }, [cliente.id, versaoEquipamentos]);

  const telefonesAtivos = telefonesFieldArray.fields
    .map((field, index) => ({
      id: field.fieldKey,
      index,
      destroy: field._destroy,
    }))
    .filter((item) => !item.destroy);

  const enderecosAtivos = enderecosFieldArray.fields
    .map((field, index) => ({
      id: field.fieldKey,
      index,
      destroy: field._destroy,
    }))
    .filter((item) => !item.destroy);

  const abrirNovoEquipamento = () => {
    setEquipamentoEditando(null);
    setModalEquipAberto(true);
  };

  const abrirEditarEquipamento = (index: number) => {
    const eq = equipamentos[index];
    if (!eq) return;
    setEquipamentoEditando({
      id: eq.id,
      marca: eq.marca,
      btus: eq.btus,
      local_instalacao: eq.local_instalacao,
      observacao: eq.observacao ?? '',
      cliente_id: eq.cliente_id ?? cliente.id,
      andar_id: eq.andar_id,
    });
    setModalEquipAberto(true);
  };

  const abrirExcluirEquipamento = (index: number) => {
    const eq = equipamentos[index];
    if (eq) setEquipamentoExcluindo(eq);
  };

  const confirmarExclusaoEquipamento = async (eq: Equipamento) => {
    try {
      setExcluindoEquipamento(true);
      await deleteEquipamento(eq.id);
      toast.success('Equipamento excluído com sucesso!');
      setEquipamentoExcluindo(null);
      setLoadingEquipamentos(true);
      setVersaoEquipamentos((v) => v + 1);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Erro ao excluir equipamento';
      toast.error(msg);
    } finally {
      setExcluindoEquipamento(false);
    }
  };

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <ModalFormularioBody className="flex flex-col gap-6">
          <ClienteModalCampos
            form={form}
            idPrefix="edit-"
            telefonesAtivos={telefonesAtivos}
            enderecosAtivos={enderecosAtivos}
            buscandoCep={buscandoCep}
            onAdicionarTelefone={() =>
              telefonesFieldArray.append({ numero: '' })
            }
            onRemoverTelefone={removerTelefone}
            onAdicionarEndereco={() =>
              enderecosFieldArray.append({
                cep: '',
                rua: '',
                numero: '',
                bairro: '',
                complemento: '',
                cidade: '',
              })
            }
            onRemoverEndereco={removerEndereco}
            onConsultarCep={consultarCep}
          />

          <CardColapsavel
            titulo="Equipamentos Vinculados"
            icone={<Cpu className="size-4 text-primary" />}
            resumo={
              loadingEquipamentos
                ? 'Carregando...'
                : `${equipamentos.length} equipamento(s)`
            }
            defaultOpenMobile={false}
            headerAction={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={abrirNovoEquipamento}
                className="h-7 gap-1 text-xs"
              >
                <Plus className="size-3.5" /> Adicionar
                <span className="hidden sm:inline">Equipamento</span>
              </Button>
            }
            className="bg-card/40 border-border/70"
            contentClassName="flex flex-col gap-2.5"
          >
            <ClienteEquipamentosLista
              itens={equipamentos}
              loading={loadingEquipamentos}
              excluindoId={
                excluindoEquipamento ? (equipamentoExcluindo?.id ?? null) : null
              }
              onEditar={abrirEditarEquipamento}
              onExcluir={abrirExcluirEquipamento}
            />
          </CardColapsavel>
        </ModalFormularioBody>

        <ModalFormularioFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={salvando}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando}>
            {salvando && <Spinner data-icon="inline-start" />}
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </ModalFormularioFooter>
      </form>

      <EquipamentoModalCliente
        open={modalEquipAberto}
        setOpen={(abertoModal) => {
          setModalEquipAberto(abertoModal);
          if (!abertoModal) setEquipamentoEditando(null);
        }}
        clienteId={cliente.id}
        equipamentoParaEdicao={equipamentoEditando}
        onSucesso={() => {
          setLoadingEquipamentos(true);
          setVersaoEquipamentos((v) => v + 1);
        }}
      />

      <EquipamentoModalExcluir
        equipamento={equipamentoExcluindo}
        aberto={Boolean(equipamentoExcluindo)}
        onOpenChange={(abertoModal) => {
          if (!abertoModal) setEquipamentoExcluindo(null);
        }}
        onConfirmar={confirmarExclusaoEquipamento}
        excluindo={excluindoEquipamento}
      />
    </>
  );
}

export function ClienteModalEdicao({
  cliente,
  aberto,
  onOpenChange,
  onSucesso,
}: ClienteModalEdicaoProps) {
  if (!cliente) return null;

  return (
    <ModalFormulario open={aberto} onOpenChange={onOpenChange} tamanho="lg">
      <ModalFormularioHeader
        title={`Editar Cliente: ${cliente.nome}`}
        description="Atualize os dados cadastrais, telefones, endereços ou equipamentos do cliente."
      />

      <ClienteModalEdicaoForm
        key={cliente.id}
        cliente={cliente}
        onOpenChange={onOpenChange}
        onSucesso={onSucesso}
      />
    </ModalFormulario>
  );
}
