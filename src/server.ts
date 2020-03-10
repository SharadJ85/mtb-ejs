import dotenv from "dotenv";
import express, { Response, Request } from "express";
import fetch from "node-fetch";
import path from "path";
import Turl from "./api";





// config dotenv and set its path
dotenv.config({ path: ".." });

const app = express();
const port: number = parseInt(process.env.PORT as string) || 5050;

// Configure Express to use EJS
app.set("views", path.join(__dirname, "client/views"));
app.set("view engine", "ejs");

// config express middleware for card.css
app.use(express.static(path.join(__dirname,"client/assets"))
);

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






const turl = new Turl();
const imageURL = "http://image.tmdb.org/t/p/original";

// define a route handler for the default home page
app.get("/", (req: Request, res: Response, next) => {
  // render the index template
  res.render("index");
});

app.get("/popular/dev", async (req: Request, res: Response, next) => {
  // http://api.themoviedb.org/3/movie/popular?api_key=API_KEY
  try {
    const popularMovies: string =
      turl.baseURL() +
      turl.mediatype(0) +
      turl.generalFeatures(0) +
      turl.apikey();
    const fetchData = await fetch(popularMovies);
    const data = await fetchData.json();
    res.render("card", { result: data.results[1], imageURL });
  } catch (err) {
    console.log(err)
    res.send("sorry for the ERROR:"+err)
  }
});

app.get("/popular", async (req: Request, res: Response, next) => {
  // http://api.themoviedb.org/3/movie/popular?api_key=API_KEY
  const popularMovies: string =
    turl.baseURL() +
    turl.mediatype(0) +
    turl.generalFeatures(0) +
    turl.apikey();
  const fetchData = await fetch(popularMovies);
  const data: Response = await fetchData.json();
  res.json(data);
});

app.get("/now_playing", async (req: Request, res: Response, next) => {
  const nowPlaying: string =
    turl.baseURL() +
    turl.mediatype(0) +
    turl.generalFeatures(1) +
    turl.apikey();
  const fetchData: Response = await (await fetch(nowPlaying)).json();
  res.json(fetchData);
});

app.get("/top_rated", async (req: Request, res: Response, next) => {
  const topRated: string =
    turl.baseURL() +
    turl.mediatype(0) +
    turl.generalFeatures(2) +
    turl.apikey();
  const fetchData: Response = await (await fetch(topRated)).json();
  res.json(fetchData);
});

app.get("/genre", async (req: Request, res: Response, next) => {
  const genre: string = turl.baseURL() + turl.genre(1) + turl.apikey();
  const fetchData: Response = await (await fetch(genre)).json();
  res.json(fetchData);
});
