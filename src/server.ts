import express,{Response,Request} from "express";
import path from "path";


const app = express();
const port: number = 5000;

// Configure Express to use EJS
app.set("views", path.join(__dirname, "client/views"));
app.set("view engine", "ejs");

// listen app on the given port
app.listen(port, () => {
    // tslint:disable-next-line: no-console
    console.log(`============================================================================================================`);
    // tslint:disable-next-line: no-console
    console.log(`MtB Web app listening on port ${port}`);
    // tslint:disable-next-line: no-console
    console.log(`============================================================================================================`);
  });

// define a route handler for the default home page
app.get("/", (req:Request, res:Response,next) => {
  // render the index template
  res.render("index");
});
