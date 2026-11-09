'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/Ui/table';
import { Button } from '@/src/components/Ui/button';
import { Badge } from '@/src/components/Ui/badge';
import { Skeleton } from '@/src/components/Ui/skeleton';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/src/components/Ui/empty';
import type { Cliente } from '@/src/types/cliente';
import { formatarTelefone } from '@/src/utils/phone';
import { gerarLinkWhatsApp } from '@/src/utils/whatsapp';
import {
  Calendar,
  Edit,
  MapPin,
  MessageCircle,
  Phone,
  Trash2,
  User,
} from 'lucide-react';

interface ClienteTabelaProps {
  clientes: Cliente[];
  loading: boolean;
  onEditar: (cliente: Cliente) => void;
  onExcluir: (cliente: Cliente) => void;
}

export function ClienteTabela({
  clientes,
  loading,
  onEditar,
  onExcluir,
}: ClienteTabelaProps) {
  if (loading) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[280px]">Cliente</TableHead>
              <TableHead className="w-[220px]">Telefones</TableHead>
              <TableHead>Endereço Principal</TableHead>
              <TableHead className="w-[160px]">Última Visita</TableHead>
              <TableHead className="w-[120px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Skeleton className="size-8 rounded-md" />
                    <Skeleton className="size-8 rounded-md" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <Empty className="border rounded-lg bg-card/40 my-4">
        <EmptyMedia variant="icon">
          <User className="size-5 text-muted-foreground" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Nenhum cliente encontrado</EmptyTitle>
          <EmptyDescription>
            Nenhum resultado corresponde à sua busca ou não há clientes cadastrados no sistema.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[280px]">Cliente</TableHead>
            <TableHead className="w-[220px]">Telefones</TableHead>
            <TableHead>Endereço Principal</TableHead>
            <TableHead className="w-[160px]">Última Visita</TableHead>
            <TableHead className="w-[120px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => {
            const telefonesAtivos = cliente.telefones?.filter(
              (t) => !t._destroy,
            );
            const enderecosAtivos = cliente.enderecos?.filter(
              (e) => !e._destroy,
            );
            const enderecoPrincipal = enderecosAtivos?.[0];

            return (
              <TableRow key={cliente.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {cliente.nome}
                    </span>
                    {cliente.email ? (
                      <span className="text-xs text-muted-foreground truncate max-w-[240px]">
                        {cliente.email}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/60 italic">
                        Sem email cadastrado
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1">
                    {telefonesAtivos && telefonesAtivos.length > 0 ? (
                      telefonesAtivos.map((tel, idx) => (
                        <div
                          key={tel.id || idx}
                          className="flex items-center gap-1.5 text-xs"
                        >
                          <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span>{formatarTelefone(tel.numero)}</span>
                          <a
                            href={gerarLinkWhatsApp(tel.numero, cliente.nome)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-500 hover:text-emerald-600 transition-colors p-0.5"
                            title="Conversar no WhatsApp"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground/60 italic">
                        Sem telefone
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  {enderecoPrincipal ? (
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                      <div>
                        <span>
                          {enderecoPrincipal.rua}, {enderecoPrincipal.numero}
                        </span>
                        {enderecoPrincipal.bairro && (
                          <span className="block text-[11px] text-muted-foreground/80">
                            {enderecoPrincipal.bairro} -{' '}
                            {enderecoPrincipal.cidade}
                          </span>
                        )}
                        {enderecosAtivos.length > 1 && (
                          <Badge
                            variant="outline"
                            className="text-[10px] mt-0.5 h-4 px-1"
                          >
                            +{enderecosAtivos.length - 1} endereço(s)
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/60 italic">
                      Sem endereço
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  {cliente.data_ultima_visita ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span>
                        {new Date(
                          cliente.data_ultima_visita,
                        ).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-normal"
                    >
                      Nunca visitado
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEditar(cliente)}
                      title="Editar cliente"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onExcluir(cliente)}
                      title="Excluir cliente"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
