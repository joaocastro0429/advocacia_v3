import { prisma } from "../../lib/prisma.js"

export const deleteAppointment = async (id: string, userId: string) => {
  const existing = await prisma.appointment.findFirst({
    where: { id, userId },
    select: { id: true },
  })

  if (!existing) {
    throw new Error("Compromisso nao encontrado")
  }

  await prisma.appointment.delete({
    where: {
      id,
    },
  })
}
