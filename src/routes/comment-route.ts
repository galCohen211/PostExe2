import express from "express";
const router = express.Router();
import commentController from "../controllers/comment-controller";

router.get("/post/:postId", commentController.getCommentByPostId);

router.post("/", commentController.createComment);

router.get("/", commentController.getAllComments);

router.get("/:id", commentController.getCommentById);

router.put("/:id", commentController.updateComment);

router.delete("/:id", commentController.deleteComment);



export default router;