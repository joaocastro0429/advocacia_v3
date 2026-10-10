# Backup e restauração — verificação de 10/10/2026

Projeto Neon: sparkling-boat-46854499. Produção atual: br-little-wildflower-b70rn72x. Branch anterior preservada: br-cool-wind-b793rjv2.
Snapshot manual anterior à alteração: snap-long-thunder-b7x6by64.
Restauração isolada: br-little-wildflower-b70rn72x (teste-restauracao-20261010).
Contagens conferidas na origem e restauração: 7 usuários, 3 clientes, 4 atendimentos, 1 arquivo.
A chamada de restauração com finalize:true finalizou e trocou a branch padrão e o compute de produção, em vez de manter uma cópia isolada. Foi detectado um erro transitório de coluna ausente na API; a migração foi aplicada também à branch atendida pelo site. As duas cópias foram comparadas por contagens e hashes dos registros antes de continuar; usuários, clientes, atendimentos e arquivos eram idênticos. A branch anterior permanece preservada. Em futuras verificações, usar finalize:false e não chamar finalize_branch_restore sem planejar a troca.

O projeto informa janela de histórico de 21.600 segundos (6 horas). O endpoint de agendamento de snapshots recusou a configuração: backup schedule creation is not enabled for this project. Não anunciar backups diários automáticos. Snapshot manual e histórico de seis horas não equivalem a uma política de recuperação comercial.

Procedimento: criar snapshot da branch correta; restaurar em nova branch; comparar esquema, contagens e arquivos; validar a aplicação com conexão isolada; só depois decidir sobre uma troca de produção. Não substituir produção automaticamente. A migração de preferências também foi testada na branch br-old-frog-b7lkzt6p.

Antes de operar com clientes pagantes: contratar/revisar a política de snapshots e retenção adequada ou configurar backup independente com monitoramento e teste periódico. Confirmar custos e retenção antes de qualquer upgrade pago.
