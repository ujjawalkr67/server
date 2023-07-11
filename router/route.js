import { Router } from "express";
const router = Router();

import register  from '../controllers/appController.js';


router.route('/register').post(register);// register user

export default router;
