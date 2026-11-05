'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Settings, Bell, Lock, Palette } from 'lucide-react';

export default function PaginaConfiguracoes() {
  const opcoes = [
    {
      titulo: 'Notificações',
      descricao: 'Gerencie suas preferências de notificações',
      icon: Bell,
    },
    {
      titulo: 'Segurança',
      descricao: 'Senhas, autenticação e permissões',
      icon: Lock,
    },
    {
      titulo: 'Aparência',
      descricao: 'Tema, cores e modo escuro',
      icon: Palette,
    },
    {
      titulo: 'Sistema',
      descricao: 'Configurações gerais do sistema',
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Personalize sua experiência no OSControl
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opcoes.map((opcao) => {
          const Icon = opcao.icon;
          return (
            <Card
              key={opcao.titulo}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className="h-6 w-6 text-primary mt-1" />
                    <div>
                      <CardTitle className="text-lg">{opcao.titulo}</CardTitle>
                      <CardDescription>{opcao.descricao}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Configurar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
