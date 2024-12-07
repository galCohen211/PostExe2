import App from "./server"; //import app module
const port = process.env.PORT;


App()
.then((app) =>{
  app.listen(port, () => {
    //brings up the server
    console.log(`Example app listening at http://localhost:${port}`);
  });
}).catch(()=>{
  console.log("Error Fail starting the server");
});
  
