import {createPetitionController} from '../controllers/create.controller.js'
import {getPetitionsController} from '../controllers/get.controller.js' // Updated import
import {GetPetitionByIdController} from '../controllers/getById.controller.js' // Updated import
import {deletePetitionController} from '../controllers/delete.controller.js' // Updated import
import {updatePetitionController} from '../controllers/update.controller.js' // Updated import
import {Router} from 'express'
import { authMiddleware } from '../../login/middlewares/auth.middleware.js'

export const petitionRoutes = Router() // Updated route object name

petitionRoutes.post('/petitions', authMiddleware, createPetitionController) // Updated path and router name
petitionRoutes.get('/petitions', authMiddleware, getPetitionsController) // Updated path and router name
petitionRoutes.get('/petitions/:id', authMiddleware, GetPetitionByIdController) // Updated path and router name
petitionRoutes.put('/petitions/:id', authMiddleware, updatePetitionController) // Updated path and router name
petitionRoutes.delete('/petitions/:id', authMiddleware, deletePetitionController) // Updated path and router name
