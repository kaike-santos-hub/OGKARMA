import express from 'express';
import chatController from '../controllers/ogkarmaController.js'

const router = express.Router();

router.post('/', chatController.iniciarChat);

export default router;