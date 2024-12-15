import express from "express";
const router = express.Router();
import postController from "../controllers/post-controller";
import { authMiddleware } from "../controllers/auth-controllers";

router.post("/", authMiddleware, postController.createPost);

router.get("/", postController.getAllPosts);

router.get("/:id", postController.getPostById);

router.put("/:id", authMiddleware, postController.updatePost);

router.delete("/:id", authMiddleware, postController.deletePost);


export default router;