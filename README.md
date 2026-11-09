# SOS360 — Preparação, proteção e sobrevivência

App mobile-first de preparação familiar e aventura com áreas **SOS Family (vermelho)** e **SOS Advanced (verde)**.

**Site:** https://sos360.up.railway.app
**Projeto Railway:** https://railway.com/project/428e6143-a2e5-4013-bd24-06f7bb127143

> **Status:** MVP local-first em evolução. O dashboard, kit 72h, plano familiar, contatos, SOS Academy e backup JSON existem no código. O novo módulo Água e Alimentação foi implementado e seu deploy Railway terminou SUCCESS; faltam testes funcionais. Autenticação, dados compartilhados em banco e offline PWA completo ainda não estão prontos. Não é um serviço de emergência.

## Documentos para continuar nesta ou em outra IA

1. [PRD.md](PRD.md) — requisitos e critérios de aceite.
2. [EPICS.md](EPICS.md) — épicos, progresso e entregáveis.
3. [TASKS.md](TASKS.md) — tarefas com IDs e checkboxes.
4. [AGENTS.md](AGENTS.md) — instruções práticas e contexto para IAs e desenvolvedores.

Ao retomar, **leia AGENTS.md, PRD.md, EPICS.md e TASKS.md antes de modificar o código**. Atualize tarefas e documentação junto das entregas; não marque concluído sem confirmação.

## Estrutura

- `apps/web` — Next.js 15 + React 19 + TypeScript; tela principal, estilo e módulo de suprimentos.
- `apps/api` — Fastify 5, endpoints iniciais de saúde e módulos.
- `packages/database` — esquema Prisma inicial; sem PostgreSQL conectado.
- `TASKS.md`, `EPICS.md`, `PRD.md`, `AGENTS.md` — documentação viva.

## Desenvolvimento

```bash
npm install
npm run dev:web
npm run dev:api
```

Front local: http://localhost:3000. API local: http://localhost:3001/health.

## Infraestrutura e limites

- Web no Railway com domínio `sos360.up.railway.app` e roteamento para **porta 8080**.
- O serviço `SevenBible` do mesmo projeto Railway é de outra aplicação e não deve ser alterado.
- Dados do MVP ficam no `localStorage`, com exportação JSON; limpar armazenamento pode apagar dados.
- Os cálculos e guias são educativos; seguir autoridades e serviços oficiais durante emergências.

## Próximo passo prioritário

Testar o módulo Água e Alimentação em navegador e backup (deploy já SUCCESS), adicionar CI e seguir para PostgreSQL/autenticação/API com isolamento seguro de dados. Ver [TASKS.md](TASKS.md).


## Interface de referência aprovada (2026-11-09)
- [ROADMAP.md](ROADMAP.md) inclui a matriz de telas e funcionalidades exigidas pelo ZIP `sos360-interface.zip` e o plano de integração.
- Código de adaptação: branch `feature/visual-navigation-family-advanced`, com navegação e SVGs. **Uma montagem JPEG reduzida das 13 fotos do ZIP está adicionada como prévia**, mas os 13 arquivos individuais em qualidade final ainda devem ser integrados.
- O trabalho de API/PostgreSQL/login permanece separado em `feature/postgres-auth-sync-foundation`, sem integração pública validada.
