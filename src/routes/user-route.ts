import express, { Router, Request, Response } from "express"; //import express module
import userController from "../controllers/user-controllers"; //import user-controller module
const router = express.Router();
import { check } from "express-validator"; //import express-validator module

//Signup user
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .normalizeEmail(),
    check("username").not().isEmpty().withMessage("Username is required"),
    check("password").isLength({ min: 6 }).withMessage("Username is required"),
    check("firstName").not().isEmpty().withMessage("First name is required"),
    check("lastName").not().isEmpty().withMessage("Last name is required"),
  ],
  userController.signup
);

router.post(
    "/login",[
        check("email").isEmail().withMessage("Please enter a valid email address").normalizeEmail(),
        check("password").notEmpty().withMessage("Password is required")
    ],
    userController.login
);

router.post("/logout", userController.logout);

export default router;
