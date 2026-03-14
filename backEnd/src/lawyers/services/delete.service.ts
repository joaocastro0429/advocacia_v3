import { prisma } from '../../lib/prisma.js';

export const deleteLawyer = async (id: string) => {
  return await prisma.user.delete({
    where: { id },
  });
};
