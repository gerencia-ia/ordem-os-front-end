'use client';

import { useState } from 'react';
import { Check, Package, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/Ui/card';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { Label } from '@/src/components/Ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/Ui/select';
import type { Material, MaterialOrdemInput } from '@/src/types/material';

interface SecaoMateriaisProps {
  materiais: Material[];
  itens: MaterialOrdemInput[];
  loading: boolean;
  onAdicionar: (item: MaterialOrdemInput) => void;
  onRemover: (indice: number) => void;
}

const formatarMoeda = (valor: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);

export function SecaoMateriais({ materiais, itens, loading, onAdicionar, onRemover }: SecaoMateriaisProps) {
  const [materialId, setMaterialId] = useState('avulso');
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const materialSelecionado = materiais.find((material) => String(material.id) === materialId);

  const selecionar = (id: string) => {
    setMaterialId(id);
    const material = materiais.find((item) => String(item.id) === id);
    setNome(material?.nome ?? '');
    setValor(material?.valor_referencia == null ? '' : String(material.valor_referencia));
  };

  const adicionar = () => {
    const valorNumerico = Number(valor);
    if (!nome.trim() || valor.trim() === '' || !Number.isFinite(valorNumerico) || valorNumerico < 0) return;
    onAdicionar({
      material_id: materialSelecionado?.id ?? null,
      nome_material: nome.trim(),
      valor: valorNumerico,
    });
    selecionar('avulso');
  };

  const total = itens.reduce((sum, item) => sum + Number(item.valor || 0), 0);

  return (
    <Card className="bg-card/40 border-border/70 py-4 gap-4">
      <CardHeader className="px-4 pb-2 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Package className="size-4 text-primary" /> Materiais
          <span className="text-xs text-muted-foreground font-normal">({itens.length} lançado(s))</span>
        </CardTitle>
        <span className="text-sm font-bold text-emerald-600">Subtotal: {formatarMoeda(total)}</span>
      </CardHeader>
      <CardContent className="px-4 flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_140px_auto] md:items-end">
          <div className="flex flex-col gap-1.5">
            <Label>Material do catálogo</Label>
            <Select value={materialId} onValueChange={selecionar} disabled={loading}>
              <SelectTrigger><SelectValue placeholder="Selecione ou lance avulso" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="avulso">Lançamento avulso</SelectItem>
                {materiais.map((material) => <SelectItem key={material.id} value={String(material.id)}>{material.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="os-material-nome">Nome do material</Label>
            <Input id="os-material-nome" value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Ex.: Tubulação de cobre" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="os-material-valor">Valor (R$)</Label>
            <Input id="os-material-valor" type="number" min="0" step="0.01" value={valor} onChange={(event) => setValor(event.target.value)} placeholder="0,00" />
          </div>
          <Button type="button" variant="outline" onClick={adicionar} disabled={!nome.trim() || valor.trim() === '' || !Number.isFinite(Number(valor)) || Number(valor) < 0} className="gap-1.5">
            <Plus className="size-4" /> Adicionar
          </Button>
        </div>
        {loading && <p className="text-xs text-muted-foreground">Carregando catálogo de materiais...</p>}
        {itens.length > 0 ? <div className="divide-y rounded-md border">
          {itens.map((item, index) => (
            <div key={`${item.material_id ?? 'avulso'}-${index}`} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <div className="flex items-center gap-2 min-w-0"><Check className="size-4 shrink-0 text-primary" /><span className="truncate text-sm">{item.nome_material}</span>{item.material_id && <span className="text-[10px] text-muted-foreground">Catálogo</span>}</div>
              <div className="flex items-center gap-2"><span className="text-sm font-medium">{formatarMoeda(Number(item.valor))}</span><Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => onRemover(index)} aria-label={`Remover ${item.nome_material}`}><Trash2 className="size-4" /></Button></div>
            </div>
          ))}
        </div> : <p className="text-xs text-muted-foreground">Você pode selecionar um material cadastrado ou lançar qualquer material avulso.</p>}
      </CardContent>
    </Card>
  );
}
