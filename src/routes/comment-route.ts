import express from "express";
const router = express.Router();
import commentController from "../controllers/comment-controller";
import { authMiddleware } from "../controllers/auth-controllers";

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - owner
 *         - content
 *         - postId
 *       properties:
 *         owner:
 *           type: string
 *           description: The ID of the user who owns the comment
 *           example: 'user owner'
 *         content:
 *           type: string
 *           description: The content of the comment
 *           example: 'This is a comment.'
 *         postId:
 *           type: string
 *           description: The ID of the post that this comment belongs to
 *           example: '60c72b2f5f1b2c001fbcf73f'
 *       example:
 *         owner: 'user owner'
 *         content: 'This is a comment.'
 *         postId: '60c72b2f5f1b2c001fbcf73f'
 */

router.get("/post/:postId", commentController.getCommentByPostId);

/**
 * @swagger
 * /comment/post/{postId}:
 *   get:
 *     summary: Get comments by post ID
 *     description: Retrieves all comments related to a specific post by its ID
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to fetch comments for
 *         schema:
 *           type: string
 *           example: '60c72b2f5f1b2c001fbcf73f'
 *     responses:
 *       '200':
 *         description: Comments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 commentByPostId:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: Invalid request or postId
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */


router.post("/", authMiddleware, commentController.createComment);

/**
 * @swagger
 * /comment:
 *   post:
 *     summary: Create a new comment
 *     description: Creates a new comment for a specific post
 *     tags:
 *       - Comment
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - owner
 *               - content
 *               - postId
 *             properties:
 *               owner:
 *                 type: string
 *                 description: The owner of the comment
 *                 example: 'Mika'
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *                 example: 'This is a great post!'
 *               postId:
 *                 type: string
 *                 description: The ID of the post the comment belongs to
 *                 example: '60c72b2f5f1b2c001fbcf73f'
 *     responses:
 *       '201':
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: Invalid input or data
 *       '401':
 *         description: Unauthorized - Bearer token is missing or invalid
 *       '500':
 *         description: Internal server error
 */


router.get("/", commentController.getAllComments);

/**
 * @swagger
 * /comment:
 *   get:
 *     summary: Get all comments
 *     description: Retrieves all comments from the database
 *     tags:
 *       - Comment
 *     responses:
 *       '200':
 *         description: Successfully retrieved all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: Bad request or error fetching comments
 *       '500':
 *         description: Internal server error
 */


router.get("/:id", commentController.getCommentById);

/**
 * @swagger
 * /comment/{id}:
 *   get:
 *     summary: Get a comment by ID
 *     description: Retrieves a specific comment by its ID
 *     tags:
 *       - Comment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to retrieve
 *         schema:
 *           type: string
 *           example: '60c72b2f5f1b2c001fbcf73f'
 *     responses:
 *       '200':
 *         description: Successfully retrieved the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 commentById:
 *                   $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: Bad request or error fetching the comment
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: Internal server error
 */


router.put("/:id", authMiddleware,  commentController.updateComment);

/**
 * @swagger
 * /comment/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     description: Updates a specific comment by its ID
 *     tags:
 *       - Comment
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
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to update
 *         schema:
 *           type: string
 *           example: '60c72b2f5f1b2c001fbcf73f'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The updated content of the comment
 *                 example: 'This is the updated comment content.'
 *     responses:
 *       '200':
 *         description: Successfully updated the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Comment updated'
 *                 updateContent:
 *                   $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: Invalid request or error updating the comment
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: Internal server error
 */


router.delete("/:id", authMiddleware, commentController.deleteComment);

/**
 * @swagger
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     description: Deletes a specific comment by its ID
 *     tags:
 *       - Comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the comment to delete
 *         schema:
 *           type: string
 *           example: '60c72b2f5f1b2c001fbcf73f'
 *       - in: header
 *         name: auth
 *         required: true
 *         description: The current access token of the user.
 *         schema:
 *           type: string
 *           example: JWT 60d0fe4f5311236168a109ca
 *     responses:
 *       '200':
 *         description: Successfully deleted the comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Comment deleted'
 *                 deleteComment:
 *                   $ref: '#/components/schemas/Comment'
 *       '400':
 *         description: Error deleting the comment
 *       '404':
 *         description: Comment not found
 *       '500':
 *         description: Internal server error
 */




export default router;