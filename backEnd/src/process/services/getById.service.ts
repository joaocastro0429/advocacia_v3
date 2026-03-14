import { prisma } from '../../lib/prisma.js'

export const GetById = async (data: any) => {
  try {
    const process = await prisma.process.findMany({
      where: {
        clientId: data.id
      }
    })

    return process

  } catch (erro: any) {
    throw new Error("Process not found!!")
  }
}
