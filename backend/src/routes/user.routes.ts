
import { Router } from 'express';
import { user } from '../controllers/user.controller';

const router = Router();

router.get('/', user);

export default router;