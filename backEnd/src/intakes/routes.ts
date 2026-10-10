import { Router } from 'express'
import { authMiddleware, AuthenticatedRequest } from '../login/middlewares/auth.middleware.js'
import { prisma } from '../lib/prisma.js'

export const intakeRoutes = Router()
intakeRoutes.use('/intakes', authMiddleware)
const statuses = ['triagem', 'documentos', 'analise', 'concluido']
intakeRoutes.get('/intakes', async (req: AuthenticatedRequest, res) => {
  res.json(await prisma.intake.findMany({ where: { userId: req.user!.userId }, include: { items: true, tasks: true }, orderBy: { createdAt: 'desc' } }))
})
intakeRoutes.post('/intakes', async (req: AuthenticatedRequest, res) => {
  const { title, category, notes } = req.body
  if (typeof title !== 'string' || !title.trim() || title.length > 200 || typeof category !== 'string' || category.length > 100 || typeof (notes ?? '') !== 'string') {
    return res.status(400).json({ message: 'Informe o nome do atendimento e a categoria.' })
  }
  return res.status(201).json(await prisma.intake.create({ data: {
    title: title.trim(), category, notes: notes ?? '', userId: req.user!.userId!,
    items: { create: ['Documento de identificação', 'Comprovante de residência', 'Procuração', 'Documentos do benefício / CNIS'].map(title => ({ title })) },
  }, include: { items: true, tasks: true } }))
})
intakeRoutes.put('/intakes/:id', async (req: AuthenticatedRequest, res) => {
  const where = { id: String(req.params.id), userId: req.user!.userId }
  if (!await prisma.intake.findFirst({ where })) return res.status(404).json({ message: 'Atendimento não encontrado' })
  if (!statuses.includes(req.body.status)) return res.status(400).json({ message: 'Status inválido' })
  return res.json(await prisma.intake.update({ where, data: { status: req.body.status } }))
})
intakeRoutes.put('/intakes/:id/items/:itemId', async (req: AuthenticatedRequest, res) => {
  if (typeof req.body.received !== 'boolean') return res.status(400).json({ message: 'Valor inválido' })
  const result = await prisma.intakeItem.updateMany({ where: { id: String(req.params.itemId), intakeId: String(req.params.id), intake: { userId: req.user!.userId } }, data: { received: req.body.received } })
  return res.status(result.count ? 204 : 404).send()
})
intakeRoutes.post('/intakes/:id/tasks', async (req: AuthenticatedRequest, res) => {
  const intakeId = String(req.params.id)
  if (!await prisma.intake.findFirst({ where: { id: intakeId, userId: req.user!.userId } })) return res.status(404).json({ message: 'Atendimento não encontrado' })
  const { title, dueDate } = req.body
  if (typeof title !== 'string' || !title.trim() || title.length > 200 || (dueDate && !Number.isFinite(Date.parse(dueDate)))) return res.status(400).json({ message: 'Tarefa ou prazo inválido' })
  return res.status(201).json(await prisma.intakeTask.create({ data: { intakeId, title: title.trim(), dueDate: dueDate ? new Date(dueDate) : null } }))
})
intakeRoutes.put('/intakes/:id/tasks/:taskId', async (req: AuthenticatedRequest, res) => {
  if (typeof req.body.done !== 'boolean') return res.status(400).json({ message: 'Valor inválido' })
  const result = await prisma.intakeTask.updateMany({ where: { id: String(req.params.taskId), intakeId: String(req.params.id), intake: { userId: req.user!.userId } }, data: { done: req.body.done } })
  return res.status(result.count ? 204 : 404).send()
})
