'use client';

import { useState } from 'react';
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
  EquipamentoModalCliente,
  type NovoEquipamentoData,
} from '@/src/components/Clientes/EquipamentoModalCliente';
import { ClienteModalCampos } from './ClienteModalCampos';
import { ClienteEquipamentosLista } from './ClienteEquipamentosLista';
import { Cpu, Plus } from 'lucide-react';

interface ClienteModalCadastroProps {
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onSucesso: () => void;
}

export function ClienteModalCadastro({
  aberto,
  onOpenChange,
  onSucesso,
}: ClienteModalCadastroProps) {
  const [modalEquipAberto, setModalEquipAberto] = useState(false);
  const [indiceEditando, setIndiceEditando] = useState<number | null>(null);

  const {
    form,
    telefonesFieldArray,
    enderecosFieldArray,
    equipamentos,
    salvando,
    buscandoCep,
    consultarCep,
    adicionarEquipamento,
    editarEquipamento,
    removerEquipamento,
    onSubmit,
  } = useClienteForm({
    clienteParaEdicao: null,
    onSuccess: () => {
      onOpenChange(false);
      onSucesso();
    },
  });

  const telefonesAtivos = telefonesFieldArray.fields.map((field, index) => ({
    id: field.fieldKey,
    index,
  }));

  const enderecosAtivos = enderecosFieldArray.fields.map((field, index) => ({
    id: field.fieldKey,
    index,
  }));

  const equipamentoEditando =
    indiceEditando !== null ? (equipamentos[indiceEditando] ?? null) : null;

  const abrirNovoEquipamento = () => {
    setIndiceEditando(null);
    setModalEquipAberto(true);
  };

  const abrirEditarEquipamento = (index: number) => {
    setIndiceEditando(index);
    setModalEquipAberto(true);
  };

  const handleSalvarEquipamento = (equip: NovoEquipamentoData) => {
    if (indiceEditando !== null) {
      editarEquipamento(indiceEditando, equip);
    } else {
      adicionarEquipamento(equip);
    }
    setIndiceEditando(null);
  };

  return (
    <>
      <ModalFormulario open={aberto} onOpenChange={onOpenChange} tamanho="lg">
        <ModalFormularioHeader
          title="Cadastrar Novo Cliente"
          description="Preencha os dados cadastrais, telefones e endereços do cliente."
        />

        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <ModalFormularioBody className="flex flex-col gap-6">
            <ClienteModalCampos
              form={form}
              telefonesAtivos={telefonesAtivos}
              enderecosAtivos={enderecosAtivos}
              buscandoCep={buscandoCep}
              onAdicionarTelefone={() =>
                telefonesFieldArray.append({ numero: '' })
              }
              onRemoverTelefone={(index) => telefonesFieldArray.remove(index)}
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
              onRemoverEndereco={(index) => enderecosFieldArray.remove(index)}
              onConsultarCep={consultarCep}
            />

            {/* Equipamentos em Memória (Opcional) */}
            <CardColapsavel
              titulo="Equipamentos (Opcional)"
              icone={<Cpu className="size-4 text-primary" />}
              resumo={`${equipamentos.length} equipamento(s)`}
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
              <p className="text-muted-foreground text-xs">
                Vincule aparelhos a este cliente agora mesmo.
              </p>

              <ClienteEquipamentosLista
                itens={equipamentos}
                emptyMessage="Nenhum equipamento adicionado até o momento."
                onEditar={abrirEditarEquipamento}
                onExcluir={removerEquipamento}
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
              {salvando ? 'Cadastrando...' : 'Cadastrar Cliente'}
            </Button>
          </ModalFormularioFooter>
        </form>
      </ModalFormulario>

      <EquipamentoModalCliente
        open={modalEquipAberto}
        setOpen={(abertoModal) => {
          setModalEquipAberto(abertoModal);
          if (!abertoModal) setIndiceEditando(null);
        }}
        equipamentoParaEdicao={equipamentoEditando}
        onSalvarEquipamento={handleSalvarEquipamento}
      />
    </>
  );
}
