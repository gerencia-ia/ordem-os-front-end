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
  users: Usuario[];
  loading: boolean;
  onEditar: (user: Usuario) => void;
  onExcluir: (user: Usuario) => void;
}

export function UsuarioTabela({
  users,
  loading,
  onEditar,
  onExcluir,
}: UsuarioTabelaProps) {
  const { isSecretaria } = usePermissions();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-3" />
        <p className="text-sm text-muted-foreground">Carregando usuários...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-card/50">
        <UserIcon className="h-10 w-10 text-muted-foreground mb-3" />
        <h3 className="font-semibold text-foreground">
          Nenhum usuário encontrado
        </h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Nenhum resultado corresponde à sua busca ou não há usuários
          cadastrados.
        </p>
      </div>
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
          {users.map((user) => {
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
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEditar(user)}
                        title="Editar usuário"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onExcluir(user)}
                        title="Excluir usuário"
                      >
                        <Trash2 className="h-4 w-4" />
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
export default UsuarioTabela;
