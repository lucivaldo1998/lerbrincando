# LerBrincando

Funil de quiz interativo + checkout Mercado Pago (PIX e Cartão) + admin panel para o nicho de alfabetização infantil.

## Stack

- Next.js 14 (App Router, standalone output)
- TypeScript + Tailwind CSS
- Prisma + PostgreSQL
- Mercado Pago SDK v2 (PIX + Cartão + Webhook)
- Deploy: Railway (Docker)

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Landing com CTA do quiz |
| `/quiz/[step]` | 20+ telas do funil (config em `lib/quiz-config.ts`) |
| `/plano` | Revelação do plano personalizado |
| `/checkout` | Formulário de compra (PIX ou Cartão) |
| `/obrigado?id=...` | Aguardando PIX com polling a cada 4s |
| `/obrigado/sucesso?id=...` | Redirecionamento para WhatsApp |
| `/admin` | Painel protegido por token |
| `/termos`, `/privacidade`, `/reembolso` | Páginas legais |

## API

| Endpoint | Descrição |
|----------|-----------|
| `POST /api/checkout/pix` | Cria pedido e gera QR PIX via MP |
| `POST /api/checkout/card` | Cria pedido com token de cartão MP |
| `POST /api/webhooks/mercadopago` | Recebe notificações do MP |
| `GET /api/order/[id]/status` | Polling + re-sync com MP |
| `POST /api/admin/login` | Auth por token (cookie httpOnly 12h) |
| `GET /api/admin/orders` | Lista com filtros e stats |
| `PATCH /api/admin/orders/[id]` | Altera status manualmente |
| `GET /api/health` | Healthcheck |

## Desenvolvimento

```bash
npm install
cp .env.example .env   # preencher com as credenciais
npx prisma migrate dev
npm run dev
```

## Deploy Railway

1. Criar projeto no Railway e adicionar serviço Postgres
2. Configurar variáveis de ambiente (ver `.env.example`)
3. Conectar o repositório GitHub — build usa o `Dockerfile`
4. A primeira subida roda `prisma migrate deploy` automaticamente

## Segurança

- Dados de cartão nunca tocam o servidor (tokenização MP.js)
- Admin protegido por token via cookie httpOnly + SameSite=Lax
- Comparação de token em tempo constante
- CPF e telefone armazenados só em dígitos
- Webhook do MP responde 200 mesmo em erro para evitar retry infinito

## Configuração do Mercado Pago

No painel do MP, configurar a URL do webhook:
```
https://SEU-DOMINIO/api/webhooks/mercadopago
```
Ativar eventos: `payment.updated`, `payment.created`.
