# Camadas e Responsabilidades

Este documento detalha o papel, as fronteiras e as permissões de dependência entre cada camada do projeto, fornecendo uma matriz de governança técnica para evitar vazamento de responsabilidades.

---

## 1. Detalhamento de Cada Camada

### 1.1 Camada de Roteamento e Telas (`src/app/`)
- **Papel**: Ponto de entrada de rotas, layouts compartilhados e montagem das páginas.
- **Evidências no Projeto**:
  - `src/app/layout.tsx`: Server Component raiz que monta `html`, `body`, fontes Geist e script inline anti-flicker de tema.
  - `src/app/(painel)/layout.tsx`: Client Component que realiza a guarda de rota com `useSyncExternalStore`.
  - `src/app/(painel)/agendamentos/[documentId]/page.tsx`: Consumo moderno de parâmetros de rota assíncronos no Next.js 16 / React 19 usando o hook `use(params)`.
- **Regras da Camada**:
  - Páginas devem conter o mínimo de lógica de negócio possível.
  - A manipulação de dados deve ser delegada para custom hooks ou funções de serviço.
  - Telas que utilizam hooks de estado do cliente devem conter a diretiva `'use client'`.

### 1.2 Camada de Componentes (`src/components/`)
- **Papel**: Renderização visual estrutural, acessibilidade e interação direta com o usuário.
- **Divisão Identificada**:
  1. **Componentes Base / Primitivos**: Não conhecem nenhuma entidade de negócio (`Button`, `Input`, `Select`, `DateField`, `TimeField`, `Modal`, `BottomSheet`, `ConfirmDialog`, `Skeleton`, `StatusBadge`, `Icons`).
  2. **Componentes de Domínio**: Conhecem modelos de negócio e orquestram fluxos específicos (`AgendamentoForm`, `ClienteModal`, `NotificacoesBell`, `NotificacaoItem`, `AppointmentCard`).
- **Padrão de Co-localização**:
  - Cada componente reside em pasta própria com `index.tsx` e arquivo de estilização `styles.ts` (ou `*.styles.ts`).
  - Lógicas auxiliares estritamente locais do componente podem residir no mesmo diretório (ex: `src/components/Modal/shared.tsx`).

### 1.3 Camada de Orquestração e Estado (`src/hooks/`)
- **Papel**: Gerenciar o ciclo de vida de dados assíncronos, caching local, controle de erros e expor assinaturas uniformes para a interface.
- **Padrões Técnicos Observados**:
  - **Prevenção de Race Conditions / Memory Leak no Desmonte**:
    ```ts
    useEffect(() => {
      let ativo = true;
      async function carregar() {
        try {
          const dados = await getClientes();
          if (ativo) setClientes(dados);
        } finally {
          if (ativo) setLoading(false);
        }
      }
      carregar();
      return () => { ativo = false; };
    }, [versao]);
    ```
    *(Evidência: `src/hooks/useClientes.ts`, `src/hooks/useAgendamentos.ts`, `src/hooks/useAgendamento.ts`)*.
  - **Recarregamento Manual por Versão**:
    Invalidação de dados disparada via incremento de contador:
    ```ts
    const [versao, setVersao] = useState(0);
    const recarregar = useCallback(() => setVersao((v) => v + 1), []);
    ```
  - **Polling Inteligente Baseado em Visibilidade**:
    Em `src/hooks/useNotificacoes.ts`, a requisição periódica (60s) ocorre com flag `silencioso: true` para não acionar spinners de loading e só executa se `document.visibilityState === 'visible'`.

### 1.4 Camada de Provedores Globais (`src/providers/`)
- **Papel**: Disponibilizar contextos globais de aplicação que precisam cobrir toda a árvore de renderização.
- **Estrutura**:
  - `src/providers/index.tsx`: Agrupa todos os provedores em um componente unificado `<Providers>`, reduzindo ruído visual no layout raiz.
  - `ToastProvider.tsx`: Mantém a fila de alertas ativos com temporizador de expiração automática (`DURACAO_MS = 3600`) e suporte a fechamento por clique ou teclado (Enter/Espaço).
  - `ThemeProvider.tsx`: Sincroniza preferência do usuário (`light`, `dark`, `system`) com `localStorage` e a `prefers-color-scheme` do dispositivo, injetando variáveis de atributo no elemento raiz do documento (`document.documentElement.dataset.theme`).

### 1.5 Camada de Serviços de API (`src/services/`)
- **Papel**: Abstrair endpoints remotos e protocolos de rede.
- **Características**:
  - Funções assíncronas puras sem estado (*stateless*).
  - Empacotam dados no formato esperado pelo backend (ex: payload com objeto `{ data: { ... } }` para mutações no Strapi).
  - Retornam dados sanitizados com apoio dos mappers da camada de tipos.

