
import { Router } from 'express';
import { newUser } from '../controllers/signup.controller';

const router = Router();

router.post('/', newUser);

export default router;