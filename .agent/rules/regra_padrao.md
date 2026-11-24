# Padrões e regras deste repositório

Este documento define os padrões obrigatórios de desenvolvimento do projeto `ordem-os-front-end`.

Todo código novo ou alterado deve respeitar estas diretrizes, priorizando consistência, legibilidade, manutenibilidade, reutilização e simplicidade.

## 1. Comandos do projeto

Utilize os seguintes comandos para validar as alterações:

- **Lint:** `npm run lint`
- **Typecheck:** `npm run typecheck`
- **Prettier:** `npm run format`
- **Build:** `npm run build`

Antes de concluir uma implementação, execute as verificações pertinentes e corrija os problemas introduzidos pelas alterações.

## 2. Regras obrigatórias

- Não utilizar `any` em código TypeScript novo. Prefira tipagem explícita, generics ou `unknown` quando apropriado.
- Toda rota ou funcionalidade nova que envolva comportamento relevante deve possuir testes de integração.
- Não duplicar lógica que possa ser reutilizada por meio de funções, hooks ou componentes.
- Não adicionar abstrações desnecessárias ou criar estruturas excessivamente complexas.
- Não ignorar erros de TypeScript, ESLint ou avisos relevantes do build.
- Não utilizar comentários para explicar código que pode ser escrito de maneira mais clara.
- Não utilizar `@ts-ignore` ou `@ts-nocheck` para contornar problemas de tipagem.
- Não utilizar `eslint-disable` sem justificativa técnica.
- Não deixar código morto, imports não utilizados ou arquivos desnecessários.

## 3. Arquitetura e organização

- Respeitar a arquitetura existente do projeto.
- Organizar o código por funcionalidades (feature-based), mantendo separação entre responsabilidades técnicas.
- Manter componentes, hooks, serviços, interfaces e utilitários em seus respectivos diretórios.
- Componentes devem ser responsáveis pela apresentação e interação visual.
- Regras de negócio devem ficar fora dos componentes sempre que possível.
- Não criar arquivos genéricos quando a responsabilidade pertence claramente a uma funcionalidade específica.
- Priorizar componentes pequenos, coesos e com responsabilidades bem definidas.
- Evitar componentes excessivamente grandes ou com muitas responsabilidades.

## 4. React e Next.js

- Priorizar Server Components sempre que não houver necessidade de interatividade no cliente.
- Utilizar Client Components (`"use client"`) somente quando necessário.
- Evitar o uso desnecessário de `useEffect` e `useState`.
- Não utilizar efeitos para resolver problemas que podem ser tratados diretamente durante a renderização ou por mecanismos próprios do React.
- Evitar prop drilling excessivo.
- Utilizar hooks personalizados para encapsular lógicas reutilizáveis.
- Respeitar os padrões de roteamento e os layouts existentes do Next.js.
- Evitar chamadas HTTP diretamente dentro de componentes de apresentação.

## 5. TypeScript e tipagem

- Utilizar tipagem explícita nas fronteiras da aplicação.
- Evitar o uso de `any`, casts desnecessários e coerções inseguras.
- Não utilizar interfaces ou tipos duplicados para representar a mesma estrutura.
- Manter os tipos próximos da funcionalidade à qual pertencem.
- Utilizar `type` e `interface` de maneira consistente.
- Tratar valores opcionais e nulos explicitamente.
- Não utilizar `as` para simplesmente silenciar erros de tipagem.

## 6. Comunicação com a API

- Centralizar as configurações e a comunicação HTTP na camada de /services.
- Não duplicar configurações de requisições em diferentes funcionalidades.
- Utilizar a instância HTTP compartilhada do projeto.
- Manter os endpoints organizados por funcionalidade.
- Tipar os parâmetros, respostas e payloads das requisições.
- Tratar erros HTTP de maneira consistente.
- Não implementar tratamento de autenticação isoladamente em cada componente.
- Não utilizar URLs de API diretamente no código. Respeitar as variáveis de ambiente existentes.
- Não adicionar valores fictícios ou dados mockados em funcionalidades que dependem da API real.

## 7. Gerenciamento de estado e requisições

