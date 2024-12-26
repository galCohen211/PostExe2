import express, {Express} from "express"; 
import session from "express-session";
const app = express(); //make express work
import dotenv from "dotenv"; //allows to use dotenv
dotenv.config(); //use dotenv
import bodyParser from "body-parser"; 
import commentRoute from "./routes/comment-route";
import authRoute from "./routes/auth-route"; 
import postRoute from "./routes/post-route"; 
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import mongoose from "mongoose"; 

const App = ():Promise<Express> => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection; //connect to the database
    db.on("error", (error) => console.error(error)); //if there is an error, it will be shown in the console
    db.once("open", () => console.log("Connected to the mongo database")); //if the connection is successful, it will be shown in the console
    if(!process.env.DB_CONNECTION){
      reject("Missing DB_CONNECTION in .env file");
    }else{

      mongoose
        .connect(process.env.DB_CONNECTION)
        .then(() => {
          app.use(bodyParser.json()); //use body-parser module
          app.use(bodyParser.urlencoded({ extended: true })); 
          app.use(express.json());
          app.use("/comment", commentRoute);
          app.use("/auth", authRoute);
          app.use("/post", postRoute);
          app.use(
            session({
              secret: "yourSessionSecret", // Used to sign session ID cookies
              resave: false,               // Avoid resaving unchanged sessions
              saveUninitialized: false,    // Don't save uninitialized sessions
              cookie: { secure: false },   // Set 'true' if using HTTPS
            })
          );
          resolve(app);
        }) //connect to the database
        .catch((error) => {
          reject(error);
        });

    }
  });
};

const options = {
  definition: {
  openapi: "3.0.0",
  info: {
  title: "Assignment PostExe2 2025 REST API",
  version: "1.0.0",
  description: "REST server including authentication using JWT",
  },
  servers: [{url: "http://localhost:" + process.env.PORT,},],
  },
  apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


export default App; 


