import { Request, Response } from "express";
import comment from "../models/comment-model";

class commentController {

    static async getCommentByPostId(req: Request, res: Response): Promise<void> {
        const postId = req.params;
        try{
            const commentByPostId = await comment.find(postId);
            res.status(200).json({commentByPostId});
            return;
        }catch(error){
            res.status(500).json({message: error});
            return;
        }
    }

    static async getAllComments(req: Request, res: Response): Promise<void> {
        try{
            const comments = await comment.find();
            res.status(200).json({comments});
            return;
        }catch(error){
            res.status(500).json({message: error});
            return;
        }
    }

    static async createComment(req: Request, res: Response): Promise<void> {
        const {owner, content, postId} = req.body;
        try{
            const newComment = await comment.create({owner, content, postId});
            res.status(201).send(newComment);
            return;
        }catch(error){
            res.status(500).json({message: error});
            return;
        }

    }

    static async getCommentById(req: Request, res: Response): Promise<void> {
        const commentId = req.params.id;
         try{
            const commentById = await comment.findById(commentId);
            res.status(200).json({commentById});
         }catch(error){
            res.status(500).json({message: error});
            return;
         }


    }

    static async updateComment(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        const content  = req.body;
        try{
            const updateContent = await comment.findByIdAndUpdate(id, content, {new: true});  
            res.status(200).json({message:"Comment updated" ,updateContent});
        }catch(error){
            res.status(500).json({message: error});
            return;
        }
    }

    static async deleteComment(req: Request, res: Response): Promise<void> {
        const id = req.params.id;
        try{
            const deleteComment = await comment.findByIdAndDelete(id);
            res.status(200).json({message:"Comment deleted", deleteComment});
        }catch(error){
            res.status(500).json({message: error});
            return;
        }
    }
}

export default commentController;
