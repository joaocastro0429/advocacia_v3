import { Router } from 'express'
import { authMiddleware, AuthenticatedRequest } from '../login/middlewares/auth.middleware.js'
import { prisma } from '../lib/prisma.js'
import { upload } from '../config/multer.config.js'

export const intakeRoutes = Router()
intakeRoutes.use('/intakes', authMiddleware)
const statuses = ['triagem', 'documentos', 'analise', 'protocolado', 'exigencia', 'pericia', 'deferido', 'indeferido', 'recurso', 'concluido']
const checklist: Record<string, string[]> = {
  'Aposentadoria': ['CNIS atualizado', 'Carteiras de trabalho / comprovantes de contribuição'],
  'Benefício por incapacidade': ['CNIS atualizado', 'Relatórios e documentos médicos'],
  'BPC / LOAS': ['Comprovante do CadÚnico', 'Comprovantes de renda do grupo familiar'],
  'Pensão por morte': ['Certidão de óbito', 'Documentos de vínculo / dependência'],
}
const include = { client: { select: { id: true, name: true } }, items: { include: { file: { select: { id: true, name: true } } }, orderBy: { id: 'asc' as const } }, tasks: { orderBy: { id: 'asc' as const } } }
const owned = (req: AuthenticatedRequest) => ({ id: String(req.params.id), userId: req.user!.userId! })
const dateValue = (value: unknown) => value === null || value === '' ? null : typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value ? new Date(value) : undefined
const touch = (id: string) => prisma.intake.update({ where: { id }, data: { lastActivityAt: new Date() } })

