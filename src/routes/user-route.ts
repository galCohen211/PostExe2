import express, { Router, Request, Response } from "express"; //import express module
import userController from "../controllers/user-controllers"; //import user-controller module
const router = express.Router();
import { check } from "express-validator"; //import express-validator module


router.post("/logout", userController.logout);

export default router;
