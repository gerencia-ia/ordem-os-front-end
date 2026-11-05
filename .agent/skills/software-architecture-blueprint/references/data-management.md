# Gerenciamento de Dados

Este documento documenta os contratos de dados, a modelagem de entidades, a comunicação com a API remota, as estratégias de validação, tratamento de erros e gerenciamento de estado no projeto.

---

## 1. Modelagem de Dados e Integração com Strapi

O backend da aplicação é o headless CMS **Strapi (v4/v5)**. Isso determina como os dados são solicitados, estruturados e manipulados pelo frontend.

### 1.1 Envelopes de Resposta Padronizados (`src/types/strapi.ts`)

Todas as respostas da API REST são encapsuladas em estruturas padronizadas pelo Strapi:

```ts
export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface StrapiCollectionResponse<T> extends StrapiResponse<T[]> {
  meta: {
    pagination: StrapiPagination;
  };
}

export interface StrapiItemResponse<T> extends StrapiResponse<T> {
  meta: Record<string, unknown>;
}
```

### 1.2 Entidades Principais e Identificadores

No Strapi moderno, cada entidade possui:
- `id`: Identificador numérico tradicional de banco de dados (ex: `number`).
- `documentId`: Identificador único público no formato string (ex: `string`), utilizado prioritariamente para operações de busca por ID, edição e exclusão nas rotas REST.

Principais contratos (`src/types/`):
- **`Agendamento`** (`src/types/agendamento.ts`):
  ```ts
  export interface Agendamento {
    id?: number;
    documentId?: string;
    data: string;       // Formato ISO: "YYYY-MM-DD"
    horario: string;    // Formato: "HH:mm" ou "HH:mm:ss.000"
    status_id: Status | null;
    cliente_id: Cliente | null;
  }
  ```
- **`Cliente`** (`src/types/cliente.ts`):
  ```ts
  export interface Cliente {
    id?: number;
    documentId?: string;
    nome: string;
    telefone: string;   // Apenas dígitos ou mascarado conforme o ponto do fluxo
  }
  ```
- **`Status`** (`src/types/status.ts`):
  ```ts
  export interface Status {
    id?: number;
    documentId?: string;
    nome: string;
  }
  ```
- **`Notificacao`** (`src/types/notificacao.ts`):
  ```ts
  export interface Notificacao {
    id: number;
    documentId: string;
    tipo: TipoNotificacao; // 'CORTE_PROXIMO'
    lida: boolean;
    criadaEm: string;
    agendamento: Agendamento | null;
  }
  ```

### 1.3 Mappers de Dados (Sanitização DTO -> Domínio)

Para proteger a interface contra campos nulos, formatos inconsistentes e variações de timestamp do backend, o projeto utiliza funções mappers puras:

```ts
// src/types/agendamento.ts
export function mapAgendamento(data: Agendamento): Agendamento {
  return {
    id: data.id,
    documentId: data.documentId,
    data: data.data,
    horario: data.horario,
    status_id: data.status_id ?? null,
    cliente_id: data.cliente_id ?? null,
  };
}

// src/types/notificacao.ts
export function mapNotificacao(dto: Notificacao & { createdAt?: string }): Notificacao {
  return {
    id: dto.id,
    documentId: dto.documentId,
    tipo: dto.tipo,
    lida: dto.lida,
    criadaEm: dto.criadaEm ?? dto.createdAt ?? '',
    agendamento: dto.agendamento ? mapAgendamento(dto.agendamento) : null,
  };
}
```

---

## 2. Camada de Acesso a Dados (`src/services/api.ts`)

A comunicação de rede utiliza a API nativa `fetch` encapsulada em duas funções principais:

### 2.1 `apiFetch(endpoint, options)`
- Responsável por montar a URL absoluta utilizando `process.env.NEXT_PUBLIC_API_URL`.
- Define o cabeçalho `Content-Type: application/json`.
- Anexa o token de acesso obtido via `obterToken()` no cabeçalho `Authorization: Bearer <token>`.
- Configura `credentials: 'include'` para tráfego seguro de cookies HTTP-Only de renovação.
- **Mecanismo de Interceptação e Auto-Retry no 401**:
  Caso o servidor retorne HTTP 401, `apiFetch` invoca `refreshAccessToken()`, armazena o novo token e repete a requisição original com o novo token de forma transparente para quem chamou. Se a segunda tentativa falhar, aciona `encerrarSessao()`.

### 2.2 `apiGet<T>(endpoint)`
- Simplificação para requisições do tipo GET com deserialização JSON e lançamento de erro padrão quando `!response.ok`.

---

## 3. Padrões de Consulta e Mutação REST

### 3.1 Consultas com População e Filtros Strapi
- Em `src/services/agendamentos.service.ts`:
  Uso de `populate=*` para carregar as relações aninhadas (`cliente_id` e `status_id`):
  ```ts
  const json = await apiGet<StrapiCollectionResponse<Agendamento>>('/api/agendamentos?populate=*');
  ```
- Em `src/services/notificacoes.service.ts`:
  Uso de filtros estruturados por data e população aninhada profunda:
  ```ts
  const query = [
    `filters[agendamento][data][$eq]=${dataISO}`,
    'populate[agendamento][populate]=*',
    'sort[0]=createdAt:desc',
    `pagination[pageSize]=${PAGE_SIZE}`,
  ].join('&');
  ```

### 3.2 Formatação de Mutações (Envelope `{ data: ... }`)
O Strapi exige que mutações POST e PUT envolvam as propriedades dentro de uma chave `data`. A camada de serviços encapsula essa exigência:

