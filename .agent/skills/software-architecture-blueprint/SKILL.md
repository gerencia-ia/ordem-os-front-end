---
name: software-architecture-blueprint
description: Referência técnica de arquitetura de software para aplicações frontend modernas (Next.js App Router + React 19). Orienta a organização de diretórios, separação rigorosa de camadas, contratos de dados, autenticação com interceptor de auto-refresh, gerenciamento de estado e convenções de desenvolvimento, excluindo deliberadamente identidade visual e design system.
---

# Software Architecture Blueprint

Este blueprint consolida os padrões, decisões e convenções arquiteturais extraídos diretamente do projeto `agenda-next-app`. Ele serve como guia para auditar, estruturar e orientar a arquitetura de **aplicações frontend**, garantindo separação de responsabilidades, previsibilidade, manutenibilidade e segurança no cliente sem dependências desnecessárias.

---

## 1. Objetivo da Skill

Fornecer a desenvolvedores e agentes de IA uma base técnica comprovada para arquitetar aplicações web no ecossistema React / Next.js com foco estrito no **frontend**, demonstrando:
- Como organizar módulos e diretórios.
- Como isolar a camada de interface do acesso a dados e regras de negócio.
- Como modelar o ciclo de vida de autenticação no cliente com renovação transparente de tokens.
- Como auditar a segurança de autenticação no frontend (concorrência, armazenamento, mitigação de XSS e logout).
- Como documentar dependências e contratos de segurança esperados da API (cookies, rotação de tokens, anti-IDOR).
- Como orquestrar estado e cache em memória de forma enxuta.
- Como evoluir o código mantendo limites claros entre camadas.

---

## 2. Escopo e Fronteiras: O Que Fazer e o Que NÃO Fazer

> [!IMPORTANT]
> **Separação Obrigatória entre Arquitetura de Software e Identidade Visual**
> 
> Esta skill documenta **exclusivamente como o software é estruturado, organizado e executado internamente**. Toda e qualquer instrução referente a "como a interface deve parecer" pertence a outras skills (ex: `fintech-visual-system` ou `styled-components-implementation`).

### Quando Utilizar esta Skill:
- Ao estruturar uma nova aplicação frontend ou refatorar a arquitetura de uma existente.
- Ao definir a organização de pastas, camadas e matriz de dependências entre módulos.
- Ao implementar ou auditar o fluxo de autenticação no cliente, renovação de tokens (auto-refresh) e proteção de rotas para UX.
- Ao delimitar as responsabilidades de segurança do frontend em relação aos contratos exigidos da API.
- Ao criar novos módulos, serviços de API, custom hooks ou utilitários de domínio.
- Ao avaliar se uma biblioteca externa é realmente necessária ou se uma implementação nativa em TypeScript é mais adequada.

### Quando NÃO Utilizar esta Skill:
- Para escolher paletas de cores, tokens visuais, fontes ou tipografia.
- Para definir espaçamentos visuais, raios de borda, sombras ou animações.
- Para estilizar botões, cartões, formulários ou tabelas.
- Para orientar convenções visuais de Tailwind CSS, Styled-components ou CSS Modules.
- Para implementar regras de negócio internas ou infraestrutura exclusiva de backend (banco de dados, rate limiting em servidores, queries ORM).

---

## 3. Princípios Arquiteturais Fundamentais

1. **Arquitetura Modular em Camadas Unidirecionais**:
   A comunicação flui da apresentação para os hooks, dos hooks para os serviços e dos serviços para o cliente HTTP base. A interface nunca realiza chamadas de rede arbitrárias sem passar por contratos estabelecidos.
2. **Minimalismo e Autossuficiência de Dependências**:
   Primitivas do cotidiano (ícones, toasts, manipulação de datas ISO, captura de foco em modais, máscaras e cliente HTTP) são resolvidas com TypeScript e APIs nativas do navegador/React, reduzindo o bundle e eliminando conflitos de pacotes de terceiros.
3. **Mapeamento Explícito de Contratos (DTO -> Domínio)**:
   Respostas brutas de APIs externas (como Strapi) são sanitizadas por funções mappers puras antes de serem consumidas pela UI, evitando quebras por campos nulos ou alterações sutis de payload.
4. **Resiliência e Prevenção de Efeitos Colaterais**:
   Hooks assíncronos implementam prevenção de *race conditions* no desmonte com flags de cancelamento (`ativo`), recarga manual via versões e verificação de visibilidade de aba para pausar tarefas em segundo plano.
5. **Autenticação Híbrida e Concorrência no Cliente**:
   Sessão gerenciada com renovação transparente interceptada no cliente HTTP via *Single-Flight Promise*, com checagem de suporte a Web Locks API e reavaliação de token para ambientes multi-aba.
6. **Delimitação Estrita de Segurança no Frontend**:
   A proteção de rotas no cliente (`layout.tsx`) e middlewares de borda são tratados como controle de fluxo e UX. A segurança de autorização sobre recursos (anti-IDOR/BOLA) e rate limiting efetivo são documentados como dependências e contratos obrigatórios da API, nunca como responsabilidade de implementação do frontend.

