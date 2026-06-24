# 🎸 Strum

**Aprenda violão e baixo do jeito divertido.** Strum é um treinador de
instrumentos de corda no estilo Duolingo: uma trilha de lições com XP, streak e
coroas, mais um afinador, metrônomo e biblioteca de acordes — tudo em um lugar
calmo e focado.

Construído com **Next.js (App Router) + TypeScript + Tailwind CSS**,
autenticação com **NextAuth v5**, banco de dados **Postgres via Prisma**, e a
**Web Audio API** para afinação e som reais.

## Paleta

| Token  | Hex       | Uso                                       |
| ------ | --------- | ----------------------------------------- |
| Cyprus | `#004741` | Primária — texto, botões, destaques       |
| Sand   | `#F0EDE4` | Fundos e superfícies                      |
| Ochre  | `#C8893B` | Apenas para streak / XP (complementar)   |

## Arquitetura (Fase 1 — fundação)

- **Auth** — cadastro/login/logout com NextAuth v5 (Credentials + JWT), senhas
  com bcrypt. Middleware protege `/app` e `/onboarding`; isolamento por `userId`.
- **Onboarding** — escolha de instrumento (violão **ou** baixo), número de
  cordas (4–6) e destro/canhoto.
- **Banco** — Postgres + Prisma. Modelos: `User`, `Progress`, `Attempt`,
  `XpEvent`, `SkillStrength`, `Song`, `Composition`, `GlossarySeen`,
  `AchievementUnlock`.
- **Currículo determinístico** — 6 unidades × skills × exercícios gerados por
  seed (`src/lib/curriculum.ts`), iguais para todo mundo, sem ocupar o banco.
- **Gamificação no servidor** — XP atômico, streak com freeze de 1 dia, meta
  diária, coroas, ledger de XP.
- **Ferramentas** — afinador (já com afinação de violão **e** baixo), metrônomo
  e biblioteca de acordes.
- **Shell + PWA** — sidebar no desktop, bottom-nav no mobile, manifest.

## Rodando localmente

```bash
npm install                       # instala dependências
cp .env.example .env               # configure DATABASE_URL e AUTH_SECRET
npx prisma db push                 # cria as tabelas no seu Postgres
npm run dev                        # http://localhost:3000
```

Você precisa de:

1. Um **Postgres** — crie grátis em [neon.tech](https://neon.tech) e cole a
   connection string em `DATABASE_URL`.
2. Um **AUTH_SECRET** — gere com `openssl rand -base64 32`.

> O afinador precisa de permissão de microfone e contexto seguro (`localhost` no
> dev, HTTPS em produção). Seu áudio nunca sai do dispositivo.

## Deploy (Vercel + Neon)

1. Importe o repositório na [Vercel](https://vercel.com).
2. Em **Environment Variables**, adicione `DATABASE_URL` (do Neon) e `AUTH_SECRET`.
3. A Vercel roda `npm run build` (que faz `prisma generate` + `next build`).
4. Rode `npx prisma db push` uma vez apontando para o banco de produção.

## Estrutura

```
prisma/schema.prisma   modelo de dados
src/
  app/                 rotas (App Router): landing, login, onboarding, /app/*
  components/          UI (shell, formulários, ferramentas, diagramas)
  lib/                 instrumentos, currículo, pitch, áudio, datas, validação
  server/              lógica de sessão, progresso e trilha (somente servidor)
  auth.ts, auth.config.ts, middleware.ts   NextAuth v5
```

## Roadmap

| Fase | Conteúdo |
| ---- | -------- |
| **1 — Fundação** ✅ | Auth, onboarding, banco, currículo, gamificação, ferramentas, shell |
| 2 — Currículo & Player | Player v2 (note highway, wait/timed, 5 coroas, loop A/B) |
| 3 — Motor de áudio | pitchy/MPM em AudioWorklet, graders de afinação e tempo |
| 4 — Visão | MediaPipe HandLandmarker, coach de postura, FretMapper |
| 5 — Músicas | import (Songsterr/GP/MusicXML/MIDI), songbook |
| 6 — IA & extras | lições adaptativas, glossário, conquistas, ouvido, compositor, casas mortas, PWA offline |
