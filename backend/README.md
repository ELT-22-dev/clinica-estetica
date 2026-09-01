# EstéticaPro — Backend

API do sistema EstéticaPro (clínica de estética). Node.js + TypeScript + Express + Prisma + PostgreSQL.

Escopo atual: esqueleto de deploy — autenticação (registro/login com JWT) e healthcheck (incluindo checagem de conexão com o banco). As entidades de negócio (clientes, agendamentos, tratamentos, etc.) ainda serão adicionadas.

## Rodando localmente

```bash
cp .env.example .env
docker compose up -d          # sobe o Postgres local
npm install
npm run prisma:migrate        # cria as tabelas
npm run dev                   # http://localhost:5000
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
