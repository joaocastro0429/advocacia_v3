import { prisma } from '../../lib/prisma'

export const GetService = async () => {
    try {
        const lawyers = await prisma.user.findMany({
            where: { role: "lawyer" },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                oab: true,
                specialty: true,
                phone: true,
                createdAt: true,
            },
        })
        return lawyers.map((lawyer) => ({
            id: lawyer.id,
            name: lawyer.name,
            email: lawyer.email,
            oabNumber: lawyer.oab,
            specialty: lawyer.specialty,
            phone: lawyer.phone,
            createdAt: lawyer.createdAt,
        }))
    } catch (error) {
        console.error('Error fetching lawyers in service:', error)
        throw error
    }
}
