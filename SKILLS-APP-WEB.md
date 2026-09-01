# 🚀 SKILLS APP WEB

**Stack:** React, Next.js, Vue, Svelte, Node.js, TypeScript  
**Versão:** 30/07/2026  
**Skills:** 2 (Senior Architect + UI/UX Pro Max)

---

## 📌 QUICK REFERENCE

| Necessidade | Skill | Comando | Resultado |
|-------------|-------|---------|-----------|
| **Arquitetura** | Senior Architect | "Projeta a arquitetura do app" | Diagrama + componentes + fluxo |
| **Design** | UI/UX Pro Max | "Cria dashboard com dark mode" | CSS + componentes + paleta |
| **Code Review** | Senior Architect | "Revisa esse código" | Análise de bugs, performance, SOLID |
| **Componente UI** | UI/UX Pro Max | "Cria um modal de confirmação" | HTML/React/Vue pronto |
| **Performance** | Senior Architect | "App tá lento, por onde começo?" | Diagnóstico + otimizações |

---

## 🏗️ SKILL 1: SENIOR SOFTWARE ARCHITECT

### Quando usar

- ✅ Planejar arquitetura de novo projeto
- ✅ Revisar código antes de mergear
- ✅ Identificar gargalos de performance
- ✅ Decisões técnicas (banco de dados, autenticação, cache)
- ✅ Estruturar microsserviços ou APIs
- ✅ Melhorar escalabilidade

### Fluxo de Resposta

1. Analise o problema antes de responder
2. Explique o motivo da solução escolhida
3. Liste vantagens e desvantagens
4. Apresente alternativas
5. Cite trade-offs
6. Forneça exemplos práticos
7. Quando possível mostre diagramas em Mermaid
8. Gere código limpo seguindo Clean Code
9. Utilize nomenclaturas consistentes
10. Evite respostas superficiais

### Conhecimentos-Chave para App Web

**Arquitetura & Patterns**
- Clean Architecture
- Hexagonal Architecture
- Onion Architecture
- SOLID (SRP, OCP, LSP, ISP, DIP)
- Design Patterns (Factory, Singleton, Observer, etc)
- DDD (Domain-Driven Design)

**Frontend**
- Component-based architecture
- State management (Redux, Zustand, Context API, Pinia)
- Server-side rendering (Next.js)
- Client-side rendering
- Micro-frontend architecture

**Backend**
- REST APIs
- GraphQL
- gRPC
- Webhooks
- Authentication (OAuth2, JWT, OpenID Connect)
- Authorization (RBAC, ABAC)

**Data & Storage**
- Relational databases (PostgreSQL, MySQL)
- NoSQL (MongoDB, Firebase)
- Caching (Redis)
- Message queues (Kafka, RabbitMQ)
- Event Sourcing
- CQRS

**DevOps & Infrastructure**
- Docker
- Kubernetes
- CI/CD (GitHub Actions, GitLab CI)
- Monitoring (Prometheus, Grafana, Datadog)
- Logging (ELK Stack)
- Tracing (OpenTelemetry)

**Testing**
- Unit tests (Jest, Vitest)
- Integration tests
- E2E tests (Cypress, Playwright)
- TDD
- SonarQube

### Quando revisar código para App Web

Procure por:
- ✅ Bugs e vulnerabilidades
- ✅ Vazamento de memória
- ✅ Re-renders desnecessários
- ✅ N+1 queries
- ✅ Falta de tratamento de erro
- ✅ Violações de SOLID
- ✅ Código duplicado
- ✅ Acoplamento excessivo
- ✅ Segurança (XSS, CSRF, SQL Injection)
- ✅ Performance (bundle size, lazy loading)

### Exemplo de Prompt para App Web

```
Preciso revisar essa arquitetura de app React:
- Frontend: React + Redux + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: JWT

Pontos específicos:
1. State management está escalável?
2. API está bem estruturada?
3. Segurança tá OK?
```

---

## 🎨 SKILL 2: UI/UX PRO MAX

### Quando usar

