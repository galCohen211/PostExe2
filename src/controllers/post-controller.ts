import { Request, Response } from "express";
import post from "../models/post-model";

class postController {

    static async getAllPosts(req: Request, res: Response): Promise<void> {
        try{
            const posts = await post.find();
            res.status(200).json({posts});
            return;
        }catch(error){
            res.status(400).json({message: error});
            return;
        }
    }

    static async createPost(req: Request, res: Response): Promise<void> {
        const {title, content, owner} = req.body;
        try{
            const newPost = await post.create({title, content, owner});
            res.status(201).send(newPost);
            return;
        }catch(error){
            res.status(400).json({message: error});
            return;
        }

    }

    static async getPostById(req: Request, res: Response): Promise<void> {
        const postId = req.params.id;
        try{
            const postById = await post.findById(postId);
            res.status(200).json({postById});
         }catch(error){
            res.status(400).json({message: error});
            return;
         }


    }

    static async updatePost(req: Request, res: Response): Promise<void> {
        const postId = req.params.id;
        const content  = req.body;
        try{
            const updateContent = await post.findByIdAndUpdate(postId, content, {new: true});  
            res.status(200).json({message:"Post updated" ,updateContent});
        }catch(error){
            res.status(400).json({message: error});
            return;
        }
    }

    static async deletePost(req: Request, res: Response): Promise<void> {
        const postId = req.params.id;
        try{
            const deletePost =   await post.findByIdAndDelete(postId);
            res.status(200).json({message:"Post deleted", deletePost});
        }catch(error){
            res.status(400).json({message: error});
            return;
        }
    }
}

export default postController;
