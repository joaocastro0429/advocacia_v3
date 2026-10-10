import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '../../login/middlewares/auth.middleware.js'
import { prisma } from '../../lib/prisma.js'
export async function UploadController(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ message: 'Envie um arquivo PDF, PNG ou JPEG de até 3 MB.' })
    const bytes = file.buffer
    const mime = bytes.subarray(0, 5).toString() === '%PDF-' ? 'application/pdf'
      : bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'image/png'
      : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'image/jpeg' : null
    if (!mime) return res.status(400).json({ message: 'Formato de arquivo não permitido.' })
    const stored = await prisma.storedFile.create({ data: { name: file.originalname.slice(0, 200), mime, content: new Uint8Array(bytes), userId: req.user!.userId! } })
    return res.json({ success: true, file: { originalName: stored.name, size: file.size, mimeType: mime, path: `/files/${stored.id}` } })
  } catch (error) { next(error) }
}
