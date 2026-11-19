'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/Ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/src/components/Ui/collapsible';
import { useIsMobile } from '@/src/hooks/use-mobile';
import { cn } from '@/src/lib/utils';

interface CardColapsavelProps {
  titulo: React.ReactNode;
  icone?: React.ReactNode;
  resumo?: React.ReactNode;
  headerAction?: React.ReactNode;
  defaultOpenMobile?: boolean;
  hasError?: boolean;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function CardColapsavel({
  titulo,
  icone,
  resumo,
  headerAction,
  defaultOpenMobile = false,
  hasError = false,
  className,
  headerClassName,
  contentClassName,
  children,
}: CardColapsavelProps) {
  const isMobile = useIsMobile();
  const [aberto, setAberto] = React.useState(defaultOpenMobile || hasError);
  const [prevHasError, setPrevHasError] = React.useState(hasError);

  if (hasError !== prevHasError) {
    setPrevHasError(hasError);
    if (hasError) {
      setAberto(true);
    }
  }

  if (!isMobile) {
    return (
      <Card className={cn('gap-4 py-4', className)}>
        <CardHeader className={cn('border-b px-4 pb-2', headerClassName)}>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            {icone && <span className="shrink-0">{icone}</span>}
            <span>{titulo}</span>
          </CardTitle>
          {headerAction && <CardAction>{headerAction}</CardAction>}
        </CardHeader>
        <CardContent className={cn('px-4', contentClassName)}>
          {children}
        </CardContent>
      </Card>
    );
  }

  return (
    <Collapsible open={aberto} onOpenChange={setAberto}>
      <Card
        className={cn(
          'gap-0 py-0 overflow-hidden',
          hasError && 'border-destructive/60',
          className,
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between gap-2 px-4 py-2.5',
            aberto && 'border-b',
            headerClassName,
          )}
        >
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="active:bg-muted/50 -mx-2 flex min-h-10 min-w-0 flex-1 items-center justify-between gap-2 rounded-md px-2 py-1 text-left transition-colors duration-150 ease-out select-none"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {icone && <span className="shrink-0">{icone}</span>}
                  <span className="truncate">{titulo}</span>
                </div>
                {!aberto && resumo && (
                  <div className="text-muted-foreground truncate pl-6 text-xs font-normal">
                    {resumo}
                  </div>
                )}
              </div>
              <ChevronDownIcon
                className={cn(
                  'text-muted-foreground size-4 shrink-0 transition-transform duration-150 ease-out',
                  aberto && 'rotate-180',
                )}
              />
            </button>
          </CollapsibleTrigger>

          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>

        <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-150">
          <CardContent className={cn('px-4 py-4', contentClassName)}>
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
