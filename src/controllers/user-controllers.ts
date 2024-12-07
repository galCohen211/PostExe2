import { Request, Response } from "express";
import user from "../models/user-model";

//login
//logout
class userController {
  static async signup(req: Request, res: Response): Promise<void> {
    const { email, username, password, firstName, lastName } = req.body;
    try {
      const userExists = await user.findOne({ email });
      if (userExists) {
        res.status(400).json({ message: "User already exists" });
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
}

export default userController;
