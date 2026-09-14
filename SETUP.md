# Setup Millennium Club — Vercel + Supabase

## 1. Variáveis de ambiente

O arquivo `.env.local` precisa conter as credenciais do Supabase. Como o arquivo é ignorado pelo git, você deve configurá-lo manualmente no seu ambiente local e também no painel Vercel.

### `.env.local` (local)

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dsosgpzpxwzsuoxqdghn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzb3NncHpweHd6c3VveHFkZ2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMjkyNDksImV4cCI6MjEwNDkwNTI0OX0.pfbQa-JET7Xj3J7n3t-SBX-UlWnjUFRqSHSRgHHnXjc

# URL pública do site (ajustar para produção)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Vercel (Production)

1. Acesse https://vercel.com
2. Selecione ou crie um projeto
3. Na seção **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://dsosgpzpxwzsuoxqdghn.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzb3NncHpweHd6c3VveHFkZ2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzMjkyNDksImV4cCI6MjEwNDkwNTI0OX0.pfbQa-JET7Xj3J7n3t-SBX-UlWnjUFRqSHSRgHHnXjc`
   - `NEXT_PUBLIC_SITE_URL` = URL do seu projeto no Vercel (ex: `https://seu-projeto.vercel.app`)

## 2. Configurando o Supabase

No painel Supabase (https://dsosgpzpxwzsuoxqdghn.supabase.co):

1. **Authentication → Providers**: certifique-se de que email esté ativo.
2. **Authentication → Settings → Site URL**: configure a URL do site (ex: `https://seu-projeto.vercel.app`).
3. **Authentication → Email → Confirm email**: ative a confirmação de email.
4. **Authentication → Email → Redirect URLs**: adicione `https://seu-projeto.vercel.app/app` como redirect para login e `https://seu-projeto.vercel.app/recuperar-senha` para recuperação de senha.

## 3. Configurando OAuth Google

### No Google Cloud Console

1. Acesse https://console.cloud.google.com
2. Selecione ou crie um projeto
3. **APIs e Serviços → Credenciais → Criar Credenciais → ID doClienteOAuth2.0**
4. Tipo: **AplicativoWeb**
5. Nome: `Millennium Club`
6. URLs autorizados (origem):
   - `http://localhost:3000` (desenvolvimento)
   - `https://seu-projeto.vercel.app` (produção)
7. URLs de redirecionamento autorizados:
   - `http://localhost:3000/auth/callback` (desenvolvimento)
   - `https://seu-projeto.vercel.app/auth/callback` (produção)
8. Salve e copie o **ID do cliente** e **Segredo do cliente**

### No Supabase

1. **Authentication → Providers → Google**: ativar
2. Preencha **Client ID** (ID do cliente do Google) e **Client Secret** (Segredo do cliente)
3. Salvar

## 4. Configurando OAuth LinkedIn

### No LinkedIn Developer Portal

1. Acesse https://developer.linkedin.com
2. Faça login com sua conta LinkedIn
3. **Meus Aplicativos → Criar Aplicativo**
4. Preencha nome (`Millennium Club`), descrição e URL do site (`https://seu-projeto.vercel.app`)
5. Após criar, vá em **Autenticação → Autenticação OAuth2.0**
6. Adicione **Redirect URLs**:
   - `http://localhost:3000/auth/callback` (desenvolvimento)
   - `https://seu-projeto.vercel.app/auth/callback` (produção)
7. Copie **Client ID** e **Client Secret**

### No Supabase

1. **Authentication → Providers → LinkedIn**: ativar
2. Preencha **Client ID** e **Client Secret**
3. Salvar

## 5. URLs de redirect no Supabase

Em **Authentication → Settings → Redirect URLs**, adicione (trocando `SEU-DOMINIO` pelo domínio real do projeto):

Desenvolvimento:

- `http://localhost:3000/auth/callback`
- `http://localhost:3000/app`
- `http://localhost:3000/recuperar-senha`

Produção:

- `https://SEU-DOMINIO/auth/callback`
- `https://SEU-DOMINIO/app`
- `https://SEU-DOMINIO/recuperar-senha`

Opcional, para preview deployments do Vercel:

- `https://*-SEU-TIME.vercel.app/**`

Sem essas entradas o login por magic link, a recuperação de senha e o OAuth voltam para o domínio errado (ou são recusados).

## 6. Deploy no Vercel

O projeto compila sem erros (`npm run build`) e já traz `vercel.json` configurado — nenhum ajuste de build é necessário.

### Caminho A — CLI do Vercel (mais rápido, sem GitHub)

Na raiz do projeto:

```bash
npx vercel login     # autenticação (abre o navegador)
npx vercel           # cria o preview deployment e pergunta as configs
npx vercel --prod    # publica em produção
```

Na primeira execução a CLI pergunta: escopo da conta, nome do projeto, diretório do código (`.`), se deve modificar as configurações detectadas (responda **No**).

Depois, adicione as variáveis de ambiente e faça um novo deploy:

```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
npx vercel env add NEXT_PUBLIC_SITE_URL production
npx vercel env pull .env.local   # opcional: baixar as variáveis para o ambiente local
npx vercel --prod
```

> Importante: as variáveis `NEXT_PUBLIC_*` são embutidas no bundle durante o **build**. Adicionar uma variável depois não afeta um deploy já publicado — é preciso rodar `npx vercel --prod` novamente.

### Caminho B — GitHub + Vercel (deploys automáticos)

1. Crie o repositório e envie o código (o `.gitignore` já exclui `.env*`, `.next` e `.vercel`):

   ```bash
   git init
   git add .
   git commit -m "Millennium Club"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/millennium-club.git
   git push -u origin main
   ```

2. Em https://vercel.com/new, importe o repositório. O framework Next.js é detectado automaticamente.
3. Antes de concluir (ou depois, em **Settings → Environment Variables**), adicione `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_SITE_URL` para o ambiente **Production** (e **Preview**, se quiser testar branches).
4. Deploy. Cada `git push` na branch `main` gera um novo deploy de produção.

### Variáveis de ambiente obrigatórias

| Variável | Obrigatória | Valor |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Sim | `https://dsosgpzpxwzsuoxqdghn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim | anon key do painel Supabase |
| `NEXT_PUBLIC_SITE_URL` | Recomendada | URL de produção (ex.: `https://millennium-club.vercel.app`) |
| `GOOGLE_SITE_VERIFICATION` | Não | código de verificação do Google Search Console |

Sem `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` o build falha na inicialização do cliente Supabase.

`NEXT_PUBLIC_SITE_URL` agora é **opcional**: na ausência dela, o app resolve o domínio automaticamente — no navegador usa a origem atual e, no build, usa o domínio do próprio Vercel.

### Depois do primeiro deploy

1. Copie o domínio gerado (ex.: `https://millennium-club.vercel.app`).
2. Cole-o em **Supabase → Authentication → Settings → Site URL**.
3. Adicione as URLs de redirect da seção 5 com esse domínio.
4. Se configurou `NEXT_PUBLIC_SITE_URL`, use exatamente o mesmo domínio.

## 7. Testes locais

```bash
npm run dev
```

Acesse `http://localhost:3000` e teste login, cadastro, recuperação de senha e confirmação de email.

## 8. Links úteis

- Dashboard Supabase: https://dsosgpzpxwzsuoxqdghn.supabase.co
- Painel Vercel: https://vercel.com
