'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/src/components/Ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/Ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/Ui/table';
import type { Material, MaterialPayload } from '@/src/types/material';
import {
  createMaterial,
  deleteMaterial,
  getMateriais,
  updateMaterial,
} from '@/src/services/materiais.service';
import { MaterialModalForm } from './MaterialModalForm';
import { MaterialModalExcluir } from './MaterialModalExcluir';

const moeda = (valor: number | string | null) =>
  valor == null || valor === ''
    ? '—'
    : Number(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

export function MateriaisLista() {
  const [materiais, setMateriais] = useState<Material[]>([]);
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

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Package className="size-6 text-primary" /> Cadastro de Materiais
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cadastre materiais de referência. O valor pode ser ajustado em cada
            ordem de serviço.
          </p>
        </div>
        <Button onClick={() => abrirCadastro()} className="gap-2">
          <Plus className="size-4" /> Novo material
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Materiais cadastrados ({materiais.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Carregando materiais...
            </p>
          ) : materiais.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum material cadastrado.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Valor de referência</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materiais.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.nome}
                      </TableCell>
                      <TableCell>{material.descricao || '—'}</TableCell>
                      <TableCell>{moeda(material.valor_referencia)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirCadastro(material)}
                          aria-label={`Editar ${material.nome}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setMaterialExcluindo(material)}
                          aria-label={`Excluir ${material.nome}`}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
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
