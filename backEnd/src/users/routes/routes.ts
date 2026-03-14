import { RequestHandler, Router } from 'express';
import { createUserController } from '../controllers/create.controller.js';
import { getUsersController } from '../controllers/get.controller.js';
import { getUserByIdController } from '../controllers/getById.controller.js';
import { updateUserController } from '../controllers/update.controller.js';
import { authMiddleware } from '../../login/middlewares/auth.middleware.js';

const userRoutes = Router();

// Rotas públicas
userRoutes.post('/users', createUserController);

// Rotas protegidas por autenticação
userRoutes.get('/users', authMiddleware, getUsersController);
userRoutes.get('/users/:id', authMiddleware, getUserByIdController);
userRoutes.put('/users/:id', authMiddleware, updateUserController);

export const notfound:RequestHandler=  (req,res,next)=>{
    next()
    return res.status(404).json({message:"not found"})
}

export { userRoutes };
