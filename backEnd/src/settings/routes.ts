import bcrypt from 'bcrypt';
import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthenticatedRequest } from '../login/middlewares/auth.middleware.js';
export const settingsRoutes=Router();
const defaults={idleMinutes:30,honorariumPercent:20,hourlyRate:350};
settingsRoutes.use('/settings',authMiddleware);
settingsRoutes.get('/settings',async(req:AuthenticatedRequest,res)=>{
 try {const user=await prisma.user.findUniqueOrThrow({where:{id:req.user!.userId},select:{preferences:true}});res.setHeader('Cache-Control','no-store');res.json({...defaults,...(user.preferences as object)});}catch{res.status(503).json({message:'Não foi possível carregar as preferências.'});}
});
settingsRoutes.put('/settings',async(req:AuthenticatedRequest,res)=>{
 const {idleMinutes,honorariumPercent,hourlyRate}=req.body;
 if (![15,30].includes(idleMinutes) || typeof honorariumPercent!=='number' || !Number.isFinite(honorariumPercent) || honorariumPercent<0 || honorariumPercent>100 || typeof hourlyRate!=='number' || !Number.isFinite(hourlyRate) || hourlyRate<0 || hourlyRate>1000000) {res.status(400).json({message:'Confira os valores das preferências.'});return;}
 try {const preferences={idleMinutes,honorariumPercent,hourlyRate};await prisma.user.update({where:{id:req.user!.userId},data:{preferences}});res.json(preferences);}catch{res.status(503).json({message:'Não foi possível salvar as preferências.'});}
});

settingsRoutes.post('/settings/password',async(req:AuthenticatedRequest,res)=>{
 const {currentPassword,newPassword}=req.body;
 if(typeof currentPassword!=='string'||typeof newPassword!=='string'||newPassword.length<8||Buffer.byteLength(newPassword)>72||!/[A-Z]/.test(newPassword)||!/[a-z]/.test(newPassword)||!/[0-9]/.test(newPassword)||!/[^A-Za-z0-9]/.test(newPassword)){res.status(400).json({message:'Use uma nova senha com 8 caracteres ou mais, maiúscula, minúscula, número e símbolo.'});return;}
 try{const user=await prisma.user.findUniqueOrThrow({where:{id:req.user!.userId}});if(!await bcrypt.compare(currentPassword,user.password)){res.status(400).json({message:'Senha atual incorreta.'});return;}
 const password=await bcrypt.hash(newPassword,10);
 await prisma.$transaction(async tx=>{const updated=await tx.user.updateMany({where:{id:user.id,password:user.password,sessionVersion:user.sessionVersion},data:{password,sessionVersion:{increment:1}}});if(!updated.count)throw new Error('Sessão mudou');await tx.passwordResetToken.updateMany({where:{userId:user.id},data:{expiresAt:new Date()}});});res.json({message:'Senha atualizada. Entre novamente.'});
 }catch{res.status(400).json({message:'Não foi possível atualizar. Entre novamente e tente outra vez.'});}
});
