'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { Label } from '@/src/components/Ui/label';
import { Textarea } from '@/src/components/Ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/Ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/src/components/Ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/Ui/table';
import type { Material, MaterialPayload } from '@/src/types/material';
import { createMaterial, deleteMaterial, getMateriais, updateMaterial } from '@/src/services/materiais.service';

const moeda = (valor: number | string | null) => valor == null || valor === ''
  ? '—'
  : Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function MateriaisLista() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [materialEditando, setMaterialEditando] = useState<Material | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({ nome: '', descricao: '', valor_referencia: '' });

  const carregar = useCallback(async () => {
    try {
      setMateriais(await getMateriais());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível carregar os materiais.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void carregar(); }, [carregar]);

  const abrirCadastro = (material?: Material) => {
    setMaterialEditando(material ?? null);
    setForm(material ? {
      nome: material.nome,
      descricao: material.descricao ?? '',
      valor_referencia: material.valor_referencia == null ? '' : String(material.valor_referencia),
    } : { nome: '', descricao: '', valor_referencia: '' });
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
      valor_referencia: form.valor_referencia === '' ? null : Number(form.valor_referencia),
    };
    if (payload.valor_referencia != null && (!Number.isFinite(payload.valor_referencia) || payload.valor_referencia < 0)) {
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
      await carregar();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível salvar o material.');
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (material: Material) => {
    if (!window.confirm(`Excluir o material "${material.nome}" do catálogo? Os lançamentos existentes na OS serão mantidos.`)) return;
    try {
      await deleteMaterial(material.id);
      toast.success('Material removido do catálogo.');
      await carregar();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Não foi possível excluir o material.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold"><Package className="size-6 text-primary" /> Cadastro de Materiais</h1>
          <p className="mt-1 text-sm text-muted-foreground">Cadastre materiais de referência. O valor pode ser ajustado em cada ordem de serviço.</p>
        </div>
        <Button onClick={() => abrirCadastro()} className="gap-2"><Plus className="size-4" /> Novo material</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Materiais cadastrados ({materiais.length})</CardTitle></CardHeader>
        <CardContent>
          {loading ? <p className="py-8 text-center text-sm text-muted-foreground">Carregando materiais...</p> : materiais.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Nenhum material cadastrado.</p> : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader><TableRow><TableHead>Material</TableHead><TableHead>Descrição</TableHead><TableHead>Valor de referência</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
                <TableBody>{materiais.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.nome}</TableCell>
                    <TableCell>{material.descricao || '—'}</TableCell>
                    <TableCell>{moeda(material.valor_referencia)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => abrirCadastro(material)} aria-label={`Editar ${material.nome}`}><Pencil className="size-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => void excluir(material)} aria-label={`Excluir ${material.nome}`}><Trash2 className="size-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}</TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{materialEditando ? 'Editar material' : 'Novo material'}</DialogTitle>
            <DialogDescription>O valor cadastrado serve como referência e pode ser alterado na ordem de serviço.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5"><Label htmlFor="material-nome">Nome *</Label><Input id="material-nome" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} placeholder="Ex.: Cabo de cobre" /></div>
            <div className="flex flex-col gap-1.5"><Label htmlFor="material-valor">Valor de referência (R$)</Label><Input id="material-valor" type="number" min="0" step="0.01" value={form.valor_referencia} onChange={(e) => setForm((f) => ({ ...f, valor_referencia: e.target.value }))} placeholder="Opcional" /></div>
            <div className="flex flex-col gap-1.5"><Label htmlFor="material-descricao">Descrição (opcional)</Label><Textarea id="material-descricao" value={form.descricao} onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))} rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)} disabled={salvando}>Cancelar</Button>
            <Button onClick={() => void salvar()} disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar material'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
