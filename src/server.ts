import dotenv from "dotenv";
import express, { Response, Request } from "express";
import fetch from "node-fetch";
import path from "path";
import Turl from "./api";
//
//
//
//
//
//
//
// config dotenv and set its path
dotenv.config({ path: ".." });
//
// set Expressjs
const app = express();

// set port number
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
//
//
//
//
//
// define a route handler for the default home page
app.get("/", (req: Request, res: Response, next) => {
  console.log("-->-->----home");
  // render the index template
  res.render("index");
});
//
//
//
//
//
// set api url methods
const turl = new Turl();
//
//
// set api url query param: general feature
const featureMap = new Map();
let count: number = 0;
while (turl.generalFeatures(count)[0]) {
  const featureType = turl.generalFeatures(count)[0] as string;
  featureMap.set(featureType, featureType);
  count++;
}
//
// set api url query param: media type
const mediaMap = new Map();
count = 0;
while (turl.mediatype(count)[0]) {
  const mediaType = turl.mediatype(count)[0];
  mediaMap.set(mediaType, mediaType);
  count++;
}


app.get("/details/:media/:id", async (req: Request, res: Response, next) => {
  try {
    const media = mediaMap.get(req.params.media);
    const imageURL = turl.imageURL(1);
    const id = parseInt(req.params.id) as number;
    const movieUrl = `${turl.baseURL()}${media}/${id}${turl.apikey()}`;
    const creditsUrl = `${turl.baseURL()}${media}/${id}/credits${turl.apikey()}`;
    const movieData = await (await fetch(movieUrl)).json();
    const creditsData = await (await fetch(creditsUrl)).json();
    console.log("-------------------------------");
    console.log("movieUrl==", movieUrl);
    console.log("-------------------------------");
    console.log("creditsUrl==", creditsUrl);
    console.log("-------------------------------");
    console.log("media==", media);
    console.log("-------------------------------");
    console.log("id==", id);
    console.log("-------------------------------");

    res.render("mediaDetails", {
      media: movieData,
      imageURL,
      creditsCast: creditsData.cast,
      // tslint:disable-next-line: no-unused-expression
      creditsCrew: creditsData.crew
    });
  } catch (err) {
    res.status(404).send(`media type search ERROR :  ${err}`);
  }
});



app.get(
  "/:media/:generalFeature/:page?",
  async (req: Request, res: Response, next) => {
    try {
      console.log(turl.generalFeatures.length);
      const gFeature = featureMap.get(req.params.generalFeature);
      const media = mediaMap.get(req.params.media);
      const page = req.params.page;
      const imageURL = turl.imageURL(1);
      const url: string = req.params.page
        ? `${turl.baseURL()}${media}/${gFeature}${turl.apikey()}${turl.page(
            parseInt(req.params.page)
          )}`
        : `${turl.baseURL()}${media}/${gFeature}${turl.apikey()}`;
      const fetchData = await (await fetch(url)).json();
      console.log("-------------------------------");
      console.log("URL== " + url);
      console.log("-------------------------------");
      console.log("feature==", gFeature);
      console.log("-------------------------------");
      console.log("media==", media);
      console.log("-------------------------------");
      console.log("page==", page);
      console.log("-------------------------------");
      res.render("general", {
        allResults: fetchData.results,
        imageURL,
        type: gFeature.replace("_", " "),
        pageid: fetchData.page,
        pages:fetchData.total_pages,
        mediaType:media,
        generalType:gFeature
      });
    } catch (err) {
      res
        .status(404)
        .send(`Sorry for the ${status} error, Error type:- ${err}`);
    }
  }
);



// app.get("/genre", async (req: Request, res: Response, next) => {
//   console.log("-->-->----genre");
//   const genre: string = turl.baseURL() + turl.genre(1) + turl.apikey();
//   const fetchData: Response = await (await fetch(genre)).json();
//   res.json(fetchData);
// });
