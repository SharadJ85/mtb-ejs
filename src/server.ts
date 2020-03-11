import dotenv from "dotenv";
import express, { Response, Request } from "express";
import fetch from "node-fetch";
import path from "path";
import Turl from "./api";
import { stringify } from "querystring";

// config dotenv and set its path
dotenv.config({ path: ".." });

const app = express();
const port: number = parseInt(process.env.PORT as string) || 5050;

// Configure Express to use EJS
app.set("views", path.join(__dirname, "client/views"));
app.set("view engine", "ejs");

// config express middleware for card.css
app.use(express.static(path.join(__dirname, "client/assets")));

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
  console.log("-->-->----home");
  // render the index template
  res.render("index");
});

const featureMap = new Map();
featureMap.set(turl.generalFeatures(0), turl.generalFeatures(0));
featureMap.set(turl.generalFeatures(1), turl.generalFeatures(1));
featureMap.set(turl.generalFeatures(2), turl.generalFeatures(2));

const mediaMap = new Map();
mediaMap.set(turl.mediatype(0), turl.mediatype(0));
mediaMap.set(turl.mediatype(1), turl.mediatype(1));
mediaMap.set(turl.mediatype(2), turl.mediatype(2));

app.get(
  "/:media/:generalFeature/:page?",
  async (req: Request, res: Response, next) => {
    const gFeature = featureMap.get(req.params.generalFeature);
    const media = mediaMap.get(req.params.media);

    if (!gFeature || !media)
      res.status(404).send("the input feature is not available!");

    const url: string = `${turl.baseURL()}${media}/${gFeature}${turl.apikey()}${turl.page(parseInt(req.params.page))}`;
    const fetchData = await (await fetch(url)).json();
    console.log("URL==" + url);
    res.render("general", {
      allResults: fetchData.results,
      imageURL,
      type: gFeature
    });
  }
);

// app.get("/now_playing/dev", async (req: Request, res: Response, next) => {
//   console.log("-->-->----popular/dev");
//   // http://api.themoviedb.org/3/movie/popular?api_key=API_KEY
//   try {
//     const popularMovies: string =
//       turl.baseURL() +
//       turl.mediatype(0) +
//       turl.generalFeatures(1) +
//       turl.apikey();
//     const fetchData = await fetch(popularMovies);
//     const data = await fetchData.json();
//     const feature: string | undefined = turl.generalFeatures(0);
//     res.render("general", {
//       allResults: data.results,
//       imageURL,
//       type: "Now playing "
//     });
//   } catch (err) {
//     console.log(err);
//     res.send("sorry for the ERROR:-  " + err);
//   }
// });

// app.get("/popular", async (req: Request, res: Response, next) => {
//   console.log("-->-->----popular");
//   // http://api.themoviedb.org/3/movie/popular?api_key=API_KEY
//   const popularMovies: string =
//     turl.baseURL() +
//     turl.mediatype(0) +
//     turl.generalFeatures(0) +
//     turl.apikey();
//   const fetchData = await fetch(popularMovies);
//   const data: Response = await fetchData.json();
//   res.json(data);
// });

// app.get("/now_playing", async (req: Request, res: Response, next) => {
//   console.log("-->-->----now_playing");
//   const nowPlaying: string =
//     turl.baseURL() +
//     turl.mediatype(0) +
//     turl.generalFeatures(1) +
//     turl.apikey();
//   const fetchData: Response = await (await fetch(nowPlaying)).json();
//   res.json(fetchData);
// });

// app.get("/top_rated", async (req: Request, res: Response, next) => {
//   console.log("-->-->----top_rated");
//   const topRated: string =
//     turl.baseURL() +
//     turl.mediatype(0) +
//     turl.generalFeatures(2) +
//     turl.apikey();
//   const fetchData: Response = await (await fetch(topRated)).json();
//   res.json(fetchData);
// });

// app.get("/genre", async (req: Request, res: Response, next) => {
//   console.log("-->-->----genre");
//   const genre: string = turl.baseURL() + turl.genre(1) + turl.apikey();
//   const fetchData: Response = await (await fetch(genre)).json();
//   res.json(fetchData);
// });