- ✅ Criar novo projeto/página
- ✅ Criar componente UI (botão, modal, card, tabela)
- ✅ Escolher paleta de cores
- ✅ Definir tipografia
- ✅ Revisar design de interface
- ✅ Implementar dark mode
- ✅ Otimizar UX mobile
- ✅ Criar gráficos/data visualizations

### Stacks Suportados

`.html`, `.tsx`, `.jsx`, `.vue`, `.svelte`

### Domínios Disponíveis

| Domínio | Quando usar | Exemplos |
|---------|------------|----------|
| `style` | Escolher visual da app | Glassmorphism, minimalism, dark mode, brutalism, neumorphism |
| `color` | Definir paleta de cores | SaaS, fintech, healthcare, e-commerce |
| `typography` | Escolher fontes | Elegant, playful, professional, modern |
| `component` | Padrões de componentes | Botões, modais, navbars, cards, tabelas |
| `ux` | Boas práticas UX | Animação, acessibilidade, loading states |
| `react` | Performance em React | Memo, useCallback, useMemo, code splitting |
| `chart` | Gráficos & data viz | Trends, comparações, timelines, funnels |

### Design System para App Web

Sempre comece assim:

```
Tipo de app: SaaS / E-commerce / Admin / Social
Público-alvo: Consumidores / Desenvolvedores / Empresas
Vibe: Moderno / Clássico / Playful / Minimalista
Keywords: Dark mode, Glassmorphism, Real-time, etc
```

### Estilos Disponíveis

- **Minimalism** — Clean, spacious, focus on content
- **Glassmorphism** — Frosted glass effect, modern
- **Claymorphism** — Soft, organic shapes
- **Brutalism** — Raw, bold, architectural
- **Neumorphism** — Soft UI, embossed look
- **Dark Mode** — Dark themes com contraste adequado
- **Bento Grid** — Modern grid-based layouts

### Checklist Pré-Entrega

- [ ] Sem emojis como ícones (usar SVG)
- [ ] Todos os ícones de uma família consistente
- [ ] Elementos clicáveis têm feedback visual (hover, active)
- [ ] Touch targets ≥ 44×44pt (iOS) ou ≥ 48×48dp (Android)
- [ ] Contraste de texto primário ≥ 4.5:1 em claro E escuro
- [ ] Contraste de texto secundário ≥ 3:1
- [ ] Safe areas respeitadas (notches, barras de sistema)
- [ ] Espaçamento em ritmo de 4/8dp
- [ ] Testado em tela pequena (375px) e landscape
- [ ] Dark mode funcionando independentemente
- [ ] Loading states em todas as ações async
- [ ] Error states com mensagens úteis
- [ ] Animações não prejudicam performance
- [ ] Sem flashs or janky scrolling

### Componentes Essenciais para Web

**Layout**
- Header/Navbar
- Sidebar/Navigation
- Footer
- Grid/Flex layouts
- Responsive containers

**Forms**
- Text inputs
- Checkboxes/Radios
- Selects/Dropdowns
- Textareas
- Date pickers
- File uploads
- Form validation

**Feedback**
- Alerts
- Toasts/Notifications
- Modals
- Drawers
- Tooltips
- Badges
- Progress bars

**Data Display**
- Tables
- Cards
- Lists
- Chips
- Tags
- Breadcrumbs

**Navigation**
- Buttons (variants: primary, secondary, ghost)
- Links
- Tabs
- Pagination
- Stepper

### Exemplo de Prompt

```
Cria um dashboard de analytics com:
- Header com logo + user menu
- Sidebar com navegação
- Cards de KPI
- Gráfico de trend
- Tabela de dados
- Dark mode suportado

Stack: React + TypeScript + Tailwind
Vibe: Moderno, SaaS, profissional
```

---

## 🔄 FLUXO INTEGRADO: ARQUITETURA + DESIGN

### Projeto Novo do Zero

**Passo 1: Senior Architect**
```
"Projeta a arquitetura de um app React + Node que tem:
- Autenticação com JWT
- Dashboard em tempo real
- Relatórios complexos
- Integração com 3 APIs externas"
```
→ Resultado: Diagrama de componentes, fluxo de dados, banco de dados

