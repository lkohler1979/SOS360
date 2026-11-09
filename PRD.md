# SOS360 — PRD vivo

Atualizado: 2026-11-09. Projeto: https://github.com/lkohler1979/SOS360
App: https://sos360.up.railway.app
Railway: https://railway.com/project/428e6143-a2e5-4013-bd24-06f7bb127143

## Visão e público
SOS360 é um aplicativo mobile-first de preparação para emergências, proteção da família e sobrevivência ao ar livre. O objetivo é fornecer orientações simples e ferramentas práticas antes de situações de risco. Não é um serviço de socorro nem substitui profissionais ou orientações oficiais.

## Identidade visual aprovada
- SOS Family: **vermelho**, com foco em família, kits, água, alimentação, saúde, casa, evacuação, crianças/idosos, alertas e comunicação.
- SOS Advanced: **verde**, com foco em navegação, abrigo, equipamentos, água no campo, segurança outdoor e preparação de expedições.
- Home com atalhos em cartões visuais, menu lateral desktop e menu inferior mobile. A imagem conceitual aprovada com três smartphones e categorias ilustradas permanece REFERÊNCIA; não está integrada como asset ao repositório.
- Acessibilidade, clareza e rapidez têm prioridade sobre efeitos visuais.

## Módulos do produto
1. Family: perfil familiar, contatos, planos de emergência, kit de 72 horas, água e alimentação, primeiros cuidados educativos, casa segura e alertas.
2. Advanced: planejamento de expedições, navegação, água, abrigo, equipamento, prevenção e segurança.
3. Academy: guias revisados, cursos, avaliações e trilhas de aprendizagem.
4. Administração: CMS, revisão editorial, usuários, auditoria e métricas.
5. Assistente IA futuro: respostas baseadas em fontes curadas, com limites claros para riscos.

## Estado real em 2026-11-09
IMPLEMENTADO NO CÓDIGO: Next.js 15/React 19, Fastify 5, Prisma 6 inicial; dashboard responsivo vermelho/verde; kit 72h editável com progresso; plano familiar; contatos; quatro guias Academy; backup/importação JSON; armazenamento localStorage; novo módulo Água e Alimentação (pessoas, dias, estimativa de litros e refeições, estoque e checklist). API com somente GET /health e GET /api/v1/modules. Banco Prisma apenas modelado (User/UserKit), sem PostgreSQL conectado.
Na verificação de 2026-11-09, frontend e API estavam ONLINE; o deploy web do módulo Água e Alimentação (ID 6df0a391-17b6-4432-b3e9-9f7c50a25a13) terminou SUCCESS. Isso confirma o deploy, mas não testes completos de interface ou HTTP externo.
NÃO IMPLEMENTADO: login real, dados de família por usuário no banco, sincronização, offline PWA completo, CMS, cursos, Advanced operacional, IA, CI/testes E2E e revisão de segurança. Versão atual é protótipo funcional local-first, NÃO 1.0 servidor pronta.

## Requisitos da v1.0 de produção
- Autenticação segura, recuperação de conta, autorização e isolamento de dados.
- PostgreSQL e migrations Prisma; API com endpoints validados para família, contato, plano, inventário e suprimentos.
- Sincronização com suporte a falhas, exportação/exclusão, privacidade LGPD.
- PWA instalável e offline REAL testado, com guia previamente baixado e estado de sincronização visível.
- Conteúdo com origem, atualização, revisão humana e limitações de segurança.
- Testes unitários, de integração e E2E, CI, monitoramento de erros e HTTP 200 pós-deploy.

## Segurança e privacidade
Nunca apresentar app como canal de resgate. Os cálculos são estimativas educativas; 3 L de água/pessoa/dia e 3 refeições/pessoa/dia são premissas iniciais, não recomendação universal. Situações específicas exigem orientação das autoridades sanitárias/Defesa Civil e profissionais. Dados locais podem ser perdidos ao limpar o navegador; exportar backup. Evitar coletar dados de menores sem política adequada.

## Ambiente técnico
Repo público lkohler1979/SOS360, branch main.
Railway project 428e6143-a2e5-4013-bd24-06f7bb127143; environment production e95c5ab5-54d5-4821-938a-b1278db50d19.
Web service 08bc6294-8133-4d55-898e-7f8aca0bfeff, domínio sos360.up.railway.app, porta de domínio 8080.
API service aeb4f3cb-56ee-4634-bb76-45b7f45f5367, domínio sos360-beta-api-production.up.railway.app. Verificar a porta real.
SevenBible é outro serviço no mesmo projeto: NÃO modificar.
Documentação complementar: EPICS.md, TASKS.md, AGENTS.md.


## Adendo de requisitos — interface aprovada e entregue em ZIP (2026-11-09)
A partir do ZIP original `sos360-interface.zip` enviado pelo usuário, o **fluxo visual de referência é uma decisão de produto**. Leia [ROADMAP.md](ROADMAP.md) antes de alterar a navegação.

- Tela inicial neutra com logo, escolha Family vermelho / Advanced verde e 6 atalhos.
- Cada área tem 6 itens especificados literalmente no ZIP, foto de topo e tema completo correspondente.
- Última escolha salva localmente; rodapé fixo **Início, Academy, Mapas, Mais**; Início dentro do módulo volta à home do próprio módulo; seta voltar retorna à escolha de acesso.
- Mais usa a paleta ativa em tela inteira, desenho cartográfico decorativo, 14 ícones SVG e 10 cards fotográficos.
- O app deve preservar kit, plano, contatos, água/alimentos, guias e backup — não substituir trabalho funcional por placeholders.
- Itens ainda não funcionais devem informar claramente estágio; mapa/alerta não devem alegar dados em tempo real.
- Fotografias foram substituídas pelas 13 imagens individuais recém-enviadas e aprovadas pelo usuário, com caminhos estáveis em `apps/web/public/interface/img/`. Sete assets de marca/ícones foram incluídos em `apps/web/public/interface/brand/`. O CSS não utiliza mais a montagem temporária. Verificar responsividade/recortes pós-deploy.
- A referência de UI inclui novos recursos não concluídos: segurança doméstica, necessidades de crianças e idosos, comunicação, fogo, abrigo, navegação/mapas e riscos/alertas. Critérios e fases em [ROADMAP.md](ROADMAP.md).


## Backend persistente — estágio de implementação (2026-11-09)
A gravação com contas está em desenvolvimento na branch `feature/cloud-storage-integration`: API Fastify com tabela `sos_users` (senha scrypt + salt), `sos_sessions` (hash de token) e `sos_state` (snapshot JSONB da família, checklist, plano e provisões, versionado). O frontend oferece conta e vínculo explícito, sincronização automática com aviso de conflitos e sessão em cookie HttpOnly por proxy Next.js. **Esses recursos ainda não estão publicados nem testados com banco real.**

Bloqueio real no Railway: o projeto contém somente serviços web/API; a criação de `sos360-postgres` foi recusada com mensagem **Free plan resource provision limit exceeded. Please upgrade to provision more resources!**. Sem serviço Postgres, nenhuma gravação em nuvem foi ativada. Para habilitar: liberar capacidade/upgrade, criar Postgres com volume, configurar DATABASE_URL na API, publicar branch validada e executar E2E. Não substituir ou alterar serviços de outros sistemas. Ver [TASKS.md](TASKS.md) SOS-065–074.
