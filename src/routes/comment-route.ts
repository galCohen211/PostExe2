import express from "express";
const router = express.Router();
import commentController from "../controllers/comment-controller";
import { authMiddleware } from "../controllers/auth-controllers";

router.get("/post/:postId", commentController.getCommentByPostId);

router.post("/", authMiddleware, commentController.createComment);

router.get("/", commentController.getAllComments);

router.get("/:id", commentController.getCommentById);

router.put("/:id", authMiddleware,  commentController.updateComment);

router.delete("/:id", authMiddleware, commentController.deleteComment);



export default router;