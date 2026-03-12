import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger'
import { prisma } from './lib/prisma'
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

const defaultAllowedOrigins: Array<string | RegExp> = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:8081',
  // Render static sites often get an auto-suffixed subdomain like:
  // https://advocacia-frontend-f86x.onrender.com
  /^https:\/\/advocacia-frontend(-[a-z0-9]+)?\.onrender\.com$/,
  /^http:\/\/172\.24\.0\.\d+:8080$/,
  /^http:\/\/192\.168\.\d+\.\d+:8080$/,
]

function parseCorsOriginsFromEnv(): string[] {
  const raw = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '').trim()
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
      // Requests sem Origin (ex: curl, health checks) devem passar.
      if (!origin) return callback(null, true)

      if (allowAllOrigins) return callback(null, true)

      const allowed: Array<string | RegExp> = [
        ...defaultAllowedOrigins,
        ...envAllowedOrigins.filter((o) => o !== '*'),
      ]

      const ok = allowed.some((rule) =>
        typeof rule === 'string' ? rule === origin : rule.test(origin)
      )

      return ok ? callback(null, true) : callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

server.use(express.json())

server.get('/health', (req: Request, res: Response) => {
  return res.status(200).json({ ok: true })
})

server.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

server.use('/api', clientRoutes)
server.use('/api', ProcessRouter)
server.use('/api', lawyerRoutes)
server.use('/api', appointmentRoutes)
server.use('/api', petitionRoutes)
server.use('/api', loginRouter)
server.use('/api', userRoutes)
server.use('/api', notificationsRouter)

server.use((req: Request, res: Response) => {
  return res.status(404).json({ message: 'Route not found' })
})

server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  return res.status(500).json({
    message: err.message || 'Internal server error',
  })
})

const PORT = Number(process.env.PORT) || 3333

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Accessible at http://localhost:${PORT} and http://0.0.0.0:${PORT}`)
})
