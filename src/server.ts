import express, { Response, Request } from "express";
import path from "path";

const app = express();
// tslint:disable-next-line: radix
const port: number = parseInt(process.env.NODE_ENV as string) || 5000;

// Configure Express to use EJS
app.set("views", path.join(__dirname, "client/views"));
app.set("view engine", "ejs");

// listen app on the given port
app.listen(port, () => {
  console.log( `==========================================================================`);
  console.log("==================================");
  console.log("");
  console.log(`MtB Web app listening on port ${port}`);
  console.log("");
  console.log("==================================");
  console.log( `==========================================================================` );
});

// define a route handler for the default home page
app.get("/", (req: Request, res: Response, next) => {
  // render the index template
  res.render("index");
});