intakeRoutes.get('/intakes/summary', async (req: AuthenticatedRequest, res) => {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
  const records = await prisma.intake.findMany({ where: { userId: req.user!.userId }, include })
  const active = records.filter(i => !['concluido', 'deferido'].includes(i.status))
  const overdue = active.flatMap(i => i.tasks.filter(t => !t.done && t.dueDate && t.dueDate.toISOString().slice(0,10) < today).map(t => ({ intakeId: i.id, intakeTitle: i.title, title: t.title, dueDate: t.dueDate })))
  const requirements = active.filter(i => i.requirementDueAt && i.requirementDueAt.toISOString().slice(0,10) <= today)
  const stalled = active.filter(i => Date.now() - i.lastActivityAt.getTime() >= 7 * 86400000)
  res.json({ active: active.length, pendingDocuments: active.reduce((n,i) => n + i.items.filter(x => !x.received).length,0), overdueTasks: overdue.length, stalledCount: stalled.length, overdue, requirements: requirements.map(i => ({id:i.id,title:i.title,dueDate:i.requirementDueAt})), stalled: stalled.map(i => ({id:i.id,title:i.title,lastActivityAt:i.lastActivityAt})) })
})
intakeRoutes.get('/intakes', async (req: AuthenticatedRequest, res) => {
  const clientId = typeof req.query.clientId === 'string' ? req.query.clientId : undefined
  res.json(await prisma.intake.findMany({ where: { userId: req.user!.userId, ...(clientId ? {clientId} : {}) }, include, orderBy: { createdAt: 'desc' } }))
})
intakeRoutes.post('/intakes', async (req: AuthenticatedRequest, res) => {
  const { title, category, notes, clientId } = req.body
  if (typeof title !== 'string' || !title.trim() || title.length > 200 || typeof category !== 'string' || category.length > 100 || typeof (notes ?? '') !== 'string' || (notes?.length ?? 0) > 10000) return res.status(400).json({ message: 'Informe o nome do atendimento e a categoria.' })
  if (clientId && (typeof clientId !== 'string' || !await prisma.client.findFirst({where:{id:clientId,userId:req.user!.userId}}))) return res.status(400).json({message:'Cliente indisponível.'})
  return res.status(201).json(await prisma.intake.create({ data: {
    title: title.trim(), category, notes: notes ?? '', clientId: clientId || null, userId: req.user!.userId!,
    items: { create: ['Documento de identificação', 'Comprovante de residência', 'Procuração', ...(checklist[category] || ['Documentos do benefício'])].map(title => ({ title })) },
  }, include }))
})
intakeRoutes.put('/intakes/:id', async (req: AuthenticatedRequest, res) => {
  const where = owned(req)
  if (!await prisma.intake.findFirst({ where })) return res.status(404).json({ message: 'Atendimento não encontrado' })
  const data: Record<string, any> = { lastActivityAt: new Date() }
  if ('status' in req.body) { if (!statuses.includes(req.body.status)) return res.status(400).json({ message: 'Status inválido' }); data.status = req.body.status }
  for (const field of ['title', 'protocol', 'benefitNumber', 'notes']) if (field in req.body) {
    const value = req.body[field]
    if (typeof value !== 'string' || value.length > (field === 'notes' ? 10000 : 200) || (field === 'title' && !value.trim())) return res.status(400).json({message:'Texto inválido.'})
    data[field] = value.trim()
  }
  for (const field of ['requestedAt','requirementDueAt']) if (field in req.body) {
    const value = dateValue(req.body[field]); if (value === undefined) return res.status(400).json({message:'Data inválida.'}); data[field] = value
  }
  if ('clientId' in req.body) {
    const id = req.body.clientId
    if (id && (typeof id !== 'string' || !await prisma.client.findFirst({where:{id,userId:req.user!.userId}}))) return res.status(400).json({message:'Cliente indisponível.'})
    data.clientId = id || null
  }
  return res.json(await prisma.intake.update({ where, data, include }))
})
intakeRoutes.post('/intakes/:id/items', async (req: AuthenticatedRequest, res) => {
  if (!await prisma.intake.findFirst({where:owned(req)})) return res.status(404).send()
  const {title} = req.body
  if (typeof title !== 'string' || !title.trim() || title.length > 200) return res.status(400).json({message:'Informe o documento.'})
  const [item] = await prisma.$transaction([prisma.intakeItem.create({data:{intakeId:String(req.params.id),title:title.trim()}}),touch(String(req.params.id))])
  res.status(201).json(item)
})
intakeRoutes.put('/intakes/:id/items/:itemId', async (req: AuthenticatedRequest, res) => {
  if (typeof req.body.received !== 'boolean') return res.status(400).json({ message: 'Valor inválido' })
  const where = { id: String(req.params.itemId), intakeId: String(req.params.id), intake: { userId: req.user!.userId } }
  if (!await prisma.intakeItem.findFirst({where})) return res.status(404).send()
  await prisma.$transaction([prisma.intakeItem.updateMany({where,data:{received:req.body.received}}),touch(String(req.params.id))])
  return res.status(204).send()
})
intakeRoutes.post('/intakes/:id/items/:itemId/file', upload.single('file'), async (req: AuthenticatedRequest, res) => {
  const item = await prisma.intakeItem.findFirst({where:{id:String(req.params.itemId),intakeId:String(req.params.id),intake:{userId:req.user!.userId}}})
  if (!item) return res.status(404).send()
  const file = req.file
  if (!file) return res.status(400).json({message:'Envie PDF, PNG ou JPEG de até 3 MB.'})
  const bytes = file.buffer
  const mime = bytes.subarray(0,5).toString() === '%PDF-' ? 'application/pdf' : bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'image/png' : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'image/jpeg' : null
  if (!mime) return res.status(400).json({message:'Formato não permitido.'})
  await prisma.$transaction(async tx => {
    const stored = await tx.storedFile.create({data:{name:file.originalname.slice(0,200),mime,content:new Uint8Array(bytes),userId:req.user!.userId!}})
    await tx.intakeItem.update({where:{id:item.id},data:{fileId:stored.id,received:true}})
    await tx.intake.update({where:{id:item.intakeId},data:{lastActivityAt:new Date()}})
  })
  res.status(201).json({message:'Arquivo vinculado ao documento.'})
})
intakeRoutes.post('/intakes/:id/tasks', async (req: AuthenticatedRequest, res) => {
  const intakeId = String(req.params.id)
  if (!await prisma.intake.findFirst({ where: owned(req) })) return res.status(404).json({ message: 'Atendimento não encontrado' })
  const { title, dueDate } = req.body
  const date = dateValue(dueDate ?? null)
  if (typeof title !== 'string' || !title.trim() || title.length > 200 || date === undefined) return res.status(400).json({ message: 'Tarefa ou prazo inválido' })
  const [task] = await prisma.$transaction([prisma.intakeTask.create({data:{intakeId,title:title.trim(),dueDate:date}}),touch(intakeId)])
  return res.status(201).json(task)
})
intakeRoutes.put('/intakes/:id/tasks/:taskId', async (req: AuthenticatedRequest, res) => {
  if (typeof req.body.done !== 'boolean') return res.status(400).json({ message: 'Valor inválido' })
  const where = { id: String(req.params.taskId), intakeId: String(req.params.id), intake: { userId: req.user!.userId } }
  if (!await prisma.intakeTask.findFirst({where})) return res.status(404).send()
  await prisma.$transaction([prisma.intakeTask.updateMany({where,data:{done:req.body.done}}),touch(String(req.params.id))])
  return res.status(204).send()
})
