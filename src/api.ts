import * as dotenv from "dotenv";
dotenv.config();

/**
 * TURL contains the default API url for 'The Movie DataBase' site
 * @URLmethods perfixLink + movieId + apikey
 * @method baseURL: default URL
 * @method mediatype: type:- | movie | tv_show | person
 * @method generalFeatures: type:- | popular | now_playing | top_rated
 * @method movieID: movie ID number
 * @method apikey: user API ky to access the TMDB database
 * @method page: generalFeatures(0) page number
 */

export class Turl<T> {
  /**
   * returns baseURL=https://api.themoviedb.org/3/
   */
  baseURL() {
    return "https://api.themoviedb.org/3/";
  }

  /**
   * returns type
   * @param type | 0: movie | 1: tv | 2: person
   */
  mediatype(type: number) {
    const types: string[] = ["movie/", "tv/", "person/"];
    for (const index in types) {
      if (parseInt(index) === type) {
        return types[index];
      }
    }
  }

  /**
   * returns type
   * @param type | 0: popular | 1: now_playing | 2: top_rated
   */
  generalFeatures(type: number) {
    const types: string[] = ["popular/", "now_playing/", "top_rated/"];
    for (const index in types) {
      if (parseInt(index) === type) {
        return types[index];
      }
    }
  }

  /**
   * @param id type() ID number
   */
  Id(id: number) {
    return id;
  }

  /**
   * returns the user API_KEY stored in ".env" file
   */
  apikey() {
    const key: any = process.env.API_KEY;
    return "?api_key=" + key;
  }

  /**
   * @param page generalFeatures(0) page number
   */
  page(page: number) {
    return "&"+page;
  }
}
