# Configuração e Infraestrutura

Este documento analisa as variáveis de ambiente, compiladores, scripts de execução, suporte a SSR e o panorama de infraestrutura e esteira de build do projeto.

---

## 1. Gerenciamento de Variáveis de Ambiente

O projeto utiliza o arquivo `.env` na raiz para configuração de parâmetros de execução.

### 1.1 Variáveis Identificadas:
```ini
NEXT_PUBLIC_API_URL=http://localhost:1337
```

### 1.2 Regras de Exposição:
- O prefixo `NEXT_PUBLIC_` é exigido pelo Next.js para que a variável seja embutida no pacote JavaScript do navegador (lado cliente).
- Variáveis sem o prefixo permanecem restritas ao ambiente Node.js / Server Components do Next.js.

### 1.3 Inconsistência de URL e Fallback:
- No arquivo `src/services/config.ts`:
  ```ts
  export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:1337';
  ```
- No arquivo `src/services/api.ts`:
  ```ts
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  ```
- *Fato*: `src/services/api.ts` lê diretamente a variável de ambiente sem utilizar o fallback nem importar `config.ts`. Caso a variável não esteja definida no `.env`, as requisições geram URLs inválidas (`undefined/api/...`).

---

## 2. Configurações de Compilação do Next.js

### 2.1 `next.config.ts`
O arquivo de configuração do framework habilita a compilação nativa de `styled-components` pelo compilador do Next.js (SWC):

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
```

Essa diretiva instrui o SWC a:
- Gerar nomes de classes legíveis e estáveis para evitar dessincronização de hidratação entre SSR e cliente.
- Habilitar minificação de CSS em produção.
- Adicionar suporte a propriedades de display name para depuração.

### 2.2 Coleta de Estilos SSR (`src/lib/registry.tsx`)
Para evitar FOUC (*Flash of Unstyled Content*) ao utilizar CSS-in-JS no Next.js App Router, o projeto implementa o coletor de estilos de servidor através do hook `useServerInsertedHTML`:

```tsx
'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}
```

---

## 3. Padrão Arquitetural Anti-Flicker de Tema (Anti-FOT)

Para prevenir o *Flash of Theme* (quando a página carrega no tema claro e troca abruptamente para o escuro após o JavaScript carregar), o layout raiz (`src/app/layout.tsx`) injeta um script síncrono inline imediatamente antes de qualquer outro componente:

```tsx
// src/app/layout.tsx
const themeScript = `!function(){try{var p=localStorage.getItem('barbearia:tema');var s=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var t=(p==='light'||p==='dark')?p:s;var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t;}catch(e){}}();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
```

### Por que esta é uma decisão arquitetural:
- Executa antes do parser do HTML renderizar os nós visíveis.
- Define `document.documentElement.dataset.theme` e `colorScheme` de forma síncrona.
- A flag `suppressHydrationWarning` no elemento `<html>` instrui o React a ignorar a diferença de atributo entre o HTML estático gerado no servidor e os atributos modificados no cliente pelo script síncrono.

---

## 4. Scripts de Execução e Ciclo de Vida (`package.json`)

| Script | Comando | Finalidade |
| :--- | :--- | :--- |
| `npm run dev` | `next dev` | Inicia o servidor de desenvolvimento com hot reload (Turbopack/Webpack) |
| `npm run build` | `next build` | Compila e otimiza a aplicação para produção |
| `npm run start` | `next start` | Inicia o servidor Node.js de produção para a build gerada |
| `npm run lint` | `eslint` | Executa a análise estática de código através do ESLint |
| `npm run format` | `prettier --write .` | Formata todos os arquivos do projeto conforme regras do Prettier |
| `npm run check` | `prettier --check .` | Valida se todos os arquivos estão devidamente formatados sem alterá-los |

---

## 5. Diagnóstico de Infraestrutura e Implantação

Com base na inspeção direta do repositório:

1. **Docker e Contêineres**:
   - *Fato*: **Inexistentes**. Não há `Dockerfile`, `.dockerignore` ou `docker-compose.yml` no projeto.
2. **Integração e Entrega Contínua (CI/CD)**:
   - *Fato*: **Inexistentes**. Não há diretório `.github/workflows/`, GitLab CI (`.gitlab-ci.yml`) ou Bitbucket Pipelines configurados.
3. **Arquivos de Exemplo de Ambiente**:
   - *Fato*: Não há `.env.example`.
4. **Alvo de Deploy Documentado**:
   - O `README.md` mantém o texto padrão do `create-next-app` apontando para implantação na plataforma Vercel (`vercel.com`).

---

## 6. Recomendações de Infraestrutura para Novos Projetos

Ao reutilizar este blueprint em novos projetos:

1. **Criar `.env.example` Obrigatório**:
   - Documente todas as variáveis necessárias com valores fictícios para facilitar a integração de novos desenvolvedores.
2. **Unificar Conexão de API**:
   - Garantir que `src/services/api.ts` importe `API_URL` centralizadamente de `src/services/config.ts`.
3. **Adicionar Pipeline de Integração Contínua (CI)**:
   - Configurar um fluxo básico (ex: GitHub Actions) que execute:
     - `npm run check` (Prettier)
     - `npm run lint` (ESLint)
     - `npx tsc --noEmit` (Checagem de tipos estrita do TypeScript)
     - `npm run build` (Garantia de que a compilação de produção não quebra)
4. **Contêiner para Ambientes de Produção Próprios**:
   - Caso a aplicação não seja hospedada em plataformas serverless gerenciadas (como Vercel), fornecer um `Dockerfile` multi-stage com Node Alpine otimizado para Next.js (`output: 'standalone'`).

