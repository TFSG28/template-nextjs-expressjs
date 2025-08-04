import { Router } from 'express';
import { user, registerUser } from '../controllers/user.controller';

const router = Router();

router.get('/', user);
router.post('/register', registerUser);
export default router;