import { Request, Response } from 'express';
import { randomBytes, createHash } from 'node:crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma.js';
import { sendResetPasswordEmail } from '../../lib/mailer.js';
const digest = (token: string) => createHash('sha256').update(token).digest('hex');
const generic = 'Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.';
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  if (!email || email.length > 254) { res.status(400).json({message:'Informe um e-mail válido.'}); return; }
  try {
    const user = await prisma.user.findUnique({where:{email}});
    if (user?.active) {
      const recent = await prisma.passwordResetToken.count({where:{userId:user.id,createdAt:{gte:new Date(Date.now()-15*60000)}}});
      if (recent < 3) {
        const token = randomBytes(32).toString('hex');
        await prisma.passwordResetToken.create({data:{userId:user.id,token:digest(token),expiresAt:new Date(Date.now()+3600000)}});
        try { await sendResetPasswordEmail(email,token); }
        catch { console.error('Falha no envio do e-mail de recuperação. Verifique o provedor de e-mail.'); }
      }
    }
    res.setHeader('Cache-Control','no-store');res.json({message:generic});
  } catch { res.status(503).json({message:'Não foi possível solicitar a recuperação. Tente novamente mais tarde.'}); }
};
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const {token,newPassword}=req.body;
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token) || typeof newPassword !== 'string' || newPassword.length<8 || Buffer.byteLength(newPassword)>72 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {res.status(400).json({message:'Link ou senha inválidos. Use 8 caracteres ou mais, com maiúscula, minúscula, número e símbolo (até 72 bytes).'});return;}
  try {
    const record=await prisma.passwordResetToken.findUnique({where:{token:digest(token)},include:{user:{select:{active:true}}}});
    if (!record || !record.user.active || record.expiresAt<=new Date()) {res.status(400).json({message:'Link inválido, expirado ou já utilizado. Solicite outro.'});return;}
    const password=await bcrypt.hash(newPassword,10);
    await prisma.$transaction(async tx=>{
      const claimed=await tx.passwordResetToken.updateMany({where:{id:record.id,expiresAt:{gt:new Date()}},data:{expiresAt:new Date()}});
      if (!claimed.count) throw new Error('Link utilizado');
      await tx.user.update({where:{id:record.userId},data:{password,sessionVersion:{increment:1}}});
      await tx.passwordResetToken.updateMany({where:{userId:record.userId},data:{expiresAt:new Date()}});
    });
    res.setHeader('Cache-Control','no-store');res.json({message:'Senha redefinida. Entre novamente.'});
  } catch {res.status(400).json({message:'Não foi possível redefinir. Solicite outro link.'});}
};
