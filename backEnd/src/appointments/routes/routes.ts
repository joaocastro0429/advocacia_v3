import {createAppointment} from '../controllers/create.controller.js'
import {GetAppointment} from '../controllers/get.controller.js'
import {GetByIdAppointment}  from '../controllers/getById.controller.js'
import { updateAppointmentController } from '../controllers/update.controller.js'
import { deleteAppointmentController } from '../controllers/delete.controller.js'
import {Router} from 'express'
import { authMiddleware } from '../../login/middlewares/auth.middleware.js'

export const appointmentRoutes= Router()

appointmentRoutes.post("/appointments", authMiddleware, createAppointment)
appointmentRoutes.get("/appointments", authMiddleware, GetAppointment)
appointmentRoutes.get("/appointments/:id", authMiddleware, GetByIdAppointment)
appointmentRoutes.put("/appointments/:id", authMiddleware, updateAppointmentController)
appointmentRoutes.delete("/appointments/:id", authMiddleware, deleteAppointmentController)