```ts
// src/services/agendamentos.service.ts
export async function editarAgendamento(agendamento: Agendamento) {
  const payload = {
    data: {
      data: agendamento.data,
      horario: formatarHorario(agendamento.horario),
      status_id: agendamento.status_id?.id,
      cliente_id: agendamento.cliente_id?.id,
    },
  };
  return apiFetch(`/api/agendamentos/${agendamento.documentId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
```

---

## 4. Validação de Dados

O projeto adota uma abordagem de **validação pragmática sem bibliotecas externas** (sem Zod, Yup ou Joi):

1. **Validação Estrutural / Tipagem**:
   - Garantida em tempo de compilação pelas interfaces TypeScript em `src/types/`.
2. **Validação de Regras de Negócio e Entrada de Formulários**:
   - Cada formulário implementa uma função pura `validar(campos)` que retorna um dicionário de erros tipado:
     ```ts
     // src/components/Clientes/ClienteModal/index.tsx
     interface FormErros {
       nome?: string;
       telefone?: string;
     }

     function validar(dados: FormValores): FormErros {
       const novosErros: FormErros = {};
       if (!dados.nome.trim()) novosErros.nome = 'O nome é obrigatório';
       if (!dados.telefone.trim()) {
         novosErros.telefone = 'O telefone é obrigatório';
       } else if (!telefoneValido(dados.telefone)) {
         novosErros.telefone = 'Informe um telefone válido com DDD (10 ou 11 dígitos)';
       }
       return novosErros;
     }
     ```
3. **Validação nos Utilitários**:
   - `src/utils/cpf.ts`: `cpfValido(valor)` verifica quantidade de 11 dígitos numéricos.
   - `src/utils/phone.ts`: `telefoneValido(valor)` valida comprimentos de 10 ou 11 dígitos.

---

## 5. Tratamento de Erros

A aplicação utiliza um fluxo de extração de mensagens de erro amigáveis para exibir ao usuário:

### 5.1 Função `obterMensagemErro` (`src/services/api.ts`)
Extrai a mensagem de erro estruturada do Strapi (`json?.error?.message`) ou retorna um texto padrão de contingência:

```ts
export async function obterMensagemErro(
  response: Response,
  mensagemPadrao: string,
): Promise<string> {
  const texto = await response.text();
  if (!texto) return mensagemPadrao;
  try {
    const json = JSON.parse(texto);
    return json?.error?.message ?? mensagemPadrao;
  } catch {
    return texto || mensagemPadrao;
  }
}
```

### 5.2 Apresentação de Erros na Interface
- Em formulários: Mensagens abaixo dos campos específicos ou alerta geral com `role="alert"`.
- Em telas de listagem: Componente unificado `<ErrorState description={error} onRetry={recarregar} />`.
- Em ações de mutação: Toast de erro através de `toast.erro(mensagem)`.

---

## 6. Estratégia de Caching e Gerenciamento de Estado

A aplicação **não utiliza bibliotecas de gerenciamento de estado global** (como Redux, Zustand ou React Query). O gerenciamento de estado adota os seguintes padrões nativos do React:

### 6.1 Caching e Filtragem Local em Memória
- Em `src/hooks/useAgendamentos.ts`:
  A lista de agendamentos é carregada uma única vez do servidor. O filtro selecionado pelo usuário (período, status, busca por texto) é aplicado localmente via `useMemo` com a função pura `aplicarFiltros`:
  ```ts
  const agendamentos = useMemo(
    () => (filtros ? aplicarFiltros(todos, filtros) : todos),
    [todos, filtros],
  );
  ```
  *Motivação Arquitetural*: Mantém resposta instantânea sem latência de rede no uso móvel do painel.

### 6.2 Polling de Notificações com Pausa em Aba Oculta
- Em `src/hooks/useNotificacoes.ts`:
  Consulta periódica a cada 60 segundos com verificação de visibilidade da página para poupar recursos:
  ```ts
  const intervalo = setInterval(() => {
    if (document.visibilityState === 'visible') {
      carregar({ silencioso: true });
    }
  }, INTERVALO_POLLING_MS);
  ```

### 6.3 Invalidação e Recarga via Contador de Versão
- Padrão recorrente nos hooks (`useAgendamentos`, `useClientes`, `useNotificacoes`):
  ```ts
  const [versao, setVersao] = useState(0);
  const recarregar = useCallback(() => setVersao((v) => v + 1), []);
  ```
  Ao executar `recarregar()`, o gatilho de dependência do `useEffect` roda novamente e sincroniza os dados do servidor.

---

## 7. Inconsistências e Recomendações

1. **Inconsistência de Estrutura de Payload em `status.service.ts`**:
   - Em `criarStatus` e `editarStatus` (`src/services/status.service.ts`), o código envia:
     ```ts
     body: JSON.stringify({ data }) // Onde data já contém { status: Status } -> gera { data: { status: { ... } } }
     ```
   - Enquanto em `clientes.service.ts` e `agendamentos.service.ts`, o envio é plano:
     ```ts
     body: JSON.stringify({ data: { nome: ..., telefone: ... } })
     ```
   - *Recomendação*: Uniformizar todos os serviços para o formato plano esperado pelo Strapi (`{ data: { ...campos } }`).
2. **Recomendação: Adoção de Biblioteca de Caching Remoto para Projetos Maiores**:
   - Embora o padrão de versão + `useEffect` atenda bem ao escopo atual, projetos de maior complexidade se beneficiam de soluções como TanStack Query (React Query) ou SWR para desduplicação de requisições, revalidação em foco e cache compartilhado entre telas.

