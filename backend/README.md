# EstéticaPro — Backend

API do sistema EstéticaPro (clínica de estética). Node.js + TypeScript + Express + Prisma + PostgreSQL.

Cobre autenticação (JWT) e as entidades principais da clínica: clientes, profissionais, tratamentos e agendamentos (com checagem de conflito de horário por profissional) e um endpoint de resumo para o dashboard.

## Rodando localmente

```bash
cp .env.example .env
docker compose up -d          # sobe o Postgres local
npm install
npm run prisma:migrate        # cria as tabelas
npm run prisma:seed           # popula dados de demonstração
npm run dev                   # http://localhost:5000
```

Login de demonstração criado pelo seed: `admin@esteticapro.com` / `esteticapro123`.

Endpoints disponíveis (todos sob `/api`, exceto `/health`, exigem `Authorization: Bearer <token>`):

- `GET /health` — healthcheck simples
- `GET /health/db` — healthcheck com checagem de conexão ao Postgres
- `POST /api/auth/register` — `{ name, email, password }`
- `POST /api/auth/login` — `{ email, password }`
- `GET /api/auth/me`
- `GET|POST /api/clients`, `GET|PUT|DELETE /api/clients/:id` — `?search=` filtra por nome/email/telefone
- `GET|POST /api/professionals`, `GET|PUT|DELETE /api/professionals/:id` — `?active=true` filtra ativos
- `GET|POST /api/treatments`, `GET|PUT|DELETE /api/treatments/:id` — `?active=true` filtra ativos
- `GET|POST /api/appointments`, `GET|PUT|DELETE /api/appointments/:id` — filtros `?professionalId=&clientId=&status=&from=&to=`. Criação/edição rejeita com `409` se o profissional já tiver outro agendamento no mesmo intervalo.
- `GET /api/dashboard/summary` — total de clientes, agendamentos de hoje, faturamento do mês (agendamentos `COMPLETED`) e próximos agendamentos

## Build de produção

```bash
npm run build
npm start
```

## Deploy no EasyPanel

Este serviço escuta na porta **5000** dentro do container.

1. **Banco de dados**: se você já tem um Postgres compartilhado entre projetos no EasyPanel (ex: serviço `postgres-shared`), **não reutilize o banco de outro app** — crie um banco dedicado para este projeto:
   - Abra o serviço Postgres compartilhado no EasyPanel e use a aba de terminal/console dele (ou um client como Adminer/psql apontando pro host interno) para rodar:
     ```sql
     CREATE DATABASE clinica_estetica;
     ```
   - Monte a `DATABASE_URL` reaproveitando host/usuário/senha do serviço compartilhado, só trocando o nome do banco no final, por exemplo:
     `postgresql://postgres:<senha>@<host-interno-do-postgres>:5432/clinica_estetica?sslmode=disable`
   - Se preferir isolar totalmente, crie um serviço **Postgres** novo dedicado a este projeto em vez de usar o compartilhado.
2. Crie um serviço de app a partir deste repositório, apontando o **build context/root para a pasta `backend/`**, tipo de build **Dockerfile** — o EasyPanel vai buildar usando o `Dockerfile` desta pasta.
3. Configure as variáveis de ambiente do serviço:
   - `DATABASE_URL` — a connection string montada no passo 1 (banco dedicado, nunca compartilhado com outro app)
   - `JWT_SECRET` — um valor aleatório e seguro
   - `JWT_EXPIRES_IN` — ex. `7d`
   - `PORT` — `5000`
   - `CORS_ORIGIN` — domínio(s) do frontend na Vercel, separados por vírgula (ex: `https://seu-app.vercel.app`). Inclua também o domínio de preview da Vercel se for testar deploys de PR por lá.
4. Nas configurações de rede/domínio do serviço no EasyPanel, configure a **porta do container como `5000`** (é a porta que o Express escuta) e associe o domínio/subdomínio desejado.
5. O container roda `prisma migrate deploy` automaticamente antes de iniciar o servidor, aplicando as migrations pendentes no banco configurado — não precisa rodar migration manualmente.
6. Depois do deploy, valide acessando `https://<seu-dominio>/health` e `https://<seu-dominio>/health/db` (o segundo confirma que a conexão com o Postgres está funcionando).
7. (Opcional, recomendado para demonstração) Popule dados de exemplo rodando `npm run prisma:seed` **de dentro do terminal/console do serviço `clinica-api` no EasyPanel** (ele tem acesso à rede interna onde o Postgres está). Cria um usuário `admin@esteticapro.com` / `esteticapro123`, profissionais, tratamentos, clientes e agendamentos de exemplo.

## Estrutura

```
src/
├── config/        # variáveis de ambiente
├── controllers/   # lógica das rotas
├── lib/           # prisma client, helpers
├── middleware/    # auth, tratamento de erros
├── routes/        # definição das rotas Express
├── app.ts         # configuração do Express
└── server.ts      # entrypoint
prisma/
└── schema.prisma  # modelo de dados
```
