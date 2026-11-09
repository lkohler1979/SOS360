# SOS360 — Roadmap atualizado pela interface de referência (2026-11-09)

Fonte de design: ZIP enviado pelo usuário **sos360-interface.zip** com index.html, css/styles.css, js/app.js, ícones SVG, 3 fotos hero, 10 fotos tile, 5 screenshots e README de medidas. O arquivo ZIP recebido nesta conversa **não está versionado no GitHub**; esta branch contém a adaptação React/Next da navegação e estilo, além de uma **montagem JPEG reduzida derivada das 13 fotos do ZIP** (`apps/web/public/interface/sprite-mini.jpg`) como preview. Ainda exige versionamento das 13 fotografias individuais em qualidade original/otimizada. Nunca confundir cartões navegáveis com módulos operacionais.

## Regras de produto congeladas
1. Não remover nem substituir funcionalidades locais existentes (kit 72h, plano, contatos, Academy, backup, Água e Alimentação).
2. A interface de referência determina a navegação e identidade visual: tela escolha Family/Advanced; 6 cards por área; cores totais por módulo; última área salva; rodapé Início/Academy/Mapas/Mais; overlay Mais integral com 14 ícones e 10 cards fotográficos.
3. **Início** em módulo leva à página inicial do próprio módulo; **Voltar** leva à escolha de área. Menu Mais preserva o tema.
4. Family sempre vermelho, Advanced verde, escolha neutra escura, botões grandes e conteúdo compreensível em crise.
5. Segurança: nenhum item de mapa, alerta, comunicação, saúde, primeiros socorros ou auto defesa deve simular informações em tempo real ou aconselhamento de alto risco quando for apenas placeholder.

## Matriz de cobertura: referência de interface → software
| Entrada visual | Situação | Próxima entrega |
|---|---|---|
| Escolha FAMILY/ADVANCED | Implementada em branch, pendente teste/merge/deploy | Testar seleção, retorno e persistência |
| Family Plano Familiar | Funcional local existente, mantido | Persistir em backend, plano de evacuação ampliado |
| Family Kit Emergência 72h | Funcional local existente, mantido | Inventário/validade/família |
| Family Alimentos e Água | Funcional local existente, mantido | Testar cálculos, abastecimento, integração DB |
| Family Saúde e Primeiros Socorros | Atalho para Academy; sem módulo específico | Guides revisados, triagem de informações sem diagnóstico |
| Family Casa Segura | Atalho para Academy; sem módulo específico | Energia, saneamento, prevenção, desligamento seguro |
| Family Crianças e Idosos | Atalho para Academy; sem módulo específico | Necessidades de dependentes, cuidado e plano de evacuação |
| Advanced Navegação | Placeholder Mapas; sem mapas ou GPS | Mapas confiáveis offline, bússola/azimute, permissões |
| Advanced Abrigo | Atalho Academy, conteúdo genérico | Guias técnicos validados |
| Advanced Água no Campo | Atalho Academy, conteúdo genérico | Conteúdo revisto, não confundir com água tratada |
| Advanced Alimentação no Ambiente | Atalho Academy, conteúdo genérico | Conteúdo revisto de segurança alimentar |
| Advanced Equipamentos | Encaminha Kit básico | Checklist separado outdoor |
| Advanced Autodefesa e Segurança | Atalho Academy genérico | Conteúdo de avaliação de risco e prevenção |
| 6 atalhos Home | Branch: acessíveis, com destinos correspondentes | Refinar conteúdo, testes e acessibilidade |
| Rodapé Academy | Funcional, 4 guias introdutórios | CMS, revisão editorial e cache offline |
| Rodapé Mapas | Placeholder honesto | Mapa operacional com dados e privacidade |
| Rodapé Mais | Overlay fullscreen, 14 ícones, 10 tiles com texto/gradientes | Vincular fotos locais, harmonizar ícones SVG e imagens |
| Alertas e Riscos | Placeholder explícito, NÃO tempo real | Integração dados oficiais, região, hora, aviso de atualização |
| Preparação Familiar | Atalho para plano | Ampliar composição e membro familiar |
| Comunicação | Atalho Contatos | Plano de comunicação offline / instruções aprovadas |
| Água / Alimentos | Módulo suprimentos existente | Estoque e validade |
| Fogo / Abrigo / Primeiros Socorros | Atalhos de Academy sem conteúdos específicos | Bibliotecas curadas e guias progressivos |
| Preferência visual salva | LocalStorage sos360:last-area; ZIP usa sos360.module | Migrar de chave do protótipo, teste de reload |
| Fotos de topo e cards | Montagem de baixa resolução com as 13 fotos do ZIP publicada na branch e aplicada por CSS | Publicar 13 assets individuais otimizados em apps/web/public/interface/img/ e remover dependência do sprite de preview |
| SVG do ZIP | Símbolos SVG portados para componente SOSIcon | Revisar correspondência exata com fonte e todos os módulos |
| Desktop/mobile | CSS responsivo em branch | Testes em iOS/Android e leitura por teclado/leitor de tela |

## Roadmap de execução

### Fase A — Fechar interface de referência (P0)
- [x] Criar branch de UI sem alterar produção e preservar funções.
- [x] Estruturar escolha de área, menus, 6 cards por área, rodapé e Mais.
- [x] Adicionar identidade escura/vermelho/verde e SVG vectorial reutilizável.
- [x] Integrar preview de foto (sprite JPEG de 13 imagens derivadas do ZIP) ao dashboard.
- [ ] Incluir as 13 fotos originais do ZIP, otimizadas, com dimensões/alt, e commitá-las individualmente no repo.
- [ ] Verificar todas as telas comparando com screenshots do ZIP, inclusive menu Mais.
- [ ] Corrigir eventuais erros de TS/compilação, testar kit/contatos/plano/suprimentos/backup.
- [ ] Revisar WCAG, foco/teclado/touch, evitar renderização enganosa de placeholders.
- [ ] Fazer PR, passar CI, merge e testar domínio público real.

### Fase B — Backend e sincronização (P0)
- [ ] Confirmar provisionamento de Postgres: chamada Railway deploy-template foi aceita mas serviço não apareceu em list-services na checagem; NÃO declarar banco pronto.
- [ ] Migrations versionadas Prisma/PostgreSQL; separar bootstrap de operação de API.
- [ ] Auth segura + sessão HttpOnly, isolamento por família/usuário e logout/recovery.
- [ ] Versionamento/controle de conflitos, políticas de importação/substituição e testes entre dois navegadores.
- [ ] Revisão LGPD e mecanismos de backup/restauração.

### Fase C — Conteúdo com utilidade emergencial (P1)
- [ ] Mapas e orientação (Advanced), alertas oficiais, prevenção de riscos (Family).
- [ ] Saúde/primeiros cuidados, casa segura, crianças/idosos, comunicação e fogo/abrigo.
- [ ] Conteúdo versionado por fonte, data de revisão, contexto/região e offline disponível.
- [ ] PWA instalável com offline de planos, kits e guias anteriormente salvos.

### Fase D — Expansão (P2)
- [ ] Formação SOS Academy, checklists especializados, expedições, gamificação.
- [ ] Admin/CMS, IA com base verificada, assinaturas e comunidade moderada.

## Branches de trabalho
- UI: feature/visual-navigation-family-advanced (esta entrega; não publicar antes de testar).
- Backend experimental anterior: feature/postgres-auth-sync-foundation. NÃO mesclar sem revisão: API/auth/sync ainda não foi testada ou conectada a DB; frontend/cloud sync incompleto.
- main: versão publicada anterior, manter estabilidade.
