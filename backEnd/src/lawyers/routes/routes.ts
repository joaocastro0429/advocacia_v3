import { Router } from 'express';
import { createController } from '../controllers/create.controller.js'
import { Getcontroller } from '../controllers/get.controller.js'
import { GetByIdController } from '../controllers/getById.controller.js'
import { updateLawyerController } from '../controllers/update.controller.js';
import { deleteLawyerController } from '../controllers/delete.controller.js';

export const lawyerRoutes = Router();
lawyerRoutes.get('/lawyer', Getcontroller)
lawyerRoutes.get('/lawyer/:id', GetByIdController)

lawyerRoutes.post('/lawyer', createController)

lawyerRoutes.put('/lawyer/:id', updateLawyerController)
lawyerRoutes.delete('/lawyer/:id', deleteLawyerController)

