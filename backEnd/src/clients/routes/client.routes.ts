import { Router } from 'express'
import { authMiddleware } from '../../login/middlewares/auth.middleware.js' // ⭐ IMPORTAR O MIDDLEWARE
import { createController} from '../../clients/controllers/create.controller.js'
import { getClient } from '../../clients/controllers/get.controller.js'
import { getClientByIdController } from '../../clients/controllers/getById.controller.js'
import { updateClientController } from '../controllers/update.controller.js'
import { deleteClientController } from '../controllers/delete.controller.js'

const router = Router()

router.post("/clients", authMiddleware, createController)
router.get("/clients", authMiddleware, getClient)
router.get("/clients/:id", authMiddleware, getClientByIdController)
router.put("/clients/:id", authMiddleware, updateClientController)
router.delete("/clients/:id", authMiddleware, deleteClientController)

export { router }
