# PrevFluxo — publicação Vercel + Neon

A interface existente foi mantida. O módulo /atendimentos acrescenta triagem,
checklist de documentos e tarefas com prazo usando os componentes atuais.
Cada usuário mantém seus próprios registros; colaboração por escritório ainda não está implementada.

## Neon
Criar um projeto PostgreSQL dedicado. DATABASE_URL recebe a conexão com pool;
DIRECT_URL recebe a conexão direta. Guardar as URLs somente nas variáveis de ambiente.
Executar `npm ci` e `npm run db:migrate` dentro de backEnd com DIRECT_URL configurada.
Não executar db push em produção. Para banco existente, conferir o histórico de migrações
antes de aplicar; não substituir nem apagar o banco atual.

## Vercel
Criar dois projetos ligados à branch feat/prevfluxo-piloto:
- API: Root Directory backEnd, Express. Configurar DATABASE_URL, DIRECT_URL,
  JWT_SECRET aleatório, CORS_ORIGIN e FRONTEND_URL com a URL exata da interface.
- Interface: Root Directory frontEnd, Vite. Configurar VITE_API_URL com a URL da API + /api.
Reimplantar após definir as variáveis e verificar login, triagem e acesso isolado entre usuários.

## Anexos
Os novos anexos PDF/PNG/JPEG (até 3 MB) ficam privados em StoredFile no PostgreSQL.
Arquivos antigos em uploads precisam ser importados com a associação correta ao usuário;
esta alteração não os migra automaticamente. O acesso público à pasta uploads foi removido.

## Validação realizada
Build frontend e backend; geração Prisma; teste HTTP das rotas sem autenticação
(confirmado 401) e da pasta uploads (404). Testes com usuários reais e persistência
aguardam banco Neon e publicação. A publicação ainda não foi realizada.
