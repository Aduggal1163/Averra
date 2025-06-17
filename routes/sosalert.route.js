import express from 'express';
import { createSOSAlert, getAllSOSAlerts, respondToSOSAlert } from '../controllers/sosalert.controller.js';
import { requireSignIn } from '../middlewares/auth.js';

const router = express.Router();

router.post('/create', requireSignIn, createSOSAlert);
router.get('/all', requireSignIn, getAllSOSAlerts);
router.post('/respond/:alertId', requireSignIn, respondToSOSAlert);

export default router;
