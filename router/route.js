import { Router } from "express";
const router = Router();

// import register  from '../controllers/appController.js';
// import verifyUser  from '../controllers/appController.js';
// import login  from '../controllers/appController.js';

import * as controller from '../controllers/appController.js';

/** POST Methods */
router.route('/register').post(controller.register);// register user
router.route('/login').post(controller.verifyUser,controller.login); // login in app


/** GET Methods */
router.route('/user/:username').get(controller.getUser) // user with username

export default router;
