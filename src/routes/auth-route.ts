import express from "express";
const router = express.Router();
import { check } from "express-validator"; //import express-validator module
import authController, {authMiddleware} from "../controllers/auth-controllers";

router.delete("/:id", authMiddleware, authController.deleteUser);

router.put("/:id", authMiddleware, authController.updateUser);

router.get("/:id", authController.getUser);

//Signup user
router.post(
    "/signup",
    [
      check("email")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),
      check("username").not().isEmpty().withMessage("Username is required"),
      check("password").isLength({ min: 6 }).withMessage("password is required"),
      check("firstName").not().isEmpty().withMessage("First name is required"),
      check("lastName").not().isEmpty().withMessage("Last name is required"),
    ],
    authController.signup
  );
  
router.post(
    "/login",[
        check("username").notEmpty().withMessage("Please enter a valid username"),
        check("password").notEmpty().withMessage("Password is required")
    ],
    authController.login
);

router.post(
  "/logout",
  authController.logout
);


export default router;