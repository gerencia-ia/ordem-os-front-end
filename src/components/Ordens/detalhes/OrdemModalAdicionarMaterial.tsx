'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/src/components/Ui/dialog';
import { Button } from '@/src/components/Ui/button';
import { Input } from '@/src/components/Ui/input';
import { Label } from '@/src/components/Ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/Ui/select';
import type { Material } from '@/src/types/material';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materiais: Material[];
  loading: boolean;
  materialId: string;
  nome: string;
  valor: string;
  onMaterialIdChange: (value: string) => void;
  onNomeChange: (value: string) => void;
  onValorChange: (value: string) => void;
  onSalvar: () => void;
  salvando: boolean;
}

export function OrdemModalAdicionarMaterial({ open, onOpenChange, materiais, loading, materialId, nome, valor, onMaterialIdChange, onNomeChange, onValorChange, onSalvar, salvando }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Lançar material na OS</DialogTitle>
          <DialogDescription>Selecione um item do catálogo ou informe um material avulso. O valor vale para esta ordem.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Material cadastrado</Label>
            <Select value={materialId} onValueChange={onMaterialIdChange} disabled={loading || salvando}>
              <SelectTrigger><SelectValue placeholder="Lançamento avulso" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="avulso">Lançamento avulso</SelectItem>
                {materiais.map((material) => <SelectItem key={material.id} value={String(material.id)}>{material.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="material-os-nome">Nome</Label><Input id="material-os-nome" value={nome} onChange={(event) => onNomeChange(event.target.value)} placeholder="Nome do material" disabled={salvando} /></div>
          <div className="flex flex-col gap-1.5"><Label htmlFor="material-os-valor">Valor lançado (R$)</Label><Input id="material-os-valor" type="number" min="0" step="0.01" value={valor} onChange={(event) => onValorChange(event.target.value)} placeholder="0,00" disabled={salvando} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={salvando}>Cancelar</Button>
          <Button onClick={onSalvar} disabled={!nome.trim() || valor.trim() === '' || !Number.isFinite(Number(valor)) || Number(valor) < 0 || salvando || loading}>{salvando ? 'Adicionando...' : 'Adicionar material'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
