'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { User, Phone, MapPin, MessageCircle } from 'lucide-react';
import type { Cliente } from '@/src/types/cliente';
import type { Endereco } from '@/src/types/endereco';
import { formatadores } from '@/src/lib/utilitarios';

interface DetalheClienteProps {
  cliente: Cliente | null;
  endereco?: Endereco | null;
  onContatarWhatsApp: () => void;
}

export function DetalheCliente({
  cliente,
  endereco,
  onContatarWhatsApp,
}: DetalheClienteProps) {
  const telefone = cliente?.telefones?.find(() => true)?.numero;
  const enderecoPrincipal = endereco || cliente?.enderecos?.[0];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-muted-foreground" />
          Cliente
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <span className="text-xs text-muted-foreground block">Nome</span>
            <p className="font-semibold text-sm">
              {cliente?.nome || 'Não informado'}
            </p>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block">
              Telefone
            </span>
            <p className="font-medium text-sm flex items-center gap-1.5 mt-0.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              {telefone ? formatadores.telefone(telefone) : '—'}
            </p>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block">
              Endereço do Atendimento
            </span>
            <p className="font-medium text-sm flex items-start gap-1.5 mt-0.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <span>
                {enderecoPrincipal
                  ? `${enderecoPrincipal.rua}, ${enderecoPrincipal.numero}${
                      enderecoPrincipal.complemento
                        ? ` (${enderecoPrincipal.complemento})`
                        : ''
                    } - ${enderecoPrincipal.bairro}${
                      enderecoPrincipal.cidade
                        ? `, ${enderecoPrincipal.cidade}`
                        : ''
                    }`
                  : '—'}
              </span>
            </p>
          </div>
        </div>

        <Button
          type="button"
          className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={onContatarWhatsApp}
          disabled={!telefone}
        >
          <MessageCircle className="h-4 w-4" />
          Contatar via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}
