'use client';

import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { Badge } from '@/src/components/Ui/badge';
import { Button } from '@/src/components/Ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/src/components/Ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/components/Ui/popover';
import { cn } from '@/src/lib/utils';

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  meta?: string;
  keywords?: string[];
  disabled?: boolean;
  disabledReason?: string;
}

interface ComboboxBaseProps {
  id?: string;
  options: ComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  'aria-invalid'?: boolean;
  className?: string;
}

interface ComboboxSingleProps extends ComboboxBaseProps {
  value: string;
  onValueChange: (value: string) => void;
  clearable?: boolean;
}

export function ComboboxSingle({
  id,
  options,
  value,
  onValueChange,
  placeholder = 'Selecione uma opção...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum resultado encontrado.',
  disabled = false,
  clearable = false,
  'aria-invalid': ariaInvalid,
  className,
}: ComboboxSingleProps) {
  const [open, setOpen] = React.useState(false);
  const listboxId = React.useId();

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn(
            'h-auto min-h-9 w-full justify-between px-3 py-1.5 font-normal active:scale-100',
            !selectedOption && 'text-muted-foreground',
            ariaInvalid &&
              'border-destructive ring-destructive/20 dark:ring-destructive/40',
            className,
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.meta && (
              <span className="text-muted-foreground hidden truncate text-xs sm:inline">
                {selectedOption.meta}
              </span>
            )}
          </span>
          <span className="ml-2 flex shrink-0 items-center gap-1">
            {clearable && selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                aria-label="Limpar seleção"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onValueChange('');
                }}
                className="text-muted-foreground hover:text-foreground rounded-xs p-0.5 transition-colors"
              >
                <XIcon className="size-3.5" />
              </span>
            )}
            <ChevronsUpDownIcon className="size-4 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="text-base md:text-sm"
          />
          <CommandList id={listboxId} className="max-h-60 overscroll-contain">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <CommandItem
                    key={opt.value}
                    value={`${opt.label} ${opt.description ?? ''} ${opt.meta ?? ''} ${(opt.keywords ?? []).join(' ')}`}
                    disabled={opt.disabled}
                    onSelect={() => {
                      if (opt.disabled) return;
                      onValueChange(isSelected && clearable ? '' : opt.value);
                      setOpen(false);
                    }}
                    className="flex items-start justify-between gap-2 py-2"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-2">
                      <CheckIcon
                        className={cn(
                          'mt-0.5 size-4 shrink-0',
                          isSelected ? 'opacity-100 text-primary' : 'opacity-0',
                        )}
                      />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="text-muted-foreground truncate text-xs">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {(opt.disabled && opt.disabledReason) || opt.meta ? (
                      <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                        {opt.disabled && opt.disabledReason
                          ? opt.disabledReason
                          : opt.meta}
                      </span>
                    ) : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface ComboboxMultipleProps extends ComboboxBaseProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  maxVisibleChips?: number;
}

export function ComboboxMultiple({
  id,
  options,
  value,
  onValueChange,
  placeholder = 'Selecione uma ou mais opções...',
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'Nenhum resultado encontrado.',
  disabled = false,
  maxVisibleChips,
  'aria-invalid': ariaInvalid,
  className,
}: ComboboxMultipleProps) {
  const [open, setOpen] = React.useState(false);
  const listboxId = React.useId();

  const optionMap = React.useMemo(
    () => new Map(options.map((opt) => [opt.value, opt])),
    [options],
  );

  const selectedOptions = React.useMemo(
    () =>
      value
        .map((v) => optionMap.get(v))
        .filter((opt): opt is ComboboxOption => Boolean(opt)),
    [value, optionMap],
  );

  const toggleValue = React.useCallback(
    (itemValue: string) => {
      if (value.includes(itemValue)) {
        onValueChange(value.filter((v) => v !== itemValue));
      } else {
        onValueChange([...value, itemValue]);
      }
    },
    [value, onValueChange],
  );

  const visibleChips =
    maxVisibleChips && selectedOptions.length > maxVisibleChips
      ? selectedOptions.slice(0, maxVisibleChips)
      : selectedOptions;
  const hiddenCount = selectedOptions.length - visibleChips.length;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <div
          id={id}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-controls={listboxId}
          aria-expanded={open}
          aria-disabled={disabled}
          aria-invalid={ariaInvalid}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen((prev) => !prev);
            }
          }}
          className={cn(
            'border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-transparent px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]',
            disabled && 'pointer-events-none cursor-not-allowed opacity-50',
            ariaInvalid &&
              'border-destructive ring-destructive/20 dark:ring-destructive/40',
            className,
          )}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground px-0.5 text-base md:text-sm">
                {placeholder}
              </span>
            ) : (
              <>
                {visibleChips.map((opt) => (
                  <Badge
                    key={opt.value}
                    variant="secondary"
                    className="max-w-full gap-1 py-0.5 pr-1 pl-2 text-xs font-medium"
                  >
                    <span className="truncate">{opt.label}</span>
                    {!disabled && (
                      <button
                        type="button"
                        aria-label={`Remover ${opt.label}`}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleValue(opt.value);
                        }}
                        className="hover:bg-foreground/15 rounded-xs p-0.5 transition-colors"
                      >
                        <XIcon className="size-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {hiddenCount > 0 && (
                  <Badge variant="outline" className="text-xs font-normal">
                    +{hiddenCount}
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            className="text-base md:text-sm"
          />
          <CommandList id={listboxId} className="max-h-60 overscroll-contain">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => {
                const isSelected = value.includes(opt.value);
                return (
                  <CommandItem
                    key={opt.value}
                    value={`${opt.label} ${opt.description ?? ''} ${opt.meta ?? ''} ${(opt.keywords ?? []).join(' ')}`}
                    disabled={opt.disabled}
                    onSelect={() => {
                      if (opt.disabled) return;
                      toggleValue(opt.value);
                    }}
                    className="flex items-start justify-between gap-2 py-2"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors',
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-input bg-background',
                        )}
                      >
                        {isSelected && <CheckIcon className="size-3" />}
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="text-muted-foreground truncate text-xs">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </div>
                    {(opt.disabled && opt.disabledReason) || opt.meta ? (
                      <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                        {opt.disabled && opt.disabledReason
                          ? opt.disabledReason
                          : opt.meta}
                      </span>
                    ) : null}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          {value.length > 0 && (
            <div className="flex items-center justify-between border-t px-2.5 py-1.5">
              <span className="text-muted-foreground text-xs">
                {value.length} selecionado(s)
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => onValueChange([])}
              >
                Limpar
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
