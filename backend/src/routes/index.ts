import { Router } from 'express';
import loginRoutes from './login.routes';
import signupRoutes from './signup.routes';
import userRoutes from './user.routes';
import passwdRecoveryRoutes from './passrecovery.routes';
const router = Router();

router.use('/login', loginRoutes);
router.use('/signup', signupRoutes);
router.use('/user', userRoutes);
router.use('/passwdRecovery', passwdRecoveryRoutes);

export default router;