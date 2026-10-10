import { prisma } from '../../lib/prisma.js'
export const GetById = (id: string) => prisma.process.findUniqueOrThrow({ where: { id } })
