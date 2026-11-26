'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@/src/lib/zod-resolver';
import {
  clienteFormSchema,
  type ClienteFormData,
  type Cliente,
  type NovoClientePayload,
  type AtualizarClientePayload,
  type NovoEquipamentoData,
} from '@/src/types/cliente';
import { buscarEnderecoPorCep } from '@/src/utils/viacep';
import { createCliente, updateCliente } from '@/src/services/clientes.service';
import { toast } from 'sonner';

interface UseClienteFormProps {
  clienteParaEdicao?: Cliente | null;
  onSuccess?: (cliente?: Cliente) => void;
}

export function useClienteForm({
  clienteParaEdicao,
  onSuccess,
}: UseClienteFormProps = {}) {
  const [salvando, setSalvando] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState<number | null>(null);
  const [equipamentos, setEquipamentos] = useState<NovoEquipamentoData[]>([]);

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteFormSchema),
    defaultValues: clienteParaEdicao
      ? {
          nome: clienteParaEdicao.nome,
          email: clienteParaEdicao.email || '',
          data_ultima_visita: clienteParaEdicao.data_ultima_visita || '',
          telefones: clienteParaEdicao.telefones?.length
            ? clienteParaEdicao.telefones.map((t) => ({
                id: t.id,
                numero: t.numero,
                _destroy: false,
              }))
            : [{ numero: '' }],
          enderecos: clienteParaEdicao.enderecos?.length
            ? clienteParaEdicao.enderecos.map((e) => ({
                id: e.id,
                cep: e.cep || '',
                rua: e.rua,
                numero: e.numero,
                bairro: e.bairro,
                complemento: e.complemento || '',
                cidade: e.cidade,
                _destroy: false,
              }))
            : [
                {
                  cep: '',
                  rua: '',
                  numero: '',
                  bairro: '',
                  complemento: '',
                  cidade: '',
                },
              ],
        }
      : {
          nome: '',
          email: '',
          data_ultima_visita: '',
          telefones: [{ numero: '' }],
          enderecos: [
            {
              cep: '',
              rua: '',
              numero: '',
              bairro: '',
              complemento: '',
              cidade: '',
            },
          ],
        },
  });

  const telefonesFieldArray = useFieldArray({
    control: form.control,
    name: 'telefones',
    keyName: 'fieldKey',
  });

  const enderecosFieldArray = useFieldArray({
    control: form.control,
    name: 'enderecos',
    keyName: 'fieldKey',
  });

  const consultarCep = async (index: number) => {
    const cep = form.getValues(`enderecos.${index}.cep`);
    if (!cep || cep.replace(/\D/g, '').length < 8) return;

    setBuscandoCep(index);
    const endereco = await buscarEnderecoPorCep(cep);
    setBuscandoCep(null);

    if (endereco) {
      if (endereco.logradouro) {
        form.setValue(`enderecos.${index}.rua`, endereco.logradouro);
      }
      if (endereco.bairro) {
        form.setValue(`enderecos.${index}.bairro`, endereco.bairro);
      }
      if (endereco.localidade) {
        form.setValue(`enderecos.${index}.cidade`, endereco.localidade);
      }
      if (endereco.complemento) {
        form.setValue(`enderecos.${index}.complemento`, endereco.complemento);
      }
      // Limpar erros prévios de campos preenchidos automaticamente
      form.clearErrors([
        `enderecos.${index}.rua`,
        `enderecos.${index}.bairro`,
        `enderecos.${index}.cidade`,
      ]);
      toast.success('Endereço encontrado pelo CEP!');
    } else {
      toast.error('CEP não encontrado ou inválido.');
    }
  };

  const removerTelefone = (index: number) => {
    const item = form.getValues(`telefones.${index}`);
    if (item?.id) {
      telefonesFieldArray.update(index, { ...item, _destroy: true });
    } else {
      telefonesFieldArray.remove(index);
    }
  };

  const removerEndereco = (index: number) => {
    const item = form.getValues(`enderecos.${index}`);
    if (item?.id) {
      enderecosFieldArray.update(index, { ...item, _destroy: true });
    } else {
      enderecosFieldArray.remove(index);
    }
  };

  const adicionarEquipamento = (equip: NovoEquipamentoData) => {
    setEquipamentos((prev) => [...prev, equip]);
  };

  const editarEquipamento = (index: number, equip: NovoEquipamentoData) => {
    setEquipamentos((prev) =>
      prev.map((item, i) => (i === index ? equip : item)),
    );
  };

  const removerEquipamento = (index: number) => {
    setEquipamentos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ClienteFormData) => {
    try {
      setSalvando(true);

      let clienteSalvo: Cliente | undefined;

      if (clienteParaEdicao) {
        const payload: AtualizarClientePayload = {
          nome: data.nome,
          email: data.email || null,
          data_ultima_visita: data.data_ultima_visita || null,
          telefones_attributes: data.telefones
            .filter((t) => t.id || t.numero.trim())
            .map((t) => ({
              id: t.id,
              numero: t.numero,
              _destroy: t._destroy,
            })),
          enderecos_attributes: data.enderecos
            .filter((e) => e.id || e.rua.trim())
            .map((e) => ({
              id: e.id,
              cep: e.cep,
              rua: e.rua,
              numero: e.numero,
              bairro: e.bairro,
              complemento: e.complemento,
              cidade: e.cidade,
              _destroy: e._destroy,
            })),
        };

        clienteSalvo = await updateCliente(clienteParaEdicao.id, payload);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        const payload: NovoClientePayload = {
          nome: data.nome,
          email: data.email || null,
          data_ultima_visita: data.data_ultima_visita || null,
          telefones_attributes: data.telefones
            .filter((t) => t.numero.trim())
            .map((t) => ({ numero: t.numero })),
          enderecos_attributes: data.enderecos
            .filter((e) => e.rua.trim())
            .map((e) => ({
              cep: e.cep,
              rua: e.rua,
              numero: e.numero,
              bairro: e.bairro,
              complemento: e.complemento,
              cidade: e.cidade,
            })),
          equipamentos_attributes: equipamentos.length
            ? equipamentos.map((eq) => ({
                marca: eq.marca,
                btus: eq.btus,
                local_instalacao: eq.local_instalacao,
                observacao: eq.observacao,
                andar_id: eq.andar_id,
              }))
            : undefined,
        };

        clienteSalvo = await createCliente(payload);
        toast.success('Cliente cadastrado com sucesso!');
      }

      form.reset();
      setEquipamentos([]);
      onSuccess?.(clienteSalvo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar cliente';
      toast.error(msg);
    } finally {
      setSalvando(false);
    }
  };

  return {
    form,
    telefonesFieldArray,
    enderecosFieldArray,
    equipamentos,
    salvando,
    buscandoCep,
    consultarCep,
    removerTelefone,
    removerEndereco,
    adicionarEquipamento,
    editarEquipamento,
    removerEquipamento,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
