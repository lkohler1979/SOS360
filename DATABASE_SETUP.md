# SOS360 — Habilitar PostgreSQL e sincronização (runbook)

Última verificação: 2026-11-09. **O banco não existe no Railway neste momento.** O projeto apresenta apenas `sos360-beta-web` e `sos360-beta-api`. A criação de serviço `sos360-postgres` foi recusada com:

```
Free plan resource provision limit exceeded. Please upgrade to provision more resources!
```

A solicitação anterior de template `postgres` retornou um workflow, mas não gerou nenhum serviço acessível. Não afirmar que o banco existe até aparecer em Services e Online.

## 1. Dependência de conta
O proprietário precisa liberar capacidade para criar um serviço adicional no workspace Railway (por exemplo, atualizar o plano). O projeto é https://railway.com/project/428e6143-a2e5-4013-bd24-06f7bb127143 . **Não excluir, substituir nem reaproveitar** o serviço SevenBible ou seus volumes.

## 2. Banco dedicado
No projeto SOS360, ambiente production, criar PostgreSQL persistente pelo template oficial ou serviço de banco gerenciado. Nome sugerido: `sos360-postgres`. Confirmar volume persistente em `/var/lib/postgresql/data`, variáveis geradas pelo provedor, health e backup. Não expor porta Postgres publicamente sem necessidade. Não colar senha ou URL completa do banco em issues, chats, docs ou código.

## 3. API
No serviço `sos360-beta-api`, adicionar variável `DATABASE_URL` referenciando a variável de conexão privada do Postgres no Railway, por exemplo `${{sos360-postgres.DATABASE_URL}}` **somente se o serviço e a variável tiverem exatamente esses nomes no Railway**. O código da branch `feature/cloud-storage-integration` usa `pg` e cria `sos_users`, `sos_sessions` e `sos_state` numa transação de inicialização (migrações versionadas continuam pendentes para produção definitiva). `GET /health` deve informar `database: online`; não considerar `not-configured` saudável.

## 4. Frontend
Configurar `SOS360_API_URL` no serviço web para a URL privada da API quando a rede privada e a porta forem confirmadas; o código possui URL pública como fallback. O frontend faz proxy de /api/cloud com cookie HttpOnly, SameSite Strict. O navegador não recebe o bearer token em JSON.

## 5. Validação antes de merge
- API sobe sem erro, consulta `SELECT 1` e informa banco online.
- Criar conta teste A, armazenar kit e suprimentos, sair/entrar; dados sobrevivem a reinício do serviço.
- Criar conta teste B e verificar que não lê/edita dados de A.
- Vincular dados de dois dispositivos, testar conflito simultâneo; segunda gravação obsoleta deve receber 409.
- Exportar backup antes de substituir dados locais; testar restauração, erro de rede, logout e expiração de sessão.
- Executar auditoria de dependências, reforçar limites de tentativas, tratamento de dados pessoais, backup e recuperação de senha.
- GitHub CI verde, revisão de segurança, PR aprovado, merge e deployment SUCCESS, testes HTTP e de interface no domínio oficial.

## Estado de recursos
O projeto SOS360 publicado continua gravando em `localStorage` até a ativação. A nova branch não foi mesclada em `main` nem implantada, para evitar uma experiência de login que não funciona.

A documentação das pendências consta em [TASKS.md](TASKS.md), SOS-065 a SOS-074.
