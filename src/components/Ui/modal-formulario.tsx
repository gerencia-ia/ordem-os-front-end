'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/Ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/src/components/Ui/drawer';
import { useIsMobile } from '@/src/hooks/use-mobile';
import { cn } from '@/src/lib/utils';

type ModalTamanho = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const TAMANHO_CLASSES: Record<ModalTamanho, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-3xl',
  '2xl': 'sm:max-w-4xl',
};

const ModalContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
});

interface ModalFormularioProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tamanho?: ModalTamanho;
  className?: string;
  children: React.ReactNode;
}

export function ModalFormulario({
  open,
  onOpenChange,
  tamanho = 'md',
  className,
  children,
}: ModalFormularioProps) {
  const isMobile = useIsMobile();

  return (
    <ModalContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer
          open={open}
          onOpenChange={onOpenChange}
          repositionInputs={false}
        >
          <DrawerContent
            className={cn(
              'mt-0 flex max-h-[92dvh] flex-col gap-0 overflow-hidden p-0',
              className,
            )}
          >
            {children}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            className={cn(
              'flex max-h-[90dvh] flex-col gap-0 overflow-hidden p-0',
              TAMANHO_CLASSES[tamanho],
              className,
            )}
          >
            {children}
          </DialogContent>
        </Dialog>
      )}
    </ModalContext.Provider>
  );
}

interface ModalFormularioHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function ModalFormularioHeader({
  title,
  description,
  icon,
  badge,
  className,
}: ModalFormularioHeaderProps) {
  const { isMobile } = React.useContext(ModalContext);

  const titleContent = (
    <div className="flex items-center gap-2 pr-6">
      {icon && <span className="shrink-0 text-primary">{icon}</span>}
      <span className="truncate">{title}</span>
      {badge}
    </div>
  );

  if (isMobile) {
    return (
      <DrawerHeader
        className={cn('shrink-0 border-b px-4 py-3 text-left', className)}
      >
        <DrawerTitle className="text-base leading-snug">
          {titleContent}
        </DrawerTitle>
        {description && (
          <DrawerDescription className="text-xs leading-relaxed">
            {description}
          </DrawerDescription>
        )}
      </DrawerHeader>
    );
  }

  return (
    <DialogHeader
      className={cn('shrink-0 border-b px-6 py-4 text-left', className)}
    >
      <DialogTitle>{titleContent}</DialogTitle>
      {description && <DialogDescription>{description}</DialogDescription>}
    </DialogHeader>
  );
}

interface ModalFormularioBodyProps extends React.ComponentProps<'div'> {
  children: React.ReactNode;
}

export function ModalFormularioBody({
  className,
  children,
  ...props
}: ModalFormularioBodyProps) {
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface ModalFormularioFooterProps {
  leftSlot?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function ModalFormularioFooter({
  leftSlot,
  className,
  children,
}: ModalFormularioFooterProps) {
  return (
    <div
      className={cn(
        'bg-muted/20 flex shrink-0 flex-col gap-3 border-t px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-3.5',
        className,
      )}
    >
      {leftSlot ? (
        <div className="flex items-center justify-between sm:justify-start">
          {leftSlot}
        </div>
      ) : (
        <div className="hidden sm:block" />
      )}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        {children}
      </div>
    </div>
  );
}