**Passo 2: UI/UX Pro Max**
```
"Design system pro dashboard do passo anterior:
- Paleta de cores (SaaS moderno)
- Tipografia (profissional)
- Componentes principais (card KPI, gráfico, tabela)
- Dark mode"
```
→ Resultado: CSS + componentes React prontos

### Estrutura de Pasta Recomendada

```
src/
├── components/
│   ├── common/           (Button, Card, Modal)
│   ├── features/         (Dashboard, Reports)
│   └── layout/           (Header, Sidebar, Footer)
├── pages/
├── hooks/
├── context/              (Auth, Theme, User)
├── services/             (API calls)
├── utils/
├── styles/
│   └── theme.ts          (Design tokens)
├── types/
└── tests/
```

---

## 🚨 Quando Chamar Cada Skill

### Cenário 1: Revisar Pull Request
**Use:** Senior Architect
```
"Revisa esse PR:
- Mudança em state management
- Nova tela de autenticação
- Otimização de queries"
```

### Cenário 2: Implementar Nova Feature
**Use:** Ambas em sequência
1. **Senior Architect:** "Projeta a feature X"
2. **UI/UX Pro Max:** "Design pro backend da feature X"

### Cenário 3: Performance tá ruim
**Use:** Senior Architect
```
"App tá lento:
- React re-renders demais
- Bundle size > 500kb
- Queries ao DB é N+1"
```

### Cenário 4: Dark Mode ou novo estilo
**Use:** UI/UX Pro Max
```
"Implementa dark mode:
- Mantém design system
- Suporta toggle no header
- Salva preference no localStorage"
```

---

## 📋 Checklist de Qualidade App Web

### Backend
- [ ] Autenticação e autorização implementadas
- [ ] Validação de entrada (backend, não só frontend)
- [ ] Rate limiting em APIs públicas
- [ ] CORS configurado corretamente
- [ ] Logging de erros centralizado
- [ ] Monitora performance de queries
- [ ] Backup e disaster recovery
- [ ] Documentação da API (Swagger/OpenAPI)

### Frontend
- [ ] Performance: Lighthouse score ≥ 90
- [ ] Bundle size otimizado (< 200kb JS)
- [ ] Code splitting implementado
- [ ] Lazy loading de imagens
- [ ] SSR ou Static generation (se Next.js)
- [ ] PWA ready (manifesto, service worker)
- [ ] SEO minimamente implementado (meta tags)
- [ ] Acessibilidade WCAG AA

### Ambos
- [ ] TypeScript stricto
- [ ] Testes: >70% coverage
- [ ] CI/CD pipeline funcionando
- [ ] Environment variables seguros
- [ ] Secrets não commitados
- [ ] Git flow: main/develop/feature branches

---

## 🎯 Triggers Comuns

```
"Cria um formulário de login"
→ UI/UX Pro Max

"Qual banco de dados escolher?"
→ Senior Architect

"Por que o app tá lento?"
→ Senior Architect + Performance audit

"Implementa dark mode"
→ UI/UX Pro Max

"Projeta autenticação OAuth2"
→ Senior Architect

"Cria componente de tabela com paginação"
→ UI/UX Pro Max

"Refatora esse código"
→ Senior Architect

"Qual paleta de cores combina com fintech?"
→ UI/UX Pro Max
```

---

## 💡 Dicas Finais

1. **Sempre comece pela arquitetura** antes de escrever código
2. **Design system primeiro**, componentes depois
3. **Mobile first** — teste em 375px antes de desktop
4. **Acessibilidade não é opcional** — WCAG AA é mínimo
5. **Performance importa** — Lighthouse 90+ é possível
6. **TypeScript stricto** — menos bugs em produção
7. **Testes não são overhead** — evitam retrabalho
8. **Documentação vive** — coloca exemplos reais no README

---

**🎯 Pronto para desenvolver apps web profissionais!**
