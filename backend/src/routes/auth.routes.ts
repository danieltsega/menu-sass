import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware';
import { registerSchema, loginSchema, refreshSchema } from '../validators';

const router = Router();

router.route('/register')
  .post(validate(registerSchema), authController.register)
  .all((_req, res) => res.status(405).json({ success: false, error: 'Method not allowed. Use POST' }));

router.route('/login')
  .post(validate(loginSchema), authController.login)
  .all((_req, res) => res.status(405).json({ success: false, error: 'Method not allowed. Use POST' }));

router.route('/refresh')
  .post(validate(refreshSchema), authController.refresh)
  .all((_req, res) => res.status(405).json({ success: false, error: 'Method not allowed. Use POST' }));

export default router;