import { prisma } from '../../lib/prisma'

export const GetByIdService = async (id: string) => {
  try {
    const lawyer = await prisma.user.findFirst({
      where: { id, role: "lawyer" },
      select: {
        id: true,
        name: true,
        email: true,
        oab: true,
        specialty: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!lawyer) {
      throw new Error("Lawyer not found")
    }

    return {
      id: lawyer.id,
      name: lawyer.name,
      email: lawyer.email,
      oabNumber: lawyer.oab,
      specialty: lawyer.specialty,
      phone: lawyer.phone,
      createdAt: lawyer.createdAt,
      updatedAt: lawyer.updatedAt,
    }
  } catch (error) {
    throw error
  }
}
