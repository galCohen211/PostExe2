import { Request, Response } from "express";
import user from "../models/user-model";

//Signup
class userController {
  
    //Logout
    static async logout(req: Request, res: Response): Promise<void> {
        try{
            res.status(200).json({message: "You are logged out"});
        }catch(error){
            res.status(400).json({message: error});
        }
    }
}

export default userController;
