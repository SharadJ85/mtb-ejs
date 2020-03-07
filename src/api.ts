/**
 * TMDB contains the default url for 'The Movie DataBase' site
 * @URLmethods perfixLink + movieId + apikey
 * @method baseURL: default URL
 * @method movieID: movie ID number
 * @method apikey: user API ky to access the TMDB database
 */

export class TMDB<T> {
  baseURL() {
    return "https://api.themoviedb.org/3/movie/";
  }
  movieId(id: number) {
    return id + "?";
  }
  apikey() {
    const key: string = "d531f0b35e33ab3572f10065361d3ae1";
    return "api_key=" + key;
  }
}

// https://api.themoviedb.org/3/movie/550?api_key=d531f0b35e33ab3572f10065361d3ae1
