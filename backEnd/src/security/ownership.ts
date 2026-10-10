import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../login/middlewares/auth.middleware.js'
import { prisma } from '../lib/prisma.js'

export function ownsRecord(model: 'process' | 'petition') {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const record = await (prisma[model] as any).findFirst({
        where: { id: String(req.params.id), userId: req.user?.userId },
        select: { id: true },
      })
      if (!record) return res.status(404).json({ message: 'Registro não encontrado' })
      const clientId = req.body?.clientId ?? req.body?.client_id
      if (clientId && !await prisma.client.findFirst({ where: { id: clientId, userId: req.user?.userId } })) {
        return res.status(400).json({ message: 'Cliente inválido' })
      }
      next()
    } catch (error) { next(error) }
  }
}

export async function adminOnly(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.userId } })
    if (!user?.active || user.role !== 'admin') return res.status(403).json({ message: 'Acesso restrito ao administrador' })
    next()
  } catch (error) { next(error) }
}