---

## 4. Classificação do Conhecimento

Para garantir fidelidade técnica, as decisões documentadas estão categorizadas em:

- **Padrão Existente**: Prática comprovada no código-fonte atual (ex: Next.js App Router, interceptor no `apiFetch`, mappers de agendamento, SSR registry de styled-components).
- **Convenção Identificada**: Hábito recorrente da equipe em diferentes arquivos (ex: co-localização de `styles.ts`, convenção de nomes em camelCase para serviços, invalidação de hooks por `versao`).
- **Recomendação**: Melhoria técnica proposta para novos projetos (ex: adoção de Vitest/Playwright, criação de `.env.example`, migração de hard reload para navegação SPA, uso de BFF com cookies HttpOnly em stacks fullstack).
- **Inconsistência / Fragilidade Registrada**: Divergência real ou gap de segurança existente no código que não deve ser copiado cegamente (ex: concorrência no 401 sem trava mutex; logout incompleto sem chamada de revogação à API; Tailwind instalado mas não utilizado; `src/services/config.ts` ignorado por `api.ts`).

---

## 5. Índice de Documentos de Referência

Aprofunde cada aspecto da arquitetura consultando os módulos técnicos especializados:

1. [**Estrutura e Organização do Projeto**](references/project-structure.md)
   *Árvore de diretórios, responsabilidade de cada pasta, convenções de arquivos e agrupamento por domínio.*
2. [**Padrões Arquiteturais da Aplicação**](references/architecture-patterns.md)
   *Classificação formal do padrão (Layered Modular), diagrama de fluxo, limites de acoplamento e reuso.*
3. [**Camadas e Responsabilidades**](references/layers-and-responsibilities.md)
   *Detalhamento de cada camada funcional e matriz de governança de dependências (quem pode importar quem).*
4. [**Gerenciamento de Dados**](references/data-management.md)
   *Integração com backend Strapi, contratos, envelopes DTO, mappers, validação pura e cache local em memória.*
5. [**Autenticação e Autorização (Mecânica Operacional)**](references/authentication-and-authorization.md)
   *Funcionamento operacional do modelo dual-token, interceptor 401, barramento entre abas e guarda de rotas via `useSyncExternalStore`.*
6. [**Segurança de Autenticação e Checklist Frontend**](references/authentication-security.md)
   *Auditoria técnica frontend, delimitação de responsabilidades (Frontend vs. API), Single-Flight, Web Locks com fallback, mitigação de XSS e checklist de produção.*
7. [**Configuração e Infraestrutura**](references/configuration-and-infrastructure.md)
   *Variáveis de ambiente, compilador Next.js, script inline anti-flicker e diagnóstico de contêineres/CI.*
8. [**Dependências e Integrações**](references/dependencies-and-integrations.md)
   *Inventário de pacotes, análise da dependência fantasma (Tailwind), integrações (Strapi, wa.me) e filosofia zero-dependency.*
9. [**Testes, Qualidade e Manutenção**](references/testing-and-quality.md)
   *Diagnóstico do estado de qualidade, Flat Config do ESLint v9, Prettier e plano de adoção de Vitest/Playwright.*
10. [**Convenções de Desenvolvimento e Extensão**](references/development-conventions.md)
    *Passo a passo arquitetural para criar novas funcionalidades, padrões de acessibilidade e guia para outros agentes.*

---

## 6. Como Outro Agente Deve Aplicar esta Skill em Novos Projetos

Ao atuar em outro workspace ou criar um projeto do zero, não copie cegamente este projeto. Siga o seguinte método:

1. **Analise Antes de Propor**: Inspecione o `package.json`, o arquivo de rotas e a estrutura de pastas do projeto antes de sugerir mudanças.
2. **Respeite o Ecossistema Existente**: Se o projeto usa Vite em vez de Next.js, mantenha os princípios de camadas (serviços -> hooks -> componentes), adaptando a camada de roteamento para React Router ou TanStack Router.
3. **Audite a Segurança com Foco no Frontend**:
   - Não imponha Next.js, BFF, cookies ou `localStorage` sem avaliar a arquitetura do projeto.
   - Trate guardas de rota como controle de UX e documente a dependência de autorização da API para dados sensíveis.
   - Utilize *Single-Flight Promise* para concorrência local e verifique suporte a Web Locks API caso o contrato da API utilize rotação estrita sem tolerância.
   - Implemente higiene ativa contra XSS (evitar `dangerouslySetInnerHTML`, sanitizar com DOMPurify, proibir scripts dinâmicos, mascarar logs).
4. **Evite Dependências Desnecessárias**: Questione qualquer sugestão de biblioteca externa quando utilitários simples em TypeScript nativo resolverem o problema com mais leveza e controle.
5. **Mantenha os Contratos Rígidos**: Defina sempre as interfaces de dados e mappers antes de construir formulários ou componentes de visualização.
6. **Isole Mutações e Efeitos**: Nunca dispare mutações HTTP diretamente no meio de funções de renderização ou manipuladores de eventos de componentes visuais sem passar pela camada de serviços.
