import { Request, Response, NextFunction } from 'express';
import userModel from '../models/user-model';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

class authController {

  static async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    if (!userId) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    try {
      const user = await userModel.findByIdAndDelete(userId);
      res.status(200).json({ message: "User deleted successfully", user: user });
    }catch (error) {
    res.status(500).json({ message: error });
    }

  }

  static async getUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
      const user = await userModel.findById(userId);
      try {
        if (!user) {
          res.status(404).json({ message: "User not found" });
          return;
        }
        res.status(200).json({ message:"User found" ,user: user });

    }catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;
    const { email, username, firstName, lastName, password } = req.body;
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      user.email = email;
      user.username = username;
      user.firstName = firstName;
      user.lastName = lastName;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      await user.save();
      res.status(200).json({ message: "User updated successfully", user: user });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  static async signup(req: Request, res: Response): Promise<void> {
    var { email, username, password, firstName, lastName } = req.body;
    
    // res.status(400).json({ message: req.body, "salt": "salt", "original_password": password1 });
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

    password = await bcrypt.hash(password, salt);
    
    const user = await userModel.create({
        email,
        username,
        password,
        firstName,
        lastName
      });
      await user.save();
      res
        .status(201)
        .json({ message: "User created successfully", user: user });
    } catch (error) {
      res.status(500).json({ message: error });
    }
}


static async login(req: Request, res: Response): Promise<void> {
    const username = req.body.username;
    const password = req.body.password;
    try {
      const user = await userModel.findOne({ username: username });
      if (!user) {
        res.status(400).json({ message:"Incorrect email or password, please try again"});
        return;
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(400).json({ message:"Incorrect email or password, please try again"});
        return;
      }
      
      const token = process.env.TOKEN_SECRET || "DEFAULTKEY"
      // Generate access token
    const accessToken = jwt.sign(
      { _id: user._id },
      token as string,
      { expiresIn: process.env.TOKEN_EXPIRATION} // Default to 1h if undefined
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET as string
    );

    // Store the refresh token in user's tokens array
    if (!user.tokens) {
      user.tokens = [refreshToken];
    } else {
      user.tokens.push(refreshToken);
    }

    // Save the user with the updated tokens
    await user.save();

    // Send response
    res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error('Error generating tokens:', error);
    res.status(500).send({ message: 'Internal Server Error' });
    }
}

  static async refresh_token(req: Request, res: Response): Promise<void> {
  {
      try {
        const authHeaders = req.headers['authorization'];
        const token = (authHeaders && authHeaders.split(' ')[1]) as string;
        
        // Verify the refresh token
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string, async (err, userInfo: any) => {
          if (err) {
            return res.status(403).send(err.message); // Invalid or expired token
          }
          const userId = userInfo._id; // Extract user ID from the decoded token
          const user = await userModel.findById(userId); // Fetch the user
    
          if (!user) {
            return res.status(403).send('Invalid request'); // User not found
          }
    
          // Generate a new access token
          const accessToken = jwt.sign(
            { _id: user._id },
            process.env.TOKEN_SECRET as string,
            { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
          );
    
          // Generate a new refresh token
          const refreshToken = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET as string
          );
    
          // Replace the old refresh token with the new one
          const tokenIndex = user.tokens.indexOf(token);
          user.tokens[tokenIndex] = refreshToken;
          await user.save();
    
          // Send the new tokens
          return res.status(200).send({
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        });
      } catch (err: any) {
        console.error('Error in refreshToken middleware:', err.message);
        res.status(500).send(err.message || 'Internal Server Error');
      }
    };
  }
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeaders = req.headers['authorization'];
    const token = (authHeaders && authHeaders.split(' ')[1]) as string;

    // Verify the refresh token
    jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
      async (err, userInfo: any) => {
        if (err) {
          return res.status(400).send(err.message); // Forbidden: Invalid or expired token
        }

        const userId = userInfo._id;

        try {
          // Find the user by ID
          const user = await userModel.findById(userId);
          if (!user) {
            return res.status(401).send('Invalid request: User not found');
          }

          // Remove the specific token from the tokens array
          user.tokens.splice(user.tokens.indexOf(token), 1);
          await user.save();

          return res.status(200).send({ message: 'Logout successful' });
        } catch (err) {
          console.error('Error during logout:', err);
          return res.status(405).send(err);
        }
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).send('Internal Server Error');
  }
}
}
type TokenPayload = {
  _id: string;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
      res.status(401).send("Token not found");
      return;
  }

  const token_secret = process.env.TOKEN_SECRET || "DEFAULTSECRETKEY";

  jwt.verify(token, token_secret, (err, data) => {
      if (err) {
          res.status(403).send("token is invalid");
          return;
      }
      const payload = data as TokenPayload;
      req.query.userId = payload._id;
      next();
  });


};



export default authController;