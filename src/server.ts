import express, {Response, Request, NextFunction} from "express";
import fetch from "node-fetch";
import path from "path";
import TmdbApiUrl from "./api";
import helmet from "helmet";
import bodyParser from "body-parser";
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
//
//
// create application/x-www-form-urlencoded parser --- middleware
app.use(bodyParser.urlencoded({extended: false}));
//
// for parsing application/json
app.use(bodyParser.json());
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
const turl = new TmdbApiUrl();
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
app.route("/")
    .get(async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("-->-->-->-->home");
        const imageURL = turl.imageURL(0);
        const tvURL = `${turl.baseURL()}${turl.mediatype(1)}/${turl.generalFeatures(5)}${turl.apikey()}`;
        const movieURL = `${turl.baseURL()}${turl.mediatype(0)}/${turl.generalFeatures(1)}${turl.apikey()}`;
        const [fetchTv, fetchMovie] = await Promise.all([tvURL, movieURL].map(el => fetch(el)));
        const [tvData, movieData] = await Promise.all([fetchTv, fetchMovie].map(el => el.json()));
        // render the index template
        res.render("index", {
          imageURL,
          tv: tvData.results.slice(0, 9),
          movie: movieData.results.slice(0, 9)
        });
      } catch (err) {
        res.status(404).send(`media type search ERROR :  ${err}`);
      }
    })
    .post(async (req: Request, res: Response, next: NextFunction) => {
      try {
        res.redirect(`/search/${req.body.searchValue}`)
      } catch (err) {
        res.status(404).send(`media type search ERROR :  ${err}`);
      }
    });


app.get("/search/:searchQuery/:page?", async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("-->-->-->-->search query==", req.params.searchQuery);
    const imageURL = turl.imageURL(1);
    const searchUrl = `${turl.searchUrl(0)}${turl.apikey()}&query=${req.params.searchQuery}&page=${req.params.page || 1}`;
    const searchData = await (await fetch(searchUrl)).json();
    res.render("searchCard", {
      data: searchData.results,
      imageURL,
      searchCharacters: req.params.searchQuery,
      pageid: searchData.page,
      pages: searchData.total_pages,
      mediaType: "search",
      generalType: req.params.searchQuery,
    });
  } catch (err) {
    res
        .status(404)
        .send(`Sorry for the ${status} error, Error type:- ${err}`);
  }
});


// details page
app.get("/info/:media/:id", async (req: Request, res: Response, next) => {
  try {
    console.log("-->-->-->-->media info");
    const media = mediaMap.get(req.params.media);
    const imageURL = turl.imageURL(1);
    const id = parseInt(req.params.id) as number;
    const mediaUrl = `${turl.baseURL()}${media}/${id}${turl.apikey()}`;
    const creditsUrl = `${turl.baseURL()}${media}/${id}/credits${turl.apikey()}`;
    const videoUrl = `${turl.baseURL()}${media}/${id}/videos${turl.apikey()}`;
    const reviewUrl = `${turl.baseURL()}${media}/${id}/reviews${turl.apikey()}`;
    const [fetchMedia, fetchCredits, fetchVideo, fetchReview] = await Promise.all([mediaUrl, creditsUrl, videoUrl, reviewUrl].map(dataToBeFetch => fetch(dataToBeFetch)));
    const [mediaData, creditsData, videoData, reviewData] = await Promise.all([fetchMedia, fetchCredits, fetchVideo, fetchReview].map(el => el.json()));
    res.render("mediaDetails", {
      media: mediaData,
      imageURL,
      videoInfo: videoData.results,
      creditsData,
      reviews: reviewData,
      mediaType: media
    });
  } catch (err) {
    res.status(404).render("errorPage");
  }
});

// general page
app.get(
    "/:media/:generalFeature/:page?",
    async (req: Request, res: Response, next) => {
      try {
        console.log("-->-->-->-->general page");
        const gFeature = featureMap.get(req.params.generalFeature);
        const media = mediaMap.get(req.params.media);
        const page = req.params.page;
        const imageURL = turl.imageURL(1);
        const url: string = `${turl.baseURL()}${media}/${gFeature}${turl.apikey()}` + (page ? `&page=${page}` : ``);
        const fetchData = await (await fetch(url)).json();
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
