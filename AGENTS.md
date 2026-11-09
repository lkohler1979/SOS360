# AGENTS.md — Handoff para qualquer IA / desenvolvedor

Leia nesta ordem: README.md -> PRD.md -> EPICS.md -> TASKS.md -> código -> Railway. Esta pasta GitHub é a fonte de verdade. É proibido afirmar que algo funciona apenas porque existe interface ou build SUCCESS.

## Objetivo imediato
Fechar SOS-017 (verificar deploy do módulo Family Água e Alimentação) e depois implementar arquitetura segura de banco/autenticação/CRUD, mantendo funções existentes e compatibilidade dos dados locais.

## O que já existe
- Frontend: apps/web/app/page.tsx e apps/web/app/SuppliesModule.tsx; CSS apps/web/app/globals.css, layout.tsx; armazenamento localStorage em chave sos360:v1.
- Backend: apps/api/src/server.ts — Fastify com health e lista de módulos, ainda sem autenticação/CRUD.
- DB: packages/database/prisma/schema.prisma — User/UserKit iniciais, SEM banco provisionado/conectado.
- Visual aprovado: SOS Family vermelho / SOS Advanced verde; aparência mobile moderna e prática; mockup feito na conversa, mas NÃO integrado ao repositório como asset.
- Sem contas, sync, CI, worker offline, IA ou conteúdo Advanced completo.

## Deploy e infraestrutura
- GitHub: lkohler1979/SOS360, main.
- Railway project: 428e6143-a2e5-4013-bd24-06f7bb127143
- Railway environment: e95c5ab5-54d5-4821-938a-b1278db50d19 (production).
- Web service: 08bc6294-8133-4d55-898e-7f8aca0bfeff; domínio https://sos360.up.railway.app, **targetPort 8080**. Start: npm run start -w @sos360/web; build: npm install && npm run build -w @sos360/web.
- API service: aeb4f3cb-56ee-4634-bb76-45b7f45f5367; domínio https://sos360-beta-api-production.up.railway.app; build: npm install && npm run build -w @sos360/api; start: npm run start -w @sos360/api. Verificar PORT emitido nos logs antes de validar domain targetPort.
- SevenBible (service 4a6c3f91-5999-413f-8fdf-059c66e8c15f) é serviço NÃO relacionado: NÃO alterar, excluir, reconfigurar ou usar recursos dele.
- Checagem de 2026-11-09: deployment Água e Alimentação 6df0a391-17b6-4432-b3e9-9f7c50a25a13 SUCCESS, web/API ONLINE; ainda não foram executados smoke HTTP externo e testes funcionais. Reconsultar Railway.

## Desenvolvimento
Local: npm install; npm run dev:web; npm run dev:api. Confirmar comandos de package.json. Não assumir que builds foram testados localmente. Adicionar typecheck/test/lint/CI.
Antes de editar: buscar HEAD, fazer branch/PR preferencialmente, não sobrescrever trabalho alheio, testar, revisar e efetuar deploy com smoke HTTP 200 real.
Manter migração de estado local: formato Data com kit, contacts, plan e supplies; imports antigos podem não ter supplies. Preservar informações existentes.
Usar metodologia incremental e confirmar cada etapa via logs/health/HTTP.

## Requisitos de segurança
Projeto de emergência: não prometer orientação infalível ou socorro; citar orientações oficiais quando aplicável; tratar cálculos como estimativas educativas. Evitar instruções perigosas. Priorizar LGPD, privacidade e uso responsável dos dados de família, inclusive dados de menores.

## Workflow sugerido para próxima IA
1. Ler os quatro documentos.
2. Inspecionar código e status dos dois serviços via Railway.
3. Testar o novo módulo Family (cálculo, salvamento, import/export) e corrigir qualquer problema.
4. Acrescentar lockfile, checks e pipeline.
5. Provisionar PostgreSQL, Prisma migrations e auth com permissão adequada.
6. Desenvolver API/integração e migração local -> servidor, com testes.
7. Atualizar TASKS.md e EPICS.md **no mesmo PR** a cada entrega; não marcar [x] antes de validar.


## Decisão visual obrigatória — ZIP do usuário
Nova referência de UI: `sos360-interface.zip` (fornecido em conversa, ainda NÃO commitado no repo). Ele inclui `index.html`, `css/styles.css`, `js/app.js`, fotos e screenshots. A branch `feature/visual-navigation-family-advanced` implementa o fluxo em React/Next, mantendo a lógica funcional. Consulte [ROADMAP.md](ROADMAP.md).
- Não remover kit, plano familiar, contatos, suprimentos, Academy, backup ou dados no localStorage.
- A home é escolha neutra; Family vermelho; Advanced verde; navegação bottom 4 itens e Mais fullscreen.
- Versão atual é trabalho em branch, 13 fotos individuais e 7 arquivos de marca/ícones oficiais já estão no repo, com CSS atualizado; testes visuais e revisão mobile pendentes. Não afirmar deploy de UI nova antes de merge e validação.
- A branch backend `feature/postgres-auth-sync-foundation` é paralela e experimental, ainda não deve ir a produção.
- Para retomar: completar SOS-050–054, validar interface, revisar PR; depois retomar backend com segurança.


## Branch PostgreSQL e limite Railway (2026-11-09)
- `feature/cloud-storage-integration` contém o primeiro fluxo de API auth/sessões/estado JSONB + UI cloud; **não mesclar nem publicar sem banco real e testes**.
- No projeto Railway de produção, tentativas de template PostgreSQL não criaram serviço; criação dedicada `sos360-postgres` falhou por limite Free: `Free plan resource provision limit exceeded`. A interface atual continua salvando em localStorage.
- Após liberar capacidade, provisionar **Postgres com volume persistente**, configurar `DATABASE_URL` somente por referência de variável privada do Railway no serviço API, validar /health e integração completa. NÃO usar dados/volume do SevenBible.
- Para web, configurar `SOS360_API_URL` apontando para a API interna no Railway; default público serve para desenvolvimento, mas preferir rede privada na produção.
- Verificar sessões HttpOnly, cookies SameSite Strict, autorização, versionamento `sos_state`, comportamento de conflitos 409, e revisão de segurança antes de permitir conta real.
