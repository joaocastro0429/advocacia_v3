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
