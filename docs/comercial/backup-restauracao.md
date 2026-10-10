# Backup e restauração — verificação de 10/10/2026

Projeto Neon: sparkling-boat-46854499. Produção: br-cool-wind-b793rjv2.
Snapshot manual anterior à alteração: snap-long-thunder-b7x6by64.
Restauração isolada: br-little-wildflower-b70rn72x (teste-restauracao-20261010).
Contagens conferidas na origem e restauração: 7 usuários, 3 clientes, 4 atendimentos, 1 arquivo.
Nenhuma restauração foi aplicada sobre produção. A cópia de teste permanece privada no projeto.

O projeto informa janela de histórico de 21.600 segundos (6 horas). O endpoint de agendamento de snapshots recusou a configuração: backup schedule creation is not enabled for this project. Não anunciar backups diários automáticos. Snapshot manual e histórico de seis horas não equivalem a uma política de recuperação comercial.

Procedimento: criar snapshot da branch correta; restaurar em nova branch; comparar esquema, contagens e arquivos; validar a aplicação com conexão isolada; só depois decidir sobre uma troca de produção. Não substituir produção automaticamente. A migração de preferências também foi testada na branch br-old-frog-b7lkzt6p.

Antes de operar com clientes pagantes: contratar/revisar a política de snapshots e retenção adequada ou configurar backup independente com monitoramento e teste periódico. Confirmar custos e retenção antes de qualquer upgrade pago.
