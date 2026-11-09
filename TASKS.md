# SOS360 — TASKS / backlog executável

Atualizado em 2026-11-09. Legenda: [x] concluído NO CÓDIGO (não necessariamente testado), [ ] pendente. Status detalhado: [EPICS.md](EPICS.md), escopo: [PRD.md](PRD.md). Não marcar tarefa concluída apenas por UI ou status SUCCESS do Railway.

## Sprint 0 — Fundação [EPIC-00]
- [x] SOS-001 Monorepo npm workspaces, apps/web, apps/api, packages/database.
- [x] SOS-002 Landing + Next.js 15 / React 19.
- [x] SOS-003 API Fastify básica com /health e /api/v1/modules.
- [x] SOS-004 Schema Prisma inicial User/UserKit.
- [x] SOS-005 Serviços SOS360 web e API no Railway, domínio sos360.up.railway.app; porta web correta 8080.
- [ ] SOS-006 Instalação, typecheck, lint, unit tests e builds reproduzíveis no CI.
- [ ] SOS-007 Commitar package-lock.json com dependências verificadas.
- [ ] SOS-008 Smoke test HTTP 200 do domínio e API após deploy; monitorar 502/404.
- [ ] SOS-009 Documentar release/rollback e staging; não modificar SevenBible.

## Sprint 1 — UI e MVP local [EPIC-01/02/03/06]
- [x] SOS-010 Design responsivo Family vermelho / Advanced verde e navegação mobile.
- [x] SOS-011 Kit 72h: editar, marcar, remover, progresso, localStorage.
- [x] SOS-012 Plano familiar: pontos de encontro, contato externo, observações.
- [x] SOS-013 Contatos de emergência armazenados localmente.
- [x] SOS-014 Academy: quatro guias introdutórios.
- [x] SOS-015 Backup export/import JSON; migração local básica.
- [x] SOS-016 Água e Alimentação: pessoas/dias, litros/refeições, estoque, faltantes, checklist e persistência local no código.
- [ ] SOS-017 Deploy mais recente de Água/Alimentação confirmado SUCCESS em 2026-11-09; pendentes testes de UI, valores, recuperação de dados e backup/importação.
- [ ] SOS-018 Corrigir validação de backups para incluir versões e dados novos com testes.
- [ ] SOS-019 Integrar assets otimizados de imagem (mockup foi aprovado mas imagens não estão no repo).
- [ ] SOS-020 Revisar acessibilidade, contraste, textos, navegabilidade e experiência mobile.

## Sprint 2 — Backend funcional [EPIC-07] — CRÍTICO
- [ ] SOS-021 Provisionar PostgreSQL dedicado SOS360 no Railway, sem tocar SevenBible.
- [ ] SOS-022 Modelar Family, Member, Contact, EmergencyPlan, Kit, KitItem, Supply, Content, AuditEvent no Prisma.
- [ ] SOS-023 Gerar e aplicar migrations; definir seed e backup/restore.
- [ ] SOS-024 Implementar autenticação segura, login/registro/logout/recovery.
- [ ] SOS-025 Autorização e isolamento por usuário/família; testes de invasão horizontal.
- [ ] SOS-026 API CRUD validada (Zod ou equivalente) para famílias, contatos, planos, kits e provisões.
- [ ] SOS-027 Integrar frontend ao backend com estados de erro/loading e proteção de dados.
- [ ] SOS-028 Migração consentida de dados do localStorage para conta.
- [ ] SOS-029 Política de privacidade, exportação/exclusão e tratamento de dados LGPD.

## Sprint 3 — PWA, segurança, conteúdo [EPIC-01/04/06]
- [ ] SOS-030 Ícones e manifesto PWA final, service worker, estratégias offline e testes.
- [ ] SOS-031 Offline para kits, planos e guias previamente baixados, com indicação de disponibilidade.
- [ ] SOS-032 Fila de sync / resolução de conflitos, simulação de perda de rede.
- [ ] SOS-033 Conteúdos de casa segura, evacuação, comunicação e cuidados essenciais.
- [ ] SOS-034 CMS/revisão editorial com fontes oficiais e datas de atualização.
- [ ] SOS-035 CI/CD, testes E2E, segurança, rate limits, observabilidade, rotinas de backup.
- [ ] SOS-036 Teste em Android/iOS e navegadores atuais.

