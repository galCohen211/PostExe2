import express from "express";
const router = express.Router();
import commentController from "../controllers/comment-controller";

router.get("/", commentController.getAllComments);

router.get("/:id", commentController.getCommentById);

router.post("/", commentController.createComment);


export default router;