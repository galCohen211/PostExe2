import express from "express";
const router = express.Router();
import { check } from "express-validator"; //import express-validator module
import authController, {authMiddleware} from "../controllers/auth-controllers";

/**
* @swagger
* components:
*   securitySchemes:
*     bearerAuth:
*       type: http
*       scheme: bearer
*       bearerFormat: JWT
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - username
 *         - firstName
 *         - lastName
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *           example: 'user@example.com'
 *         username:
 *           type: string
 *           description: The user's username
 *           example: 'Ron1'
 *         firstName:
 *           type: string
 *           description: The user's first name
 *           example: 'Ron'
 *         lastName:
 *           type: string
 *           description: The user's last name
 *           example: 'Cohen'
 *         password:
 *           type: string
 *           description: The user's password
 *           example: 'Password123'
 *       example:
 *         email: 'Ron.doe@gmail.com'
 *         username: 'Ron123'
 *         firstName: 'Ron'
 *         lastName: 'Cohen'
 *         password: 'password123'
 */



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

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     description: This endpoint allows a new user to register by providing their email, username, password, first name, and last name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: User's email address
 *               username:
 *                 type: string
 *                 example: Ron1
 *                 description: A unique username for the user
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *                 description: A strong password for the user
 *               firstName:
 *                 type: string
 *                 example: Ron
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 example: Cohen
 *                 description: User's last name
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64b5c52c-7819-4db3-9b68-2df5f1bc2a2e
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     username:
 *                       type: string
 *                       example: Ron1
 *       400:
 *         description: Bad request. Validation error, email, or username already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post(
    "/login",[
        check("username").notEmpty().withMessage("Please enter a valid username"),
        check("password").notEmpty().withMessage("Password is required")
    ],
    authController.login
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - User
 *     description: This endpoint allows users to log in by providing their username and password. If successful, it returns an access token and a refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: Ron1
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *                 description: The password of the user
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: JWT access token for authenticated requests
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: JWT refresh token for requesting new access tokens
 *       400:
 *         description: Bad request. Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Incorrect email or password, please try again
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.post(
  "/logout",
  authController.logout
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logs out a user by removing their refresh token
 *     tags:
 *       - User
 *     description: This endpoint allows the user to log out by invalidating the refresh token. The token is removed from the user's tokens array in the database.
 *     operationId: logout
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: auth
 *         required: true
 *         description: The current access token of the user.
 *         schema:
 *           type: string
 *           example: JWT 60d0fe4f5311236168a109ca
 *     responses:
 *       '200':
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Logout successful'
 *       '400':
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid or expired token'
 *       '401':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid request: User not found'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal Server Error'
 */


router.post("/refresh_token", authController.refresh_token);

/**
 * @swagger
 * /auth/refresh_token:
 *   post:
 *     summary: Gets a new refresh token.
 *     tags:
 *       - User
 *     description: Gets a new refresh token.
 *     parameters:
 *       - in: header
 *         name: auth
 *         required: true
 *         description: The current access token of the user.
 *         schema:
 *           type: string
 *           example: JWT 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: new refresh token was generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: JWT access token for authenticated requests
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: JWT refresh token for requesting new access tokens
 *       403:
 *         description: Invalid request or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: invalid token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */


/**
 * @swagger
 * /auth/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - User
 *     description: Fetches a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to fetch
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User found
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     username:
 *                       type: string
 *                       example: Ron1
 *                     firstName:
 *                       type: string
 *                       example: Ron
 *                     lastName:
 *                       type: string
 *                       example: Cohen
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */

/**
 * @swagger
 * /auth/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - User
 *     description: Deletes a user from the database by their unique user ID.
 *     operationId: deleteUser
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *       - in: header
 *         name: auth
 *         required: true
 *         description: The current access token of the user.
 *         schema:
 *           type: string
 *           example: JWT 60d0fe4f5311236168a109ca
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User deleted successfully'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */

/**
 * @swagger
 * /auth/{id}:
 *   put:
 *     summary: Edit a user by ID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *           example: 60d0fe4f5311236168a109ca
 *       - in: header
 *         name: auth
 *         required: true
 *         description: The current access token of the user.
 *         schema:
 *           type: string
 *           example: JWT 60d0fe4f5311236168a109ca
 *     requestBody:
 *       description: The user details to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *             example:
 *               firstName: "UpdateRon"
 *               lastName: "updateCohen"
 *               email: "user@example.com"
 *               username: "Ron1"
 *     responses:
 *       "200":
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "User updated successfully"
 *       "401":
 *         description: Unauthorized. The user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "Unauthorized"
 *       "404":
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               example:
 *                 error: "User not found"
 */


export default router;