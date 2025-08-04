import { Router } from 'express';
import { passwdRecovery, resetPassword } from '../controllers/passrecovery.controller';

const router = Router();

router.post('/', passwdRecovery);
router.put('/', resetPassword);
export default router;
