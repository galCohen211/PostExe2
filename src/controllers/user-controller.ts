import { Request, Response } from "express";
import user from "../models/user-model";

//Signup
class userController {
  static async signup(req: Request, res: Response): Promise<void> {
    const { email, username, password, firstName, lastName } = req.body;
    try {
      const userEmail = await user.findOne({ email });
      if (userEmail) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }
      const userUsername = await user.findOne({username});
      if(userUsername){
        res.status(400).json({message: "Username already exists"});
        return;
    }
      const newUser = new user({
        email,
        username,
        password,
        firstName,
        lastName,
      });
      await newUser.save();
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res.status(400).json({ message: error });
    }
  }

  //Login
    static async login(req: Request, res: Response): Promise<void> {
        try{
            const {email, password} = req.body;
            const userLogin = await user.findOne({email});
            if(!userLogin){
                res.status(400).json({message: "User not found"});
                return;
            }
            if(userLogin.password !== password){
                res.status(400).json({message: "Password is incorrect"});
                return;
            }

            res.status(200).json({message: "You are logged in", user: userLogin});

        }catch(error){
            res.status(400).json({message: error});
        }
    }

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