### 1.6 Camada de Contratos e Tipos (`src/types/`)
- **Papel**: Garantir integridade de tipagem estática e definir fronteiras de dados.
- **Padrão de Mappers DTO -> Domínio**:
  - As interfaces refletem o contrato do Strapi (ex: `documentId`, `createdAt`).
  - Funções mappers (como `mapAgendamento` e `mapNotificacao`) normalizam valores nulos e adaptam propriedades técnicas para modelos de consumo facilitado na UI.

### 1.7 Camada de Utilitários de Domínio (`src/utils/`)
- **Papel**: Cálculos de domínio, máscaras, validações determinísticas e formatações sem efeitos colaterais.
- **Isolamento**:
  - Não dependem de React nem de bibliotecas externas pesadas.
  - Concentram operações como ordenação de agendamentos por data/hora, cálculo de intervalos de filtro e geração de links do WhatsApp.

### 1.8 Camada de Infraestrutura de Autenticação (`src/lib/auth.ts`)
- **Papel**: Gerenciamento de credenciais locais e barramento de sincronização.
- **Implementação**:
  - Gerencia `localStorage` com `Set<AuthListener>` para notificação in-memory no mesmo contexto.
  - Registra ouvinte no evento nativo `window.addEventListener('storage', callback)` para sincronizar logout e login automaticamente entre múltiplas abas abertas no mesmo navegador.

---

## 2. Matriz de Dependências (Quem Pode Importar Quem)

Para preservar a arquitetura e evitar ciclos ou vazamentos de responsabilidade, a seguinte matriz deve ser respeitada:

| Camada Origem | Pode Importar | NÃO Pode Importar |
| :--- | :--- | :--- |
| **`app/`** (Páginas/Layouts) | `components/`, `hooks/`, `providers/`, `types/`, `utils/`, `lib/` | — |
| **`components/`** (Componentes) | `components/` (Base), `hooks/`, `types/`, `utils/`, `services/` *(somente em mutações diretas simples)* | `app/` |
| **`hooks/`** (Orquestração) | `services/`, `types/`, `utils/`, `lib/`, `providers/` | `components/`, `app/` |
| **`providers/`** (Contextos) | `components/` (Base/Icons), `types/`, `styles/`, `lib/` | `services/`, `hooks/` *(exceto auto-re-export)*, `app/` |
| **`services/`** (Acesso API) | `types/`, `utils/`, `lib/` | `components/`, `hooks/`, `providers/`, `app/` |
| **`types/`** (Contratos) | Outros arquivos dentro de `types/` | `services/`, `hooks/`, `components/`, `app/`, `providers/` |
| **`utils/`** (Funções Puras) | `types/`, outros arquivos de `utils/` | `services/`, `hooks/`, `components/`, `providers/`, `app/` |
| **`lib/`** (Infraestrutura) | Tipos nativos | `app/`, `components/`, `hooks/` |

---

## 3. Inconsistências Observadas no Projeto

1. **Chamada Direta a Serviço dentro de Página/Componente**:
   - Em `src/app/(painel)/page.tsx` (Dashboard):
     - `import { deletarAgendamento } from '@/src/services/agendamentos.service';`
     - `import { getMe } from '@/src/services/auth.service';`
   - *Análise*: A página consome tanto o hook `useAgendamentos` quanto funções de serviço diretamente (`deletarAgendamento`, `getMe`). Idealmente, mutações e busca de usuário devem ser encapsuladas pelo hook correspondente (`useAgendamentos` para exclusão e recarga, `useAuth` para perfil de usuário).
2. **Re-export Cruzado entre Hooks e Providers**:
   - `src/hooks/useToast.ts` apenas faz `export { useToast } from '@/src/providers/ToastProvider';`.
   - `src/hooks/useTheme.ts` apenas faz `export { useTheme } from '@/src/providers/ThemeProvider';`.
   - *Análise*: Embora conveniente para manter todos os hooks consumíveis a partir da pasta `src/hooks/`, gera um desvio de padrão onde alguns hooks residem fisicamente em `src/hooks/` e outros são meros re-exports de `src/providers/`.

---

## 4. Recomendações para Manter a Separação de Camadas

1. **Encapsular Mutações nos Hooks Especializados**:
   - Em novos desenvolvimentos, exponha funções de ação (`excluir`, `salvar`, `atualizar`) diretamente nos hooks de entidade, garantindo que o ciclo de feedback (`loading`, `error`, `toast`) e a invalidação de versão (`setVersao`) ocorram de forma padronizada.
2. **Preservar a Pureza de `src/utils/`**:
   - Nunca importe serviços ou componentes dentro de utilitários; estes devem permanecer funções puras, testáveis e sem efeitos colaterais.

