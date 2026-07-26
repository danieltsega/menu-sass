import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.route('/register')
  .post(authController.register)
  .all((_req, res) => res.status(405).json({ success: false, error: 'Method not allowed. Use POST' }));

router.route('/login')
  .post(authController.login)
  .all((_req, res) => res.status(405).json({ success: false, error: 'Method not allowed. Use POST' }));

router.route('/refresh')
  .post(authController.refresh)
  .all((_req, res) => res.status(405).json({ success: false, error: 'Method not allowed. Use POST' }));

export default router;