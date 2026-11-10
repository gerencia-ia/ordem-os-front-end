# Testes, Qualidade e Manutenção

Este documento documenta o diagnóstico de qualidade de código, as ferramentas de formatação e análise estática, as estratégias de resiliência e as recomendações para implementação de testes no projeto.

---

## 1. Diagnóstico do Estado Atual de Qualidade

| Dimensão de Qualidade | Status no Projeto | Evidência / Configuração |
| :--- | :--- | :--- |
| **Testes Unitários** | **Inexistente** | Nenhum arquivo `*.test.*` ou `*.spec.*` localizado; nenhum test runner (`vitest`, `jest`) instalado. |
| **Testes de Integração** | **Inexistente** | Nenhuma suíte de integração de componentes (`@testing-library/react`) configurada. |
| **Testes End-to-End (E2E)** | **Inexistente** | Nenhum framework E2E (`playwright`, `cypress`) instalado. |
| **Análise Estática (Lint)** | **Ativo e Configurado** | ESLint v9 com Flat Config moderno (`eslint.config.mjs`). |
| **Formatação de Código** | **Ativo e Configurado** | Prettier v3 (`.prettierrc.js`, `.prettierignore`, `.editorconfig`). |
| **Checagem de Tipos** | **Ativo e Estrito** | TypeScript v5 em modo `strict: true` (`tsconfig.json`). |

---

## 2. Configurações de Linting e Formatação

### 2.1 ESLint v9 Flat Config (`eslint.config.mjs`)

O projeto utiliza o novo padrão de configuração do ESLint (Flat Config):

```javascript
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    '.agent/**',
    'next-env.d.ts',
  ]),
]);
```

#### Pontos Relevantes:
- Herda as melhores práticas do Next.js para Core Web Vitals e TypeScript.
- Integração com `eslint-config-prettier/flat` para desativar regras conflitantes entre ESLint e Prettier.
- Ignora pastas de compilação e artefatos de IA (`.agent/**`).

### 2.2 Prettier (`.prettierrc.js` e `.editorconfig`)

- Regras definidas no `.prettierrc.js`:
  ```javascript
  module.exports = {
    semi: true,
    trailingComma: 'all',
    singleQuote: true,
    printWidth: 80,
    tabWidth: 2,
  };
  ```
- Alinhamento no `.editorconfig`:
  - `indent_style = space`
  - `indent_size = 2`
  - `end_of_line = lf`
  - `charset = utf-8`
  - `trim_trailing_whitespace = true`
  - `insert_final_newline = true`

---

## 3. Estratégias de Resiliência e Tratamento de Exceções

Mesmo sem testes automatizados, o projeto adota técnicas defensivas consistentes no código-fonte:

### 3.1 Prevenção de Race Conditions e Vazamento de Memória
Nos hooks assíncronos (`useAgendamentos`, `useClientes`, `useAuth`, `useNotificacoes`), o padrão de flag de cancelamento é sistematicamente aplicado:

```ts
useEffect(() => {
  let ativo = true;

  async function carregar() {
    try {
      setLoading(true);
      const resultado = await servico();
      if (ativo) setDados(resultado);
    } catch (err) {
      if (ativo) setError(err instanceof Error ? err.message : 'Erro genérico');
    } finally {
      if (ativo) setLoading(false);
    }
  }

  carregar();

  return () => {
    ativo = false; // Garante que respostas atrasadas não atualizem componentes desmontados
  };
}, [versao]);
```

### 3.2 Estados de Interface Explícitos (Loading, Error, Empty)
As telas e listas tratam os três estados fundamentais de ciclo de vida assíncrono:

```tsx
{loading && <AppointmentListSkeleton rows={3} />}

{!loading && error && (
  <ErrorState description={error} onRetry={recarregar} />
)}

{!loading && !error && dados.length === 0 && (
  <EmptyState title="Nenhum registro" description="..." action={...} />
)}

{!loading && !error && dados.length > 0 && (
  <Lista>{/* renderização */}</Lista>
)}
```

---

## 4. Recomendações para Implementação de Testes em Novos Projetos

Para elevar a maturidade técnica de novos projetos baseados neste blueprint, recomenda-se a seguinte estrutura de qualidade:

### 4.1 Testes Unitários e de Utilitários (Prioridade 1)
- **Ferramenta Recomendada**: **Vitest**.
- **Alvo**: A camada `src/utils/` (`date.ts`, `phone.ts`, `cpf.ts`, `agendamentos.ts`) é 100% composta por funções puras e deve atingir cobertura próxima de 100%.
- **Exemplo de Caso de Teste para `src/utils/agendamentos.ts`**:
  ```ts
  describe('aplicarFiltros', () => {
    it('deve filtrar agendamentos pelo status informado', () => {
      const lista = [
        { id: 1, status_id: { nome: 'agendado' } },
        { id: 2, status_id: { nome: 'finalizado' } },
      ];
      const resultado = aplicarFiltros(lista as any, { status: 'agendado', periodo: 'todos', busca: '' });
      expect(resultado).toHaveLength(1);
      expect(resultado[0].id).toBe(1);
    });
  });
  ```

### 4.2 Testes de Mappers e Serviços (Prioridade 2)
- Testar o comportamento dos mappers (`mapAgendamento`, `mapNotificacao`) com payloads incompletos ou com campos nulos vindos do backend.
- Mockar a função `apiFetch` para validar o fluxo de renovação de sessão quando recebe status HTTP 401.

### 4.3 Testes de Componentes e Acessibilidade (Prioridade 3)
- **Ferramentas**: Vitest + React Testing Library + `@testing-library/jest-dom`.
- Testar comportamento dos modais: fechamento por tecla Escape, retorno do foco ao gatilho e retenção do tabulador (`useFocusTrap`).

### 4.4 Testes End-to-End (E2E)
- **Ferramenta**: **Playwright**.
- Cobrir o fluxo crítico do negócio:
  1. Login com CPF e senha na tela `/login`.
  2. Redirecionamento para o dashboard `/`.
  3. Criação de um novo agendamento e conferência na listagem.
  4. Logout seguro na tela `/configuracoes`.

