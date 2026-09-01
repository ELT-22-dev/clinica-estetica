# EstéticaPro — Backend

API do sistema EstéticaPro (clínica de estética). Node.js + TypeScript + Express + Prisma + PostgreSQL.

Escopo atual: esqueleto de deploy — autenticação (registro/login com JWT) e healthcheck (incluindo checagem de conexão com o banco). As entidades de negócio (clientes, agendamentos, tratamentos, etc.) ainda serão adicionadas.

## Rodando localmente

```bash
cp .env.example .env
docker compose up -d          # sobe o Postgres local
npm install
npm run prisma:migrate        # cria as tabelas
npm run dev                   # http://localhost:3000
```

Endpoints disponíveis:

- `GET /health` — healthcheck simples
- `GET /health/db` — healthcheck com checagem de conexão ao Postgres
- `POST /api/auth/register` — `{ name, email, password }`
- `POST /api/auth/login` — `{ email, password }`
- `GET /api/auth/me` — requer `Authorization: Bearer <token>`

## Build de produção

```bash
npm run build
npm start
```

## Deploy no EasyPanel

1. No EasyPanel, crie um serviço **Postgres** no projeto (ou use um já existente) e anote a connection string interna (ex: `postgresql://user:pass@postgres:5432/clinica_estetica`).
2. Crie um serviço de app a partir deste repositório (pasta `backend/`), tipo **Dockerfile** — o EasyPanel vai buildar usando o `Dockerfile` desta pasta.
3. Configure as variáveis de ambiente do serviço:
   - `DATABASE_URL` — connection string do Postgres criado no passo 1
   - `JWT_SECRET` — um valor aleatório e seguro
   - `JWT_EXPIRES_IN` — ex. `7d`
   - `PORT` — `3000` (ou a porta que o EasyPanel espera)
   - `CORS_ORIGIN` — domínio(s) do frontend na Vercel, separados por vírgula (ex: `https://seu-app.vercel.app`). Inclua também o domínio de preview da Vercel se for testar deploys de PR por lá.
4. O container roda `prisma migrate deploy` automaticamente antes de iniciar o servidor, aplicando as migrations pendentes no banco configurado.
5. Exponha a porta `3000` do serviço e associe o domínio/subdomínio desejado.

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
