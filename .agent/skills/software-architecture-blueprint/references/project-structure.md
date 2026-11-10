# Estrutura e Organização do Projeto

Este documento detalha como os arquivos e diretórios estão estruturados na aplicação, delimitando as responsabilidades de cada pasta, convenções de nomenclatura e agrupamentos funcionais observados no código-fonte.

---

## 1. Topologia Geral de Diretórios

O projeto adota uma estrutura baseada no **Next.js App Router** com código de aplicação concentrado sob a pasta `src/`.

```text
agenda-next-app/
├── .agent/skills/               # Skills de IA e automação do workspace
├── public/                      # Ativos estáticos públicos (SVGs nativos)
├── src/
│   ├── app/                     # Rotas e layouts do Next.js App Router
│   ├── components/              # Componentes de interface e blocos de domínio
│   ├── hooks/                   # Custom hooks de orquestração e estado
│   ├── lib/                     # Utilitários de infraestrutura (auth, SSR registry)
│   ├── providers/               # Provedores de contexto React (tema, toasts)
│   ├── services/                # Camada de comunicação com a API REST
│   ├── styles/                  # Configuração de temas e registro SSR do styled-components
│   ├── types/                   # Interfaces, tipos TypeScript e mappers DTO
│   └── utils/                   # Funções utilitárias puras (datas, máscaras, WhatsApp)
├── .editorconfig                # Padronização de formatação de arquivos
├── .env                         # Variáveis de ambiente locais
├── .gitignore                   # Regras de exclusão do controle de versão
├── .prettierrc.js               # Configurações do formatador Prettier
├── .prettierignore              # Arquivos ignorados pelo Prettier
├── eslint.config.mjs            # Configuração Flat Config do ESLint v9
├── next.config.ts               # Configuração do Next.js e compilador styled-components
├── package.json                 # Manifesto de dependências e scripts de execução
├── postcss.config.mjs           # Configuração de PostCSS (remanescente)
└── tsconfig.json                # Configuração do compilador TypeScript
```

---

## 2. Responsabilidades por Diretório (`src/`)

### A. `src/app/` — Camada de Roteamento e Telas
Responsável por definir a árvore de rotas, layouts compartilhados e pontos de entrada de páginas utilizando o Next.js App Router.

- **`src/app/layout.tsx`**: Layout raiz da aplicação. É um Server Component responsável por:
  - Carregar fontes via `next/font/google`.
  - Configurar metadados globais e `viewport`.
  - Injetar o script síncrono inline de tema anti-flicker no `<head>`.
  - Encapsular a aplicação com `StyledComponentsRegistry` e o agregador `Providers`.
- **`src/app/(painel)/`**: Agrupamento lógico de rotas autenticadas (Route Group). Não afeta a URL pública.
  - `layout.tsx`: Layout autenticado que verifica a sessão através de `useSyncExternalStore` e protege as rotas internas, redirecionando usuários não autenticados para `/login`.
  - `page.tsx`: Rota raiz do painel (`/`), apresentando o dashboard inicial.
  - `agendamentos/`: Listagem, filtros e sub-rotas (`novo`, `[documentId]`, `[documentId]/editar`).
  - `clientes/`: Gestão e cadastro de clientes.
  - `configuracoes/`: Gerenciamento de preferências do usuário e encerramento de sessão.
- **`src/app/login/`**: Rota pública de autenticação (`/login`), desacoplada da casca do painel.

### B. `src/components/` — Camada de Componentes
Organizada em componentes genéricos e componentes especializados por domínio.

1. **Componentes Especializados por Domínio**:
   - `src/components/Agendamentos/`: Componentes específicos do fluxo de agendamento (`AgendamentoForm`, `AcoesAgendamento`, `AgendamentosPorData`, `FiltrosSheet`).
   - `src/components/Clientes/`: Modais e componentes da entidade cliente (`ClienteModal`).
   - `src/components/Notificacoes/`: Sino de notificações para cabeçalho e itens de notificação do dia (`NotificacoesBell`, `NotificacaoItem`).
   - `src/components/Auth/`: Componentes da tela de login (`LoginForm`).
