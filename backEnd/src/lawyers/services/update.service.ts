import { prisma } from '../../lib/prisma'

// Campos permitidos para atualizar (conforme schema Lawyer)
export const updateLawyer = async (
  id: string,
  data: any
) => {
  if (!id) throw new Error('ID is required')

  const updateData: any = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.email !== undefined) updateData.email = data.email
  if (data.oabNumber !== undefined) updateData.oab = data.oabNumber
  if (data.specialty !== undefined) updateData.specialty = data.specialty
  if (data.phone !== undefined) updateData.phone = data.phone

  const lawyer = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      oab: true,
      specialty: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    }
  })

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
}
