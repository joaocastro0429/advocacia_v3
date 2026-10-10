# Aviso de privacidade PrevFluxo — minuta para revisão

Versão 10/10/2026. Minuta ainda não publicada; não representa certificação de conformidade.

## Quem atende
Contato informado pelo responsável João Castro: joaocastro_125@hotmail.com e (62) 98245-4512. Confirmar a identificação legal completa do fornecedor e o responsável pelo atendimento às solicitações de privacidade.

## Dados e finalidade
A aplicação registra identificação profissional e e-mail de conta, senha em hash, dados de clientes, processos, atendimentos, tarefas, agenda, petições e documentos enviados. Arquivos e anotações podem conter informações jurídicas e de saúde; devem ser limitados ao necessário e não usados em demonstrações com pessoas reais. As finalidades operacionais são autenticar a conta, organizar a rotina e permitir atendimento e suporte.

## Papéis
O escritório decide sobre o tratamento dos dados de seus clientes. A relação entre escritório e fornecedor, as instruções para tratamento e os papéis em cada operação devem ser definidos no contrato. O fornecedor também precisa definir seu papel quanto aos dados de cadastro e suporte. Não atribuir papéis de forma automática sem examinar as atividades.

## Infraestrutura
Frontend e API na Vercel; registros e arquivos privados no PostgreSQL Neon, projeto configurado na região AWS us-east-1. Isso pode envolver tratamento fora do Brasil. Confirmar contratos com fornecedores, subprocessadores e mecanismos aplicáveis antes da publicação. O provedor de e-mail transacional ainda precisa ser configurado e identificado.

## Armazenamento e acesso
A aplicação exige autenticação e restringe atendimentos e arquivos por usuário. A senha é armazenada como hash; recuperação usa token de uso único com validade de uma hora. No navegador são utilizados armazenamento local para a sessão e informações de atividade. Não afirmar que isso constitui auditoria completa de segurança.

## Solicitações e retenção
Pedidos de acesso, correção, exportação ou exclusão devem ser encaminhados ao contato acima e verificados para evitar divulgação a terceiros. Definir prazos de resposta e procedimento operacional. Ainda é necessário definir retenção de contas, registros, arquivos, logs e backups, bem como exceções de conservação e procedimento para incidentes.

## Referências para revisão
- ANPD, guia dos agentes de tratamento: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-para-definicoes-dos-agentes-de-tratamento-de-dados-pessoais-e-do-encarregado
- ANPD, informações aos titulares: https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados

Antes da publicação: confirmar responsável legal, bases e finalidades do tratamento, contratos e transferência internacional, retenção e atendimento; revisão jurídica e operacional. A minuta não impõe aceite aos usuários.
