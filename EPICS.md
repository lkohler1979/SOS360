# SOS360 — Épicos de produto e engenharia

Atualização: 2026-11-09. Estado dos épicos distingue **implementado localmente**, **parcial**, **pendente** e **futuro**. A fonte complementar dos critérios de aceite está no [PRD.md](PRD.md). IDs estáveis para referência cruzada em [TASKS.md](TASKS.md).

## EPIC-00 — Fundação, deploy e qualidade [PARCIAL]
Objetivo: manter web/API estáveis, com testes e entregas rastreáveis.
Feito: monorepo npm workspaces, Next.js, Fastify, Prisma inicial, conexão GitHub/Railway, domínio sos360.up.railway.app, serviços web/API publicados.
Falta: testes automatizados, lockfile, CI, monitoramento, smoke HTTP 200, rotina de release, deploy por PR, validação do novo módulo Água e Alimentação.
Aceite: todo merge executa checks e gera release verificável com rollback.

## EPIC-01 — UX, design system e PWA [PARCIAL]
Feito: navegação responsiva, dashboard com cartões, Family vermelho, Advanced verde, versão mobile com barra inferior. Design inspirado no mockup aprovado.
Falta: integrar ilustrações reais, refinamento visual, acessibilidade/contraste/teclado, testes em aparelhos, ícones finais, service worker e offline.
Aceite: percursos prioritários rápidos e claros no smartphone; funcionamento offline testado e sinalizado.

## EPIC-02 — SOS Family: kit, planos e contatos [IMPLEMENTADO LOCAL / BACKEND PENDENTE]
Feito: kit 72 horas editável, checkboxes/progresso, plano familiar, contatos, armazenamento local e backup JSON.
Falta: família e membros, perfis especiais, inventário com validade e quantidade, notificações, dados por usuário, API e sincronização.
Aceite: dados isolados por usuário, persistência confiável e plano imprimível/compartilhável com segurança.

## EPIC-03 — Água, alimentos e provisões [IMPLEMENTADO NO CÓDIGO / DEPLOY EM VALIDAÇÃO]
Feito: módulo calculadora pessoas/dias, água 3 L/pessoa/dia, 3 refeições/pessoa/dia, estoque existente, faltantes, progresso e checklist, integração com localStorage/backup. Commit final anterior à documentação: 11dc8f0.
Falta: testes funcionais pós-deploy (Railway SUCCESS em 2026-11-09), estoque com validade, preferências individuais, revisão de parâmetros por referências oficiais, lista de compras, alertas.
Aceite: cálculos e dados persistem, há aviso de estimativas e acessibilidade.

## EPIC-04 — Segurança e resposta familiar [PENDENTE]
Escopo: casa segura, riscos locais, evacuação, comunicação, energia, crianças, idosos, animais, primeiros cuidados com fontes revisadas.
Aceite: guias simples, verificáveis, sem instruções inseguras nem promessa de resgate.

## EPIC-05 — SOS Advanced [VISUAL / CONTEÚDO INICIAL]
Feito: segmento verde, cartões de navegação, água, abrigo, fogo, equipamentos e comunicação; cartões encaminham para conteúdo geral ou checklist.
Falta: conteúdos específicos revisados, planejamento de expedição, mapas/navegação offline, inventário de aventura, check-in e fluxos de segurança.
Aceite: não confundir vitrine visual com módulos operacionais.

## EPIC-06 — SOS Academy e CMS [PARCIAL]
Feito: quatro guias introdutórios estáticos.
Falta: estrutura versionada, editor/admin, metadados de revisão e fontes, categorias, download offline, cursos e avaliações.
Aceite: conteúdo publicado contém revisão, origem, versão e nível de risco.

## EPIC-07 — Identidade, backend e dados [PENDENTE]
Feito: esqueleto Fastify com /health e /api/v1/modules, esquema Prisma User/UserKit.
Falta: PostgreSQL provisionado, migrações, autenticação, RBAC, isolamento de dados, endpoints CRUD, validação, segurança, backups, LGPD, sincronização.
Aceite: testes de autorização, persistência, restauração e segregação passam.

## EPIC-08 — IA segura [FUTURO]
Assistente embasado em documentos confiáveis, avisos, citações, limites para saúde/segurança e auditoria. Não bloquear caminho crítico quando offline.

## EPIC-09 — Comunidade e gamificação [FUTURO]
Missões, conquistas, progressão, comunidade com moderação, denúncias e regras de segurança.

## EPIC-10 — Gestão e monetização [FUTURO]
Administração, assinaturas, auditoria, métricas de produto, suporte e política de privacidade.

## Sequência sugerida
1. Verificar deploy, resolver falhas e implementar CI (EPIC-00).
2. Persistência PostgreSQL, autenticação e CRUD Family (EPIC-07 + EPIC-02/03).
3. PWA offline + testes e conteúdo revisado (EPIC-01 + EPIC-06).
4. Recursos de segurança Family antes de ampliar o Advanced (EPIC-04).
5. Advanced operacional e demais recursos (EPIC-05+).
