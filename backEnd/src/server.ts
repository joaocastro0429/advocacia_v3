import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger'

import { router as clientRoutes } from './clients/routes/client.routes'
import { ProcessRouter } from './process/routes/routes'
import { lawyerRoutes } from './lawyers/routes/routes'
import { appointmentRoutes } from './appointments/routes/routes'
import { petitionRoutes } from './petitions/routes/routes'
import { loginRouter } from './login/routes/route'
import { userRoutes } from './users/routes/routes'
import { notificationsRouter } from './notifications/routes/routes'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = express()

// ================= CORS =================

const defaultAllowedOrigins: Array<string | RegExp> = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  /^https:\/\/[a-z0-9-]+\.onrender\.com$/,
]

function parseCorsOriginsFromEnv(): string[] {
  const raw = (process.env.CORS_ORIGINS || '').trim()
  if (!raw) return []

  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

const envAllowedOrigins = parseCorsOriginsFromEnv()
const allowAllOrigins = envAllowedOrigins.includes('*')

server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      if (allowAllOrigins) return callback(null, true)

      const allowed: Array<string | RegExp> = [
        ...defaultAllowedOrigins,
        ...envAllowedOrigins.filter((o) => o !== '*'),
      ]

      const ok = allowed.some((rule) =>
        typeof rule === 'string' ? rule === origin : rule.test(origin)
      )

      if (!ok) {
        console.warn('[CORS BLOCKED]', origin)
      }

      return ok ? callback(null, true) : callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  })
)

// ================= Middlewares =================

server.use(express.json())

// ================= Uploads =================

const uploadsPath = path.resolve(__dirname, '..', 'uploads')

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true })
}

server.use('/uploads', express.static(uploadsPath))

// ================= api Check =================

server.get('/api', (req: Request, res: Response) => {
  return res.status(200).json({ ok: true })
})

// ================= Swagger =================

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// ================= Routes =================

server.use('/api', clientRoutes)
server.use('/api', ProcessRouter)
server.use('/api', lawyerRoutes)
server.use('/api', appointmentRoutes)
server.use('/api', petitionRoutes)
server.use('/api', loginRouter)
server.use('/api', userRoutes)
server.use('/api', notificationsRouter)

// ================= 404 =================

server.use((req: Request, res: Response) => {
  return res.status(404).json({
    message: 'Route not found',
  })
})

// ================= Error Handler =================

server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER ERROR]', err)

  return res.status(500).json({
    message: err.message || 'Internal server error',
  })
})

// ================= Server =================

const PORT = Number(process.env.PORT) || 3333

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
