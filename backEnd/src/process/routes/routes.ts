import {Router} from 'express'
import {CreateProcessController} from '../controllers/process.controller.js'
import {GetprocessController} from '../controllers/get.controller.js'
import {GetProcessById} from '../controllers/getById.js'
import { updateProcessController} from '../controllers/update.controller.js'
import {deleteController} from '../controllers/delete.controller.js'
import { upload } from '../../config/multer.config.js'
import { UploadController } from '../controllers/upload.controller.js'
import { DownloadFileController } from '../controllers/download.controller.js'
import { authMiddleware } from '../../login/middlewares/auth.middleware.js'


export const ProcessRouter= Router()

ProcessRouter.get("/processes", authMiddleware, GetprocessController)
ProcessRouter.get("/processes/:id", authMiddleware, GetProcessById)
ProcessRouter.post("/processes", authMiddleware, CreateProcessController)
ProcessRouter.post("/processes/upload", authMiddleware, upload.single('file'), UploadController)
ProcessRouter.get("/files/download", authMiddleware, DownloadFileController)
ProcessRouter.put("/processes/:id", authMiddleware, updateProcessController)
ProcessRouter.delete("/processes/:id", authMiddleware, deleteController)