## Sprint 4+ — Expansão [EPIC-05/08/09/10]
- [ ] SOS-037 Advanced: planejamento de expedições, equipamento e segurança.
- [ ] SOS-038 Advanced: navegação offline com fontes e limites.
- [ ] SOS-039 Academy: cursos, avaliações, progresso.
- [ ] SOS-040 IA com RAG, guardrails e fontes.
- [ ] SOS-041 Comunidade e moderação.
- [ ] SOS-042 Admin, assinaturas, métricas e auditoria.

## Critério mínimo de release v1.0 de produção
Não declarar pronta até SOS-006/008, SOS-021–029, SOS-030/031, SOS-034–036 passarem e testes de integração confirmarem isolamento, sincronização e recuperação. O MVP local já pode ser demonstrado, porém não substitui os requisitos acima.

## Status Railway na escrita
Web e API ONLINE; o novo deploy web de Água e Alimentação (ID 6df0a391-17b6-4432-b3e9-9f7c50a25a13) finalizou SUCCESS. A navegação real e os fluxos ainda exigem smoke/E2E.


## Sprint UI do ZIP aprovado — EPIC-11 / EPIC-12 (2026-11-09)
- [x] SOS-043 Criar branch de UI a partir de main, sem sobrescrever código funcional.
- [x] SOS-044 Home de escolha de acesso Family/Advanced, visual escuro, seis atalhos.
- [x] SOS-045 Páginas de módulos com seis itens e troca global vermelho/verde.
- [x] SOS-046 Persistência da última área escolhida (chave `sos360:last-area`).
- [x] SOS-047 Rodapé com Início/Academy/Mapas/Mais e botão voltar à escolha.
- [x] SOS-048 Menu Mais em tela cheia, grid de 14 ícones e 10 cards, com cores da área.
- [x] SOS-049 Portar ícones SVG de traço para componente React; manter funções existentes acessíveis.
- [x] SOS-050 Substituir montagem provisória por 3 heroes e 10 cards JPG individuais otimizados, provenientes das imagens mais recentes fornecidas pelo usuário, em `apps/web/public/interface/img/`. Fotos em background CSS com texto acessível nos botões.
- [ ] SOS-051 Comparar as 5 capturas do ZIP com app React em mobile/desktop e corrigir diferenças.
- [ ] SOS-052 Executar typecheck/build, E2E dos caminhos, localStorage/import/export e accessibility.
- [ ] SOS-053 Publicação da atualização de imagens no Railway (CI, build, health, HTTP externo e validação visual); depois merge do PR em main conforme aprovação.
- [ ] SOS-054 Migrar a preferência antiga `sos360.module` (ZIP) para `sos360:last-area` quando houver dados.
- [ ] SOS-055 Conteúdo Family Saúde e Primeiros Socorros revisado e seguro.
- [ ] SOS-056 Conteúdo Casa Segura (energia, água, saneamento, proteção).
- [ ] SOS-057 Plano especial Crianças, Idosos e outras necessidades.
- [ ] SOS-058 Mapas/Orientação Advanced, fontes verificadas e cache offline.
- [ ] SOS-059 Água no Campo e Alimentação Ambiente: conteúdo revisado com alertas sanitários.
- [ ] SOS-060 Abrigo, Fogo, Equipamentos e prevenção de riscos no Advanced.
- [ ] SOS-061 Alertas e Riscos oficiais por região com origem/hora e avisos adequados.
- [ ] SOS-062 Comunicação, planejamento e rotinas de contato/segurança.
- [ ] SOS-063 Reavaliar protótipo vs PRD e matrizes de cobertura a cada release.
- [x] SOS-064 Inserir fotos reais do ZIP em preview JPEG compacto (montagem 3 hero + 10 tiles) e aplicar aos cartões por CSS. Ver [ROADMAP.md](ROADMAP.md).

**Atenção:** existe trabalho experimental independente em `feature/postgres-auth-sync-foundation`. Autenticação e sincronização ainda NÃO estão prontas; integração posterior deve preservar a interface aprovada e ser submetida a revisão/testes de segurança.