2. **Componentes Estruturais e de Layout**:
   - `src/components/AppShell/`: Estrutura do viewport com casca centralizada e navegação inferior fixa.
   - `src/components/Header/`: Cabeçalho sticky com título, botão de retorno e sino de notificações.
   - `src/components/BottomNavigation/`: Barra de navegação inferior com links fixos e detecção de rota ativa.
3. **Componentes Base de Entrada e Feedback**:
   - `src/components/Button/`, `Input/`, `Select/`, `DateField/`, `TimeField/`, `Field/`.
   - `src/components/Modal/`, `BottomSheet/`, `ConfirmDialog/`, `DropdownMenu/`.
   - `src/components/Loading/`, `ErrorState/`, `EmptyState/`, `Skeleton/`, `StatusBadge/`.
   - `src/components/Icons/`: Conjunto de ícones SVG nativos sem dependência externa.

### C. `src/hooks/` — Camada de Orquestração e Estado
Centraliza a lógica de controle assíncrono, conexão com serviços e exposição de estado para componentes.

- `useAuth.ts`: Consulta dados do usuário autenticado (`getMe`) e valida credenciais.
- `useAgendamentos.ts`: Carrega lista completa de agendamentos e aplica filtros em memória via `useMemo`.
- `useAgendamento.ts`: Busca e recarrega um agendamento individual pelo seu `documentId`.
- `useClientes.ts`: Carrega a lista de clientes para formulários e listagens.
- `useStatus.ts`: Carrega a lista de status disponíveis para agendamentos.
- `useNotificacoes.ts`: Gerencia o ciclo de polling a cada 60s para notificações do dia e atualização de leitura.
- `useToast.ts` e `useTheme.ts`: Atalhos para os contextos correspondentes em `src/providers/`.

### D. `src/services/` — Camada de Acesso a Dados e API
Isola todas as chamadas HTTP para a API externa (Strapi REST API).

- `api.ts`: Cliente HTTP base (`apiFetch`, `apiGet`), interceptor de refresh token em respostas HTTP 401, encerramento de sessão e parser de erros.
- `config.ts`: Configuração da URL base da API.
- `auth.service.ts`: Métodos de login (`/api/auth/local`) e validação de sessão (`/api/users/me`).
- `agendamentos.service.ts`: CRUD de agendamentos (`/api/agendamentos`).
- `clientes.service.ts`: CRUD de clientes (`/api/clientes`).
- `notificacoes.service.ts`: Busca de notificações diárias e marcação de status de leitura (`/api/notificacoes`).
- `status.service.ts`: Consulta de status do sistema (`/api/statuses`).

### E. `src/types/` — Camada de Contratos e Modelagem de Dados
Define os tipos de dados trafegados entre o backend e a interface.

- `strapi.ts`: Interfaces de envelope da API Strapi (`StrapiCollectionResponse<T>`, `StrapiItemResponse<T>`, `StrapiPagination`).
- `agendamento.ts`: Contrato de `Agendamento`, filtros suportados e função `mapAgendamento`.
- `cliente.ts`: Contrato de `Cliente`.
- `status.ts`: Contrato de `Status`.
- `user.ts`: Contratos de `User`, `LoginData` e `LoginResponse`.
- `notificacao.ts`: Tipos de notificação suportados, enums e função `mapNotificacao`.

### F. `src/utils/` — Camada de Funções Puras e Domínio
Centraliza lógicas de formatação, validação de regras de negócio simples e integração utilitária sem acoplamento a bibliotecas pesadas.

- `date.ts`: Manipulação de datas no formato ISO ("YYYY-MM-DD" e "HH:mm") evitando discrepâncias de fuso horário.
- `phone.ts`: Máscara e validação de telefones com DDD brasileiro.
- `cpf.ts`: Máscara e validação estrutural de CPF brasileiro.
- `agendamentos.ts`: Funções de ordenação cronológica, agrupamento por data, cálculo de períodos e filtros em memória.
- `whatsapp.ts`: Geração de links `wa.me` com mensagens de lembrete dinâmicas.

### G. `src/lib/` — Utilitários de Infraestrutura
- `auth.ts`: Armazenamento de token no `localStorage` e barramento de eventos (`subscribeAuth`, `notify`) para sincronização reativa com React e outras abas do navegador via evento `storage`.
- `registry.tsx`: Registro de coleta de estilos do `styled-components` para SSR no Next.js App Router (`useServerInsertedHTML`).

