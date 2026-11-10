import type { Resolver, FieldValues } from 'react-hook-form';
import { toNestErrors } from '@hookform/resolvers';
import type { z } from 'zod';

interface ZodIssueLike {
  path: (string | number)[];
  message: string;
  code?: string;
}

interface ZodErrorLike {
  errors?: ZodIssueLike[];
  issues?: ZodIssueLike[];
}

function isZodErrorLike(error: unknown): error is ZodErrorLike {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('issues' in error || 'errors' in error)
  );
}

/**
 * Resolver compatível com Zod v3 e Zod v4 (onde error.issues substitui error.errors).
 * Evita o lançamento de Uncaught (in promise) ZodError pelo pacote @hookform/resolvers/zod.
 */
export function zodResolver<T extends FieldValues>(
  schema: z.ZodType<T>,
): Resolver<T> {
  return async (values, _context, options) => {
    try {
      const data = await schema.parseAsync(values);
      return { values: data, errors: {} };
    } catch (error: unknown) {
      if (isZodErrorLike(error)) {
        const issues = error.issues || error.errors;
        if (Array.isArray(issues)) {
          const fieldErrors: Record<string, { message: string; type: string }> =
            {};
          for (const issue of issues) {
            const path = issue.path.join('.');
            if (!fieldErrors[path]) {
              fieldErrors[path] = {
                message: issue.message,
                type: issue.code || 'validation',
              };
            }
          }
          return {
            values: {} as Record<string, never>,
            errors: toNestErrors(fieldErrors, options),
          };
        }
      }
      throw error;
    }
  };
}
