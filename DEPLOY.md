# Deploy — Passo a Passo

## ⚠️ Bloqueio na conta Railway

Tentei criar o projeto via API e recebi:

```
Free plan resource provision limit exceeded. Please upgrade to provision more resources!
```

Sua conta Railway está no plano Free e não consegue provisionar novos recursos. **Solução em 1 minuto:**

1. Acesse https://railway.com/account/plans
2. Clique em **Upgrade to Hobby** ($5/mês com $5 de créditos gratuitos — se passar disso, é débito automático)
3. Adicione um cartão (qualquer crédito/débito BR funciona)
4. Pronto — assim que liberar, execute os comandos abaixo

## Após liberar o plano

### Opção A — Via dashboard (recomendado, 2 cliques)

1. Vá em https://railway.com/new
2. Escolha **Deploy from GitHub repo** → selecione `lucivaldo1998/lerbrincando`
3. Clique em **+ New** → **Database** → **Add PostgreSQL**
4. Volte ao serviço da app → aba **Variables** → cole tudo abaixo:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
MP_PUBLIC_KEY=APP_USR-e6dc16cd-d25e-424c-8c52-3662a0d856da
MP_ACCESS_TOKEN=APP_USR-842945132096509-051002-a0b3d2c6c36ece35e1fd3b6639011807-648694618
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-e6dc16cd-d25e-424c-8c52-3662a0d856da
ADMIN_TOKEN=rm-admin-2026-seguro
NEXT_PUBLIC_BRAND=LerBrincando
NEXT_PUBLIC_EMAIL=meunegocio@gmail.com
NEXT_PUBLIC_WHATSAPP=+55 92 99999-9999
PRODUCT_PRICE_BRL=37.00
NEXT_PUBLIC_SITE_URL=https://SEU-DOMINIO.up.railway.app
```

5. Aba **Settings** → **Generate Domain** (Railway gera o subdomínio público)
6. Volte em Variables e atualize `NEXT_PUBLIC_SITE_URL` com a URL gerada → redeploy automático

### Opção B — Via CLI (depois do upgrade)

```bash
# instalar CLI
npm install -g @railway/cli   # (precisa de sudo no macOS, ou use brew install railway)

# autenticar com o token já fornecido
railway login --browserless    # cole o token quando pedir

cd /Users/lucivaldolopes/Documents/projetos/alfabetização
railway init                   # nome: lerbrincando
railway add --database postgres
railway up                     # build + deploy

# setar variáveis
railway variables set MP_ACCESS_TOKEN="APP_USR-842945132096509-051002-a0b3d2c6c36ece35e1fd3b6639011807-648694618"
railway variables set MP_PUBLIC_KEY="APP_USR-e6dc16cd-d25e-424c-8c52-3662a0d856da"
railway variables set NEXT_PUBLIC_MP_PUBLIC_KEY="APP_USR-e6dc16cd-d25e-424c-8c52-3662a0d856da"
railway variables set ADMIN_TOKEN="rm-admin-2026-seguro"
railway variables set NEXT_PUBLIC_BRAND="LerBrincando"
railway variables set NEXT_PUBLIC_EMAIL="meunegocio@gmail.com"
railway variables set NEXT_PUBLIC_WHATSAPP="+55 92 99999-9999"
railway variables set PRODUCT_PRICE_BRL="37.00"

# gerar domínio
railway domain
```

## Configurar webhook do Mercado Pago

Após o site estar no ar:

1. Acesse https://www.mercadopago.com.br/developers/panel/app
2. Selecione sua aplicação
3. **Webhooks** → **Configurar notificações**
4. URL: `https://SEU-DOMINIO.up.railway.app/api/webhooks/mercadopago`
5. Eventos: marque `payment.updated` e `payment.created`

## Validação

Depois do deploy, valide essas URLs (todas devem responder 200):

- `https://SEU-DOMINIO.up.railway.app/` — landing
- `https://SEU-DOMINIO.up.railway.app/quiz/tempo` — primeira tela do funil
- `https://SEU-DOMINIO.up.railway.app/checkout` — checkout
- `https://SEU-DOMINIO.up.railway.app/admin` — login com `rm-admin-2026-seguro`
- `https://SEU-DOMINIO.up.railway.app/api/health` — `{ ok: true }`

## Domínio próprio (depois)

Quando registrar `lerbrincando.com.br` (ou outro):

1. Railway → seu serviço → **Settings** → **Custom Domain** → adicionar
2. Railway mostra um CNAME → cole no painel do registrador
3. Aguarde 5-30min para propagar
4. Atualize `NEXT_PUBLIC_SITE_URL` para a nova URL e refaça a config do webhook MP
