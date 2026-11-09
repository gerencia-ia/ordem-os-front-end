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
import type { Usuario } from '@/src/types/usuario';
import { usePermissions } from '@/src/hooks/usePermissions';
import { formatarCpf } from '@/src/utils/cpf';
import { formatarTelefone } from '@/src/utils/phone';
import { gerarLinkWhatsApp } from '@/src/utils/whatsapp';
import {
  Edit,
  MessageCircle,
  Phone,
  Trash2,
  User as UserIcon,
} from 'lucide-react';

interface UsuarioTabelaProps {
  usuarios: Usuario[];
  loading: boolean;
  onEditar: (usuario: Usuario) => void;
  onExcluir: (usuario: Usuario) => void;
}

export function UsuarioTabela({
  usuarios,
  loading,
  onEditar,
  onExcluir,
}: UsuarioTabelaProps) {
  const { isSecretaria } = usePermissions();

  if (loading) {
    return (
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[260px]">Usuário</TableHead>
              <TableHead className="w-[140px]">Função</TableHead>
              <TableHead className="w-[160px]">CPF</TableHead>
              <TableHead className="w-[180px]">Telefone</TableHead>
              <TableHead className="w-[120px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
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

  if (usuarios.length === 0) {
    return (
      <Empty className="border rounded-lg bg-card/40 my-4">
        <EmptyMedia variant="icon">
          <UserIcon className="size-5 text-muted-foreground" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Nenhum usuário encontrado</EmptyTitle>
          <EmptyDescription>
            Nenhum resultado corresponde à sua busca ou não há usuários cadastrados.
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
            <TableHead className="w-[260px]">Usuário</TableHead>
            <TableHead className="w-[180px]">CPF</TableHead>
            <TableHead className="w-[200px]">Telefone</TableHead>
            <TableHead className="w-[160px]">Função</TableHead>
            <TableHead className="w-[120px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.map((user) => {
            const roleNome = (user.role?.nome || '').toLowerCase();
            const podeGerenciarLinha =
              !isSecretaria || roleNome === 'técnico' || roleNome === 'tecnico';

            return (
              <TableRow key={user.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {user.nome}
                    </span>
                    {user.email ? (
                      <span className="text-xs text-muted-foreground truncate max-w-[220px]">
                        {user.email}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/60 italic">
                        Sem email
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell className="text-xs font-mono">
                  {formatarCpf(user.cpf)}
                </TableCell>

                <TableCell>
                  {user.telefone ? (
                    <div className="flex items-center gap-1.5 text-xs">
                      <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span>{formatarTelefone(user.telefone)}</span>
                      <a
                        href={gerarLinkWhatsApp(user.telefone, user.nome)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-500 hover:text-emerald-600 transition-colors p-0.5"
                        title="Conversar no WhatsApp"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/60 italic">
                      Sem telefone
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  {user.role?.nome ? (
                    <Badge
                      variant="secondary"
                      className="capitalize text-xs font-normal"
                    >
                      {user.role.nome}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground/60 italic">
                      Não definida
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-right">
                  {podeGerenciarLinha ? (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEditar(user)}
                        aria-label={`Editar usuário ${user.nome}`}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onExcluir(user)}
                        aria-label={`Excluir usuário ${user.nome}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/50 italic pr-2">
                      Acesso restrito
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
