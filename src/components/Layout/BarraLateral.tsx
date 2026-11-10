'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Kanban,
  List,
  Users,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/src/components/Ui/button';
import { cn } from '@/src/lib/utils';
import { usePermissions } from '@/src/hooks/usePermissions';

interface BarraLateralProps {
  estaAberta: boolean;
  aoFechar: () => void;
}

type SubmenuItem = {
  href: string;
  label: string;
};

type MenuItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  children?: SubmenuItem[];
};

export function BarraLateral({ estaAberta, aoFechar }: BarraLateralProps) {
  const pathname = usePathname();
  const { podeAcessar } = usePermissions();

  const todosMenus: MenuItem[] = [
    {
      href: '/painel',
      label: 'Painel',
      icon: Home,
    },
    {
      href: '/kanban',
      label: 'Quadro Kanban',
      icon: Kanban,
    },
    {
      href: '/ordens',
      label: 'Ordens de Serviço',
      icon: List,
    },
    {
      href: '/clientes',
      label: 'Clientes',
      icon: Users,
    },
    {
      href: '/configuracoes',
      label: 'Configurações',
      icon: Settings,
      children: [
        { href: '/usuarios', label: 'Usuários' },
        { href: '/servicos', label: 'Serviços' },
        {
          href: '/categorias-servicos',
          label: 'Categorias de Serviço',
        },
      ],
    },
  ];

  // Filtrar menus baseado nas permissões centrais
  const menus = todosMenus
    .filter((menu) => podeAcessar(menu.href))
    .map((menu) => {
      if (!menu.children) return menu;

      const childrenFilhos = menu.children.filter((child) =>
        podeAcessar(child.href),
      );

      return { ...menu, children: childrenFilhos };
    })
    .filter(
      (menu) =>
        !menu.children ||
        menu.children.length > 0 ||
        menu.href !== '/configuracoes',
    );

  const isAtivo = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isAtivoExato = (href: string) => pathname === href;

  const isAtivoOuFilho = (href: string, children?: SubmenuItem[]) => {
    const ativoNoPai = isAtivo(href);
    const ativoNoFilho = (children || []).some((child) =>
      isAtivoExato(child.href),
    );
    return ativoNoPai || ativoNoFilho;
  };

  return (
    <>
      {/* Overlay para mobile */}
      {estaAberta && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={aoFechar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-primary text-primary-foreground transition-all duration-300 z-40 lg:relative lg:z-0 lg:translate-x-0 flex flex-col',
          estaAberta ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="p-6 border-b border-primary/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
              <span className="font-bold text-primary text-sm">OS</span>
            </div>
            <span className="font-bold text-lg">OSControl</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={aoFechar}
            className="lg:hidden"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const ativo = isAtivoOuFilho(menu.href, menu.children);
            return (
              <div key={menu.href} className="flex flex-col gap-1">
                <Link
                  href={menu.href}
                  onClick={aoFechar}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left',
                    ativo
                      ? 'bg-primary-foreground text-primary font-semibold'
                      : 'hover:bg-primary/80 text-primary-foreground/90',
                  )}
                >
                  <Icon className="size-5" />
                  <span>{menu.label}</span>
                </Link>

                {menu.children && menu.children.length > 0 && (
                  <div className="ml-4 pl-3 border-l border-primary-foreground/20 flex flex-col gap-1">
                    {menu.children.map((child) => {
                      const childAtivo = isAtivoExato(child.href);

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={aoFechar}
                          className={cn(
                            'w-full block text-left px-3 py-2 rounded-md text-sm transition-colors',
                            childAtivo
                              ? 'bg-primary-foreground text-primary font-semibold'
                              : 'text-primary-foreground/80 hover:bg-primary/80',
                          )}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary/20">
          <p className="text-xs text-primary-foreground/70">v1.0.0</p>
        </div>
      </div>
    </>
  );
}
