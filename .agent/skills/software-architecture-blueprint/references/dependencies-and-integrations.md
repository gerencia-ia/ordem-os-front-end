# Dependências e Integrações

Este documento analisa o manifesto de dependências do projeto, a responsabilidade de cada biblioteca, as integrações externas existentes e a filosofia de dependências mínimas observada na implementação.

---

## 1. Inventário Analítico de Dependências (`package.json`)

```json
{
  "dependencies": {
    "next": "16.3.3",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "styled-components": "^6.5.3"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.5",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/styled-components": "^5.1.36",
    "eslint": "^9.39.5",
    "eslint-config-next": "16.3.3",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.1.1",
    "globals": "^17.11.0",
    "prettier": "^3.9.6",
    "tailwindcss": "^4",
    "typescript": "^5",
    "typescript-eslint": "^8.68.0"
  }
}
```

### 1.1 Atribuição de Responsabilidades por Pacote

| Pacote | Versão | Papel Arquitetural |
| :--- | :--- | :--- |
| **`next`** | 16.3.3 | Framework full-stack: roteamento baseado em arquivos (App Router), Server/Client Components, otimização de fontes e compilação SWC. |
| **`react` / `react-dom`** | 19.2.8 | Biblioteca de interface declarativa e reativa. Fornece recursos modernos como `use(params)` para parâmetros assíncronos e `useSyncExternalStore`. |
| **`styled-components`** | ^6.5.3 | Mecanismo de estilização CSS-in-JS com suporte a temas tipados (`DefaultTheme`) e injeção SSR via `StyledComponentsRegistry`. |
| **`typescript`** | ^5 | Tipagem estática estrita em tempo de compilação. |
| **`eslint`** / **`prettier`** | ^9 / ^3 | Análise estática de código e garantia de formatação padronizada. |

---

## 2. Inconsistência Crítica: Dependência Fantasma (Tailwind CSS)

### O Fato Observado:
- O manifesto `package.json` declara `"tailwindcss": "^4"` e `"@tailwindcss/postcss": "^4"` como `devDependencies`.
- O arquivo `postcss.config.mjs` registra o plugin `'@tailwindcss/postcss': {}`.

### A Evidência no Código-Fonte:
- O arquivo `src/app/globals.css` não importa o Tailwind (`@import "tailwindcss";` está ausente) e contém o seguinte comentário explícito:
  ```css
  /*
   * Estilos globais ficam em styled-components (`src/styles/GlobalStyle.ts`).
   * Este arquivo mantém apenas o essencial que precisa existir antes do JS.
   */
  ```
- Nenhum componente ou tela utiliza classes utilitárias do Tailwind; 100% dos componentes e telas utilizam `styled-components` (`styled.div`, `styled.button`, etc.).

### Diagnóstico Arquitetural:
O Tailwind CSS foi provavelmente adicionado durante o bootstrap automático pelo instalador do `create-next-app` e não foi limpo após a decisão da equipe de padronizar a aplicação em `styled-components`. Em projetos futuros ou na manutenção deste, pacotes não utilizados devem ser desinstalados para reduzir o tamanho de `node_modules` e o tempo de build.

---

## 3. Filosofia de Dependências Mínimas para Primitivas

Uma decisão arquitetural marcante do projeto é a **rejeição deliberada de bibliotecas de terceiros para primitivas e utilitários cotidianos**, preferindo implementações nativas enxutas:

| Domínio de Primitiva | Solução Externa Típica | Solução Real no Projeto | Evidência |
| :--- | :--- | :--- | :--- |
| **Biblioteca de Ícones** | `lucide-react`, `react-icons` | Componentes SVG nativos em linha com propriedades padronizadas | `src/components/Icons/index.tsx` |
| **Sistema de Toasts** | `sonner`, `react-toastify` | Contexto nativo React + fila de estado + `role="status"` | `src/providers/ToastProvider.tsx` |
| **Modais e Overlays** | Radix UI (`@radix-ui/react-dialog`) | React Portals nativos + hooks de trava de scroll e focus trap | `src/components/Modal/shared.tsx` |
| **Manipulação de Datas** | `date-fns`, `dayjs`, `moment` | Funções puras em TypeScript trabalhando com strings ISO ("YYYY-MM-DD") | `src/utils/date.ts` |
| **Cliente HTTP** | `axios`, `ky` | API nativa `fetch` com interceptor de autorização e auto-retry 401 | `src/services/api.ts` |
| **Gerenciamento de Formulários** | `react-hook-form`, `formik` | Estados controlados React (`useState`) com funções puras de validação | `AgendamentoForm`, `ClienteModal` |
| **Validação de Schemas** | `zod`, `yup`, `valibot` | Funções determinísticas em TypeScript (`validar()`, `cpfValido()`, etc.) | `src/utils/cpf.ts`, `src/utils/phone.ts` |
| **Gerenciamento de Estado** | `zustand`, `redux-toolkit` | React Hooks (`useState`, `useMemo`, `useCallback`) + Barramento Pub/Sub | `src/hooks/`, `src/lib/auth.ts` |

### Vantagens Desta Abordagem:
- Menor tamanho de bundle final entregue ao navegador do cliente.
- Redução drástica da superfície de vulnerabilidades em dependências de terceiros.
- Zero atrito de compatibilidade de versões com o React 19.

---

## 4. Integrações Externas

### 4.1 Headless CMS: Strapi REST API
- **Protocolo**: HTTP/1.1 REST com JSON.
- **Autenticação**: Bearer JWT no header `Authorization` + Cookie HTTP-Only de refresh.
- **Responsabilidades Delegadas ao Strapi**:
  - Persistência das coleções (`agendamentos`, `clientes`, `statuses`, `notificacoes`, `users`).
  - Execução de tarefas agendadas via cron (ex: geração das notificações de cortes do dia no minuto exato).

### 4.2 Mensageria: WhatsApp Click-to-Chat (wa.me)
- **Implementação**: `src/utils/whatsapp.ts`.
- **Funcionamento Atual**:
  - Geração de deep-link formatado `https://wa.me/55<telefone>?text=<mensagem>`.
  - Disparado pelo cliente via `window.open(link, '_blank')`.
- **Estratégia de Evolução Documentada no Código**:
  O arquivo `src/utils/whatsapp.ts` possui anotação explícita indicando que essa integração leve foi desenhada para facilitar a substituição futura pela API Oficial do WhatsApp Business (Cloud API / Meta Graph API):
  > *"Quando a API oficial entrar, a origem dos dados (agendamento) e a montagem da mensagem permanecem; só o 'envio' muda: troca-se `window.open(gerarLinkWhatsApp(...))` por uma chamada de serviço."*

---

## 5. Critérios para Adição de Novas Dependências em Projetos Futuros

Antes de instalar qualquer dependência em projetos orientados por este blueprint, o agente deve seguir o seguinte crivo:

1. **A funcionalidade pode ser resolvida com 20 a 50 linhas de TypeScript nativo?**
   - Se sim, prefira implementar em `src/utils/` ou `src/components/` (ex: formatação de datas, foco de acessibilidade, cliente HTTP).
2. **A biblioteca é compatível com React 19 e Next.js App Router?**
   - Verifique se a biblioteca suporta Server Components e React 19 sem alertas de *peer dependencies*.
3. **A biblioteca introduz dependência pesada de runtime?**
   - Evite bibliotecas que inflacionem o bundle móvel sem justificativa de negócio clara.