- Utilizar TanStack Query para gerenciamento de estado assíncrono e requisições à API.
- Evitar armazenar manualmente em estados locais dados que já são gerenciados pelo TanStack Query.
- Definir corretamente `queryKey` e políticas de invalidação de cache.
- Utilizar mutations para operações de criação, atualização e exclusão.
- Evitar requisições duplicadas e invalidações desnecessárias.
- Utilizar estado local somente para informações relacionadas à interface e interações locais.

## 8. Formulários e validações

- Utilizar React Hook Form para gerenciamento de formulários.
- Utilizar Zod para validação e definição de schemas.
- Evitar duplicar regras de validação entre componentes.
- Manter os schemas organizados e reutilizáveis quando necessário.
- Exibir mensagens de validação claras e em português.
- Tratar estados de carregamento, sucesso e erro durante o envio.
- Não confiar exclusivamente nas validações do frontend. A API também deve validar os dados.

## 9. Interface e estilização

- Preservar a identidade visual e os padrões de interface existentes.
- Utilizar os componentes e padrões já existentes antes de criar novos.
- Priorizar reutilização dos componentes do projeto.
- Respeitar os tokens de design e os padrões de estilização existentes.
- Não introduzir bibliotecas de estilização adicionais.
- Manter responsividade para dispositivos móveis, tablets e desktops.
- Garantir acessibilidade básica, incluindo labels, navegação por teclado e estados de foco.
- Evitar alterações visuais não solicitadas durante refatorações técnicas.

## 10. Autenticação e autorização

- Respeitar a arquitetura centralizada de autenticação e gerenciamento de sessão.
- Não implementar mecanismos paralelos de armazenamento ou renovação de sessão.
- Não acessar ou manipular tokens diretamente em componentes de apresentação.
- Tratar respostas HTTP 401 e 403 conforme as responsabilidades definidas na camada de autenticação.
- Não presumir permissões do usuário exclusivamente com base na interface.
- Respeitar os perfis e as permissões definidos pela API.

## 11. Testes e qualidade

- Toda rota ou funcionalidade nova com comportamento relevante deve possuir testes de integração.
- Testar cenários de sucesso, erro e estados de carregamento quando aplicável.
- Testar regras de negócio e comportamentos importantes.
- Não escrever testes que dependam de dados reais de produção.
- Evitar testes frágeis, excessivamente acoplados à implementação interna dos componentes.
- Não remover ou enfraquecer testes existentes apenas para fazer uma implementação passar.

## 12. Dependências

- Não instalar dependências sem justificativa técnica.
- Antes de adicionar uma biblioteca, verificar se o projeto já possui recursos capazes de resolver o problema.
- Priorizar dependências já utilizadas no projeto.
- Evitar bibliotecas que aumentem significativamente o bundle sem benefício proporcional.
- Não atualizar dependências sem avaliar possíveis impactos de compatibilidade.

## 13. Convenções de código

- Utilizar nomes descritivos e consistentes.
- Manter nomenclatura de domínio em português, seguindo o padrão já estabelecido no projeto.
- Utilizar nomes de componentes em PascalCase.
- Utilizar hooks personalizados com prefixo `use`.
- Utilizar funções e variáveis em camelCase.
- Evitar abreviações que prejudiquem a compreensão.
- Manter consistência com os padrões dos arquivos existentes.

## 14. Diretrizes para ferramentas de IA

Ao implementar qualquer tarefa:

1. Analisar a estrutura existente antes de modificar arquivos.
2. Identificar padrões já utilizados no projeto.
3. Reutilizar componentes, hooks, serviços e utilitários existentes quando possível.
4. Evitar refatorações fora do escopo solicitado.
5. Não modificar funcionalidades existentes sem necessidade.
6. Não inventar endpoints, contratos ou comportamentos da API.
7. Em caso de dúvida sobre regras de negócio, solicitar esclarecimento antes de assumir comportamentos.
8. Apresentar um resumo das alterações realizadas.
9. Informar os testes e verificações executados e seus resultados.
10. Não afirmar que uma verificação passou sem realmente executá-la.