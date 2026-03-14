import { prisma } from '../../lib/prisma'
import bcrypt from "bcrypt"
import { validateStrongPassword } from "../../lib/password-policy"

interface IDataService{
  name: string
  email: string
  oabNumber: string
  specialty:string
  phone:string
  password: string
  
}

export const createService = async (data: IDataService) => {
    try{
        const passwordError = validateStrongPassword(data.password)
        if (passwordError) {
            throw new Error(passwordError)
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const lawyer = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                oab: data.oabNumber,
                specialty: data.specialty,
                phone: data.phone,
                role: "lawyer",
            },
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

    }catch(error){
        console.log(error)
    }
}
