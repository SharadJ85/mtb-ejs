import dotenv from "dotenv";
import express, { Response, Request } from "express";
import fetch from "node-fetch";
import path from "path";
import {Turl} from "./api";

// config dotenv and set its path
dotenv.config({ path: ".." });

const app = express();
// tslint:disable-next-line: radix
const port: number = parseInt(process.env.PORT as string) || 5050;

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
  // tslint:disable-next-line: radix
});

const turl = new Turl();

// define a route handler for the default home page
app.get("/", (req: Request, res: Response, next) => {
  // render the index template
  res.render("index");
});

app.get("/popular", async (req: Request, res: Response, next) => {
  // http://api.themoviedb.org/3/movie/popular?api_key=API_KEY
  const popularMovies: string =
    turl.baseURL() + turl.mediatype(0) + turl.generalFeatures(0) + turl.apikey()
  const fetchData = await fetch(popularMovies);
  const data: Response = await fetchData.json();
  res.json(data);
});

app.get("/now_playing", async (req: Request, res: Response, next) => {
  const nowPlaying: string =
    turl.baseURL() + turl.mediatype(0) + turl.generalFeatures(1) + turl.apikey();
  const fetchData = await fetch(nowPlaying);
  res.json(await fetchData.json());
});

app.get("/top_rated", async (req: Request, res: Response, next) => {
  const nowPlaying: string =
    turl.baseURL() + turl.mediatype(0) + turl.generalFeatures(2) + turl.apikey();
  const fetchData = await fetch(nowPlaying);
  res.json(await fetchData.json());
});
