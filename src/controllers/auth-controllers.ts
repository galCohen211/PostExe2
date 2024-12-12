import { Request, Response } from 'express';
import userModel from '../models/user-model';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req: Request, res: Response) => {
  const { email, username, password, firstName, lastName } = req.body;
    try {
      const userEmail = await userModel.findOne({ email });
      if (userEmail) {
        res.status(400).json({ message: "Email already exists" });
        return;
      }
      const userUsername = await userModel.findOne({username});
      if(userUsername){
        res.status(400).json({message: "Username already exists"});
        return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
        email,
        username,
        hashedPassword,
        firstName,
        lastName,
      });
      await user.save();
      res
        .status(201)
        .json({ message: "User created successfully", user: user });
    } catch (error) {
      res.status(400).json({ message: error });
    }
};



const login = async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;
    
    try {
      const user = await userModel.findOne({ username: username });
      if (!user) {
        res.status(400).send("Incorrect email or password, please try again");
        return;
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(400).send("Incorrect email or password, please try again");
        return;
      }
      if (process.env.TOKEN_SECRET === undefined) {
        res.status(400).send("server error");
        return;
      }
      jwt.sign({ _id: user._id },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRATION }, (err, token) => {
          if (err) {
            res.status(400).send("server error");
          } else {
            res.status(200).send({ token: token, _id: user._id });
          }
        });
    } catch (err) {
      res.status(400).send(err);
    }
  };

const logout = async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    res.status(400).send("Not implemented");
    
};

export default { signup, login, logout};