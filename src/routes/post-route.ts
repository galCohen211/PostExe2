import express from "express";
const router = express.Router();
import postController from "../controllers/post-controller";
import { authMiddleware } from "../controllers/auth-controllers";

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - owner
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *           example: 'My First Post'
 *         content:
 *           type: string
 *           description: The content of the post
 *           example: 'This is the content of the post!'
 *         owner:
 *           type: string
 *           description: The ID of the user who owns the post
 *           example: 'user owner'
 *       example:
 *         title: 'My First Post'
 *         content: 'This is the content of the post!'
 *         owner: 'user owner'
 */

router.post("/", authMiddleware, postController.createPost);
/**
 * @swagger
 * /post:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post with the provided title, content, and owner.
 *     tags:
 *       - Post
 *     security:
 *       - bearerAuth: []  # Specifies that a Bearer token is required for authentication
 *     parameters:
 *       - in: header
 *         name: auth
 *         required: true
 *         description: The current refresh token of the user.
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
 *               - title
 *               - content
 *               - owner
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Post Title"
 *               content:
 *                 type: string
 *                 example: "This is the content of the post."
 *               owner:
 *                 type: string
 *                 example: "user_id_here"
 *     responses:
 *       '201':
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d4b1f9c45c8c001f87f635"
 *                 title:
 *                   type: string
 *                   example: "Post Title"
 *                 content:
 *                   type: string
 *                   example: "This is the content of the post."
 *                 owner:
 *                   type: string
 *                   example: "user owner"
 *       '400':
 *         description: Invalid request data
 *       '401':
 *         description: Unauthorized, valid JWT token required
 *       '500':
 *         description: Internal server error
 */


router.get("/", postController.getAllPosts);

/**
 * @swagger
 * /post:
 *   get:
 *     summary: Get all posts
 *     description: Fetches all the posts from the database.
 *     tags:
 *       - Post
 *     responses:
 *       '200':
 *         description: Successfully fetched all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d4b1f9c45c8c001f87f635"
 *                       title:
 *                         type: string
 *                         example: "Post Title"
 *                       content:
 *                         type: string
 *                         example: "This is the content of the post."
 *                       owner:
 *                         type: string
 *                         example: "user owner"
 *       '400':
 *         description: Error fetching posts
 *       '401':
 *         description: Unauthorized, valid JWT token required
 *       '500':
 *         description: Internal server error
 */


router.get("/:id", postController.getPostById);

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     summary: Get a post by ID
 *     description: Fetches a single post by its unique ID.
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to retrieve.
 *         schema:
 *           type: string
 *           example: "60d4b1f9c45c8c001f87f635"
 *     responses:
 *       '200':
 *         description: Successfully fetched the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 postById:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d4b1f9c45c8c001f87f635"
 *                     title:
 *                       type: string
 *                       example: "Post Title"
 *                     content:
 *                       type: string
 *                       example: "This is the content of the post."
 *                     owner:
 *                       type: string
 *                       example: "user_id_here"
 *       '400':
 *         description: Error fetching the post
 *       '404':
 *         description: Post not found
 *       '401':
 *         description: Unauthorized, valid JWT token required
 *       '500':
 *         description: Internal server error
 */


router.put("/:id", authMiddleware, postController.updatePost);

/**
 * @swagger
 * /post/{id}:
 *   put:
 *     summary: Update a post by ID
 *     description: Updates the content of a post using its unique ID.
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to update.
 *         schema:
 *           type: string
 *           example: "60d4b1f9c45c8c001f87f635"
 *       - in: header
 *         name: auth
 *         required: true
 *         description: The current refresh token of the user.
 *         schema:
 *           type: string
 *           example: JWT 60d0fe4f5311236168a109ca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Post Title"
 *               content:
 *                 type: string
 *                 example: "This is the updated content of the post."
 *               owner:
 *                 type: string
 *                 example: "user_id_here"
 *     security:
 *       - bearerAuth: []  
 *     responses:
 *       '200':
 *         description: Successfully updated the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post updated"
 *                 updateContent:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d4b1f9c45c8c001f87f635"
 *                     title:
 *                       type: string
 *                       example: "Updated Post Title"
 *                     content:
 *                       type: string
 *                       example: "This is the updated content of the post."
 *                     owner:
 *                       type: string
 *                       example: "user owner"
 *       '400':
 *         description: Error updating the post
 *       '404':
 *         description: Post not found
 *       '401':
 *         description: Unauthorized, valid JWT token required
 *       '500':
 *         description: Internal server error
 */


router.delete("/:id", authMiddleware, postController.deletePost);

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     description: Deletes a post using its unique ID.
 *     tags:
 *       - Post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the post to delete.
 *         schema:
 *           type: string
 *           example: "60d4b1f9c45c8c001f87f635"
 *       - in: header
 *         name: auth
 *         required: true
 *         description: The current refresh token of the user.
 *         schema:
 *           type: string
 *           example: JWT 60d0fe4f5311236168a109ca
 *     security:
 *       - bearerAuth: []  
 *     responses:
 *       '200':
 *         description: Successfully deleted the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Post deleted"
 *                 deletePost:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d4b1f9c45c8c001f87f635"
 *                     title:
 *                       type: string
 *                       example: "Post Title"
 *                     content:
 *                       type: string
 *                       example: "This is the content of the post."
 *                     owner:
 *                       type: string
 *                       example: "user owner"
 *       '400':
 *         description: Error deleting the post
 *       '404':
 *         description: Post not found
 *       '401':
 *         description: Unauthorized, valid JWT token required
 *       '500':
 *         description: Internal server error
 */

export default router;