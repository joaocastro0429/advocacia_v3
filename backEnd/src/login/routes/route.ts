import { Router } from 'express'
import { loginController } from '../../login/controllers/login.js'
import { forgotPassword, resetPassword } from '../../login/controllers/authControllers.js'
import { RegisterController } from '../../login/controllers/register.js'

const loginRouter = Router()

loginRouter.post('/login', loginController)
loginRouter.post('/register', RegisterController)
loginRouter.post('/forgot-password', forgotPassword)
loginRouter.post('/reset-password', resetPassword)

export { loginRouter }
