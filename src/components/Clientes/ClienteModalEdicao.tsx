'use client';

import { useEffect, useState } from 'react';
import {
  ModalFormulario,
  ModalFormularioBody,
  ModalFormularioFooter,
  ModalFormularioHeader,
} from '@/src/components/Ui/modal-formulario';
import { Button } from '@/src/components/Ui/button';
import { Badge } from '@/src/components/Ui/badge';
import { CardColapsavel } from '@/src/components/Ui/card-colapsavel';
import { Skeleton } from '@/src/components/Ui/skeleton';
import { Spinner } from '@/src/components/Ui/spinner';
import { useClienteForm } from '@/src/hooks/useClienteForm';
import { getEquipamentosByCliente } from '@/src/services/equipamentos.service';
import type { Cliente } from '@/src/types/cliente';
import type { Equipamento } from '@/src/types/equipamento';
import { ClienteModalCampos } from './ClienteModalCampos';
import { EquipamentoModalCliente } from './EquipamentoModalCliente';
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
                onClick={() => setModalEquipAberto(true)}
                className="h-7 gap-1 text-xs"
              >
                <Plus className="size-3.5" /> Adicionar
                <span className="hidden sm:inline">Equipamento</span>
              </Button>
            }
            className="bg-card/40 border-border/70"
            contentClassName="flex flex-col gap-2.5"
          >
            {loadingEquipamentos ? (
              <Skeleton className="h-10 w-full" />
            ) : equipamentos.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {equipamentos.map((eq) => (
                  <Badge
                    key={eq.id}
                    variant="secondary"
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-normal"
                  >
                    <span className="font-medium">{eq.marca}</span>
                    <span>• {eq.btus} BTUs</span>
                    <span className="text-muted-foreground">
                      ({eq.local_instalacao}
                      {eq.andar?.descricao ? ` — ${eq.andar.descricao}` : ''})
                    </span>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground/70 text-xs italic">
                Nenhum equipamento vinculado a este cliente.
              </p>
            )}
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
        setOpen={setModalEquipAberto}
        clienteId={cliente.id}
        onSucesso={() => {
          setLoadingEquipamentos(true);
          setVersaoEquipamentos((v) => v + 1);
        }}
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
