'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/src/components/Ui/button';
import { Card, CardContent, CardHeader } from '@/src/components/Ui/card';
import type { Material, MaterialPayload } from '@/src/types/material';
import {
  createMaterial,
  deleteMaterial,
  getMateriais,
  updateMaterial,
} from '@/src/services/materiais.service';
import { MaterialModalForm } from './MaterialModalForm';
import { MaterialModalExcluir } from './MaterialModalExcluir';
import { MaterialFiltros } from './MaterialFiltros';
import { MaterialTabela } from './MaterialTabela';

export function MateriaisLista() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [versao, setVersao] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [materialEditando, setMaterialEditando] = useState<Material | null>(
    null,
  );
  const [materialExcluindo, setMaterialExcluindo] = useState<Material | null>(
    null,
  );
  const [excluindo, setExcluindo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    valor_referencia: '',
  });

  const recarregar = useCallback(() => {
    setVersao((v) => v + 1);
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const dados = await getMateriais();
        if (ativo) {
          setMateriais(dados);
        }
      } catch (error) {
        if (ativo) {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar os materiais.',
          );
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    void carregar();

    return () => {
      ativo = false;
    };
  }, [versao]);

  const abrirCadastro = (material?: Material) => {
    setMaterialEditando(material ?? null);
    setForm(
      material
        ? {
            nome: material.nome,
            descricao: material.descricao ?? '',
            valor_referencia:
              material.valor_referencia == null
                ? ''
                : String(material.valor_referencia),
          }
        : { nome: '', descricao: '', valor_referencia: '' },
    );
    setModalAberto(true);
  };

  const salvar = async () => {
    if (!form.nome.trim()) {
      toast.error('Informe o nome do material.');
      return;
    }
    const payload: MaterialPayload = {
      nome: form.nome.trim(),
      descricao: form.descricao.trim() || null,
      valor_referencia:
        form.valor_referencia === '' ? null : Number(form.valor_referencia),
    };
    if (
      payload.valor_referencia != null &&
      (!Number.isFinite(payload.valor_referencia) ||
        payload.valor_referencia < 0)
    ) {
      toast.error('Informe um valor de referência válido.');
      return;
    }
    setSalvando(true);
    try {
      if (materialEditando) {
        await updateMaterial(materialEditando.id, payload);
        toast.success('Material atualizado.');
      } else {
        await createMaterial(payload);
        toast.success('Material cadastrado.');
      }
      setModalAberto(false);
      recarregar();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o material.',
      );
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = async (material: Material) => {
    setExcluindo(true);
    try {
      await deleteMaterial(material.id);
      toast.success('Material removido do catálogo.');
      setMaterialExcluindo(null);
      recarregar();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível excluir o material.',
      );
    } finally {
      setExcluindo(false);
    }
  };

  const materiaisFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return materiais;
    return materiais.filter(
      (m) =>
        m.nome.toLowerCase().includes(termo) ||
        (m.descricao ?? '').toLowerCase().includes(termo),
    );
  }, [materiais, busca]);

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Materiais</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Cadastre materiais de referência. O valor pode ser ajustado em cada
            ordem de serviço.
          </p>
        </div>

        <Button onClick={() => abrirCadastro()} className="gap-1.5 shadow-sm">
          <Plus className="size-4" /> Novo Material
        </Button>
      </div>

      {/* Card Principal com Filtros e Tabela */}
      <Card className="shadow-sm border-border/60">
        <CardHeader className="pb-4">
          <MaterialFiltros
            busca={busca}
            onBuscaChange={setBusca}
            totalMateriais={materiaisFiltrados.length}
          />
        </CardHeader>
        <CardContent>
          <MaterialTabela
            materiais={materiaisFiltrados}
            loading={loading}
            onEditar={abrirCadastro}
            onExcluir={setMaterialExcluindo}
          />
        </CardContent>
      </Card>

      <MaterialModalForm
        open={modalAberto}
        onOpenChange={setModalAberto}
        materialEditando={materialEditando}
        form={form}
        onFormChange={setForm}
        onSalvar={salvar}
        salvando={salvando}
      />

      <MaterialModalExcluir
        material={materialExcluindo}
        aberto={Boolean(materialExcluindo)}
        onOpenChange={(open) => {
          if (!open) setMaterialExcluindo(null);
        }}
        onConfirmar={confirmarExclusao}
        excluindo={excluindo}
      />
    </div>
  );
}
