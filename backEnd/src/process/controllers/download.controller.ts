import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../../login/middlewares/auth.middleware.js'
import { prisma } from '../../lib/prisma.js'
export async function DownloadFileController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const path = String(req.query.path || '')
    if (!/^\/files\/[a-zA-Z0-9-]+$/.test(path)) return res.status(404).json({ message: 'Arquivo indisponível. Anexos antigos precisam ser migrados.' })
    const file = await prisma.storedFile.findFirst({ where: { id: path.slice(7), userId: req.user!.userId! } })
    if (!file) return res.status(404).json({ message: 'Arquivo não encontrado' })
    res.setHeader('Content-Type', file.mime)
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`)
    res.setHeader('Cache-Control', 'private, no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    return res.send(Buffer.from(file.content))
  } catch (error) { next(error) }
}
