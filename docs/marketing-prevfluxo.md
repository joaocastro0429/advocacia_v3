# Apresentação e cadastro do PrevFluxo

A rota `/` apresenta o produto a visitantes. Para uma sessão autenticada, ela mantém o painel existente. As rotas de clientes, processos, agenda, petições e perfil continuam protegidas. `/login` mantém o login; `/login?modo=cadastro` abre o cadastro diretamente.

## Conteúdo comercial

A página usa funcionalidades confirmadas no código: clientes, processos, agenda e petições. A demonstração é ilustrativa, usa dados fictícios e não chama a API. Ela reaproveita o componente de estatísticas do sistema; não representa uma captura de tela de uma conta real.

Não foram publicados preços, período gratuito, clientes, depoimentos, garantias de segurança, integração com tribunais ou ganhos numéricos de produtividade sem comprovação. Para completar a oferta, fornecer preços e regras comerciais, canal real de suporte e depoimentos autorizados. Capturas e vídeo precisam usar uma conta de demonstração com dados fictícios.

## Cadastro e implantação

Nome, OAB, e-mail e senha permanecem obrigatórios. Especialidade foi removida da entrada e pode ser preenchida em `/perfil`. A API `/register` aceita sua ausência e armazena `null`, preservando cadastros antigos que ainda enviam o campo. A política de senha e a verificação de OAB duplicada foram preservadas.

Publicar **o backend atualizado antes do frontend**: o backend antigo exige especialidade e rejeita o formulário simplificado. Não há mudança de schema ou migração de banco. Esta alteração não modifica o fluxo existente de recuperação de senha.

## Medição do funil

Os eventos abaixo são enviados para `window.dataLayer` e para o evento local `prevfluxo:funnel`. Nenhuma ferramenta externa de analytics foi instalada: sem conectar um coletor, não há relatório centralizado nem persistência remota.

| Evento | Disparo |
| --- | --- |
| `prevfluxo_landing_view` | Exibição da página pública |
| `prevfluxo_signup_cta_click` | Clique em um CTA, com posição header/hero/demo/footer |
| `prevfluxo_demo_view` | Clique em um link para a demonstração |
| `prevfluxo_demo_step` | Seleção de clientes/processos/agenda no exemplo |
| `prevfluxo_signup_view` | Exibição do formulário de cadastro |
| `prevfluxo_signup_start` | Primeira alteração de um campo no formulário |
| `prevfluxo_signup_complete` | Resposta bem-sucedida da criação da conta, antes do login automático |
| `prevfluxo_activation` | Primeira criação bem-sucedida de cliente, processo ou compromisso por conta neste navegador |

Payloads contêm apenas nomes de evento e rótulos fixos; não incluem IDs, nomes, e-mails, senhas, números de OAB, parâmetros de URL ou dados de clientes/processos. A deduplicação de ativação usa uma chave local por conta; não é uma medição global entre dispositivos e deixa de funcionar se o armazenamento local estiver bloqueado ou for apagado. Visualizações são contadas por montagem/entrada na rota, não como pessoas únicas.

Ao conectar o coletor escolhido, configure somente estes eventos e rótulos. Avalie visita → início do cadastro, início → conta criada e conta criada → primeiro uso. Não habilite captura automática de formulários ou URLs com parâmetros nas áreas autenticadas.

## Validação

Os testes em `frontEnd/src/test` verificam acesso público versus autenticado, cadastro sem especialidade na interface e no controller da API, demonstração sem rede e deduplicação/falhas de armazenamento do funil. Execute `npm ci`, `npm run test` e `npm run build` em `frontEnd`. Em `backEnd`, execute `npm ci` e `npm run build`.

Na preparação desta alteração, os builds de produção do frontend e backend concluíram. O Vitest indicou sucesso nos 11 casos da suíte (10 novos e 1 existente), mas não encerrou a execução neste ambiente; uma execução isolada do teste trivial existente também não encerrou. Portanto, falta uma execução da suíte com término normal em CI ou outro ambiente. A checagem completa `tsc --noEmit -p tsconfig.app.json` mantém os mesmos cinco erros da versão original, em `Profile.tsx` e `RecentPetitions.tsx`, confirmados em checkout separado do commit base. Não foi feita validação visual no navegador nem cadastro contra um banco real.
