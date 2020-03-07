import express, { Response, Request } from "express";
import fetch from "node-fetch";
import path from "path";
import { TMDB } from "./api";

const app = express();
// tslint:disable-next-line: radix
const port: number = parseInt(process.env.NODE_ENV as string) || 5000;

// Configure Express to use EJS
app.set("views", path.join(__dirname, "client/views"));
app.set("view engine", "ejs");

// listen app on the given port
app.listen(port, () => {
  console.log(`=========================================`);
  console.log(`=========================================`);
  console.log("");
  console.log(`MtB Web app listening on port ${port}`);
  console.log("");
  console.log(`=========================================`);
  console.log(`=========================================`);
});

const tmdb = new TMDB();

// define a route handler for the default home page
app.get("/", (req: Request, res: Response, next) => {
  // render the index template
  res.render("index");
});

app.get("/popular", async (req: Request, res: Response, next) => {
  // http://api.themoviedb.org/3/movie/popular?api_key=d531f0b35e33ab3572f10065361d3ae1
  const popularMovies = tmdb.baseURL() + "popular" + tmdb.apikey();
  const fetchData = await fetch(popularMovies);
  const data = await fetchData.json();
  res.json(data);
});
