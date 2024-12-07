import express, {Express} from "express"; //import express module
const app = express(); //make express work
import dotenv from "dotenv"; //allows to use dotenv
dotenv.config(); //use dotenv
import bodyParser from "body-parser"; //import body-parser module
import userRoute from "./routes/user-route"; //import user-route module


import mongoose from "mongoose"; //import mongoose module

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
          app.use(bodyParser.urlencoded({ extended: true })); //take the parmetrs from the url
          //connect the routes of user-route to the app.js
          app.use(express.json());
          app.use("/user", userRoute);
          resolve(app);
        }) //connect to the database
        .catch((error) => {
          reject(error);
        });

    }
  });
};

app.get("/about", (req, res) => {
  res.send("Hello World");
});


export default App; //export initApp function