### H. `src/providers/` — Contextos Compartilhados
- `index.tsx`: Componente agregador `<Providers>` que encapsula múltiplos providers em uma única árvore.
- `ThemeProvider.tsx`: Controle de tema ativo (`light`, `dark`, `system`), persistência em `localStorage` e integração com `StyledThemeProvider`.
- `ToastProvider.tsx`: Contexto e gerenciador imperativo de mensagens de notificação em tela (`sucesso`, `erro`, `info`).

---

## 3. Convenções de Nomenclatura e Arquivos

| Artefato | Convenção | Exemplo no Projeto |
| :--- | :--- | :--- |
| **Componentes React** | PascalCase com pasta e `index.tsx` | `src/components/Header/index.tsx`, `src/components/ConfirmDialog/index.tsx` |
| **Componentes de Domínio** | Agrupamento por domínio em PascalCase | `src/components/Agendamentos/AgendamentoForm/index.tsx` |
| **Módulos de Estilo** | Co-localizados com sufixo `.styles.ts` ou `styles.ts` | `agendamentos.styles.ts`, `src/components/Button/styles.ts` |
| **Serviços de API** | camelCase com sufixo `.service.ts` | `src/services/agendamentos.service.ts` |
| **Custom Hooks** | camelCase com prefixo `use` | `src/hooks/useAgendamentos.ts` |
| **Tipos e Contratos** | camelCase no singular | `src/types/agendamento.ts`, `src/types/cliente.ts` |
| **Utilitários Puros** | camelCase por finalidade | `src/utils/date.ts`, `src/utils/cpf.ts` |
| **Rotas App Router** | kebab-case para segmentos estáticos, colchetes para dinâmicos | `src/app/(painel)/agendamentos/[documentId]/editar/page.tsx` |

---

## 4. Inconsistências Identificadas na Estrutura

1. **Configuração de Path Alias no `tsconfig.json`**:
   - *Fato*: O arquivo `tsconfig.json` define:
     ```json
     "paths": {
       "@/*": ["./*"]
     }
     ```
   - *Impacto*: Os módulos importam referências incluindo o prefixo `src/`, como `@/src/components/...` ou `@/src/services/...`. Em muitas aplicações Next.js o padrão convencional é `@/*: ["./src/*"]`.
2. **Duplicidade de Padrão de Importação dentro da Mesma Camada**:
   - Em `src/services/agendamentos.service.ts`:
     ```ts
     import { Agendamento, mapAgendamento } from '../types/agendamento'; // relativo
     import { apiFetch, apiGet } from './api';                          // relativo
     ```
   - Em `src/services/auth.service.ts`:
     ```ts
     import { LoginData, LoginResponse, User } from '@/src/types/user'; // absoluto
     import { apiFetch } from './api';                                  // relativo
     ```
3. **Módulo de Configuração Órfão**:
   - O arquivo `src/services/config.ts` exporta `API_URL` com fallback:
     ```ts
     export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:1337';
     ```
   - Entretanto, `src/services/api.ts` define diretamente:
     ```ts
     const API_URL = process.env.NEXT_PUBLIC_API_URL;
     ```
   - Isso deixa `src/services/config.ts` não utilizado e remove o valor de contingência (*fallback*) da conexão principal da API.

---

## 5. Diretrizes de Reutilização para Novos Projetos

Ao estruturar novos projetos utilizando este blueprint:

1. **Mantenha a Separação Estrita de Camadas**:
   - A camada `app/` não deve conter chamadas HTTP diretas nem manipulação de formulários em larga escala; delegue a orquestração para `hooks/` e a renderização para `components/`.
2. **Isole Serviços de API**:
   - Todo acesso externo deve residir em `services/`, consumindo um cliente base comum (`api.ts`).
3. **Padronize o Path Alias na Inicialização**:
   - Recomenda-se definir `"@/*": ["./src/*"]` no `tsconfig.json` para simplificar importações (`@/components/...` em vez de `@/src/components/...`).
4. **Agrupe Componentes por Domínio quando Complexos**:
   - Quando um componente for composto de sub-blocos específicos (como modais ou filtros vinculados a uma única entidade), mantenha-os aninhados na pasta do domínio (ex: `components/Agendamentos/FiltrosSheet`).

