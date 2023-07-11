import { Router } from "express";
const router = Router();

import * as controller from '../controllers/appController.js';


router.route('/register').post(controller.register);// register user

export default router;
