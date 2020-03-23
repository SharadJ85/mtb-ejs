import express, {Response, Request} from "express";
import fetch from "node-fetch";
import path from "path";
import TbdbUrl from "./api";
import helmet from "helmet";
//
//
//
//
//
//
//
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
app.use(helmet());
//
//
//
//
// helper functions
app.locals.ratingsColorSwitcher = (rating: number) => {
  if (rating > 7.5) {
    return "#64dd17";
  } else if (rating >= 6) {
    return "#ffd600";
  } else if (rating >= 4) {
    return "#ff3d00";
  } else {
    return "#d50000";
  }
};
//
//
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
//
//
//
//
//
// set api url methods
const turl = new TbdbUrl();
//
//
// set api url query param: general feature
const featureMap = new Map();
let count: number = 0;
while (turl.generalFeatures(count)) {
  const featureType = turl.generalFeatures(count) as string;
  featureMap.set(featureType, featureType);
  count++;
}
//
// set api url query param: media type
const mediaMap = new Map();
count = 0;
while (turl.mediatype(count)) {
  const mediaType = turl.mediatype(count);
  mediaMap.set(mediaType, mediaType);
  count++;
}
//
//
//
//
//
//
//

// define a route handler for the default home page
app.get("/", async (req: Request, res: Response, next) => {
  try {
    console.log("-->-->-->-->home");
    const imageURL = turl.imageURL(0);
    const tvURL = `${turl.baseURL()}${turl.mediatype(1)}/${turl.generalFeatures(5)}${turl.apikey()}`;
    const movieURL = `${turl.baseURL()}${turl.mediatype(0)}/${turl.generalFeatures(1)}${turl.apikey()}`;
    const tvData = await (await fetch(tvURL)).json();
    const movieData = await (await fetch(movieURL)).json();
    console.log("-------------------------------");
    console.log("movieUrl==", movieURL);
    console.log("-------------------------------");
    console.log("tvUrl==", tvURL);

    console.log("-------------------------------");
    // render the index template
    res.render("index", {
      imageURL,
      tv: tvData.results.slice(1, 10),
      movie: movieData.results.slice(1, 10)
    });
  } catch (err) {
    res.status(404).send(`media type search ERROR :  ${err}`);
  }
});
// details page
app.get("/info/:media/:id", async (req: Request, res: Response, next) => {
  try {
    const media = mediaMap.get(req.params.media);
    const imageURL = turl.imageURL(1);
    const id = parseInt(req.params.id) as number;
    const movieUrl = `${turl.baseURL()}${media}/${id}${turl.apikey()}`;
    const creditsUrl = `${turl.baseURL()}${media}/${id}/credits${turl.apikey()}`;
    const videoUrl = `${turl.baseURL()}${media}/${id}/videos${turl.apikey()}`;
    const reviewUrl = `${turl.baseURL()}${media}/${id}/reviews${turl.apikey()}`;
    const dataToBeFetched = [movieUrl, creditsUrl, videoUrl, reviewUrl];
    const results = await Promise.all(dataToBeFetched);
    const movieData = await (await fetch(movieUrl)).json();
    const creditsData = await (await fetch(creditsUrl)).json();
    const videoData = await (await fetch(videoUrl)).json();
    const reviewData = await (await fetch(reviewUrl)).json();
    console.log("-------------------------------");
    console.log("movieUrl==", movieUrl);
    console.log("-------------------------------");
    console.log("creditsUrl==", creditsUrl);
    console.log("-------------------------------");
    console.log("reviewUrl==", reviewUrl);
    console.log("-------------------------------");
    console.log("videoUrl==", videoUrl);
    console.log("-------------------------------");
    console.log("media==", media);
    console.log("-------------------------------");
    console.log("id==", id);
    console.log("-------------------------------");

    res.render("mediaDetails", {
      media: movieData,
      imageURL,
      videoinfo: videoData.results,
      creditsData,
      reviews: reviewData
    });
  } catch (err) {
    res.status(404).send(`media type search ERROR :  ${err}`);
  }
});

// general page
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
                parseInt(req.params.page))}`
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
          type: gFeature.replace(/_/g, " "),
          pageid: fetchData.page,
          pages: fetchData.total_pages,
          mediaType: media,
          generalType: gFeature,
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
