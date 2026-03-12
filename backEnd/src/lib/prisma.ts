import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") })

let prismaInstance: PrismaClient | null = null

function getConnectionString(): string {
  let connectionString = `${process.env.DATABASE_URL || ""}`.trim()

  // Compatibilidade com configs antigas que usavam host 'base'.
  if (connectionString.includes("@base:")) {
    connectionString = connectionString.replace("@base:", "@localhost:")
    console.warn("[prisma] Host 'base' detectado na DATABASE_URL. Usando 'localhost'.")
  }

  return connectionString
}

function getPrisma(): PrismaClient {
  if (prismaInstance) return prismaInstance

  const connectionString = getConnectionString()
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL nao configurada. Configure a env var DATABASE_URL (ex: no Render -> Environment)."
    )
  }

  const adapter = new PrismaPg({ connectionString })
  prismaInstance = new PrismaClient({ adapter })
  return prismaInstance
}

// Lazy proxy: permite o servidor subir mesmo sem DATABASE_URL; falha apenas quando usar o Prisma.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const real = getPrisma() as any
    return real[prop]
  },
}) as PrismaClient
