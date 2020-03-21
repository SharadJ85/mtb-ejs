import * as dotenv from "dotenv";

dotenv.config();

/**
 * TURL contains the default API url for 'The Movie DataBase' site
 * @URLmethods
 * @method baseURL: default URL
 * @method genre: type:- | 0: movie| 1: tv
 * @method mediatype: type:- | movie | tv_show | person
 * @method generalFeatures: type:- | popular | now_playing | top_rated
 * @method movieID: movie ID number
 * @method apikey: user API ky to access the TMDB database
 * @method page: generalFeatures(0) page number
 */

export default class Turl<T> {
  /**
   * returns baseURL=https://api.themoviedb.org/3/
   */
  baseURL() {
    return "https://api.themoviedb.org/3/" as string;
  }

  /**
   * returns imageURL="http://image.tmdb.org/t/p/{type}"
   * @param imageSize | 0: original | 1: w500
   */
  imageURL(imageSize: number) {
    const image = new Map();
    image.set(0, "original");
    image.set(1, "w500");
    if (image.get(imageSize)) {
      return `http://image.tmdb.org/t/p/${image.get(imageSize)}` as string;
    }
  }

  /**
   * returns genre list
   * @param type | 0: genre/movie/list | 1: genre/tv/list
   */
  genre(type: number) {
    const types: string[] = ["movie/list", "tv/list"];
    for (const index in types) {
      if (parseInt(index) === type) {
        return ("genre/" + types[index]) as string;
      }
    }
  }

  /**
   * returns type
   * @param type | 0: movie | 1: tv | 2: person
   */
  mediatype(type: number) {
    const types: string[] = ["movie", "tv", "person"];
    let output: string | undefined;
    for (const index in types) {
      if (parseInt(index) === type) {
        output = types[index];
        break;
      }
    }
    return [output, types];
  }

  /**
   * returns type
   * @param type | 0: popular | 1: now_playing | 2: top_rated
   */
  generalFeatures(type?: number) {
    const types: string[] = [
      "top_rated",
      "popular",
      "now_playing",
      "upcomming",
      "airing_today",
      "on_the_air"
    ];
    let output: string | undefined;
    for (const index in types) {
      if (parseInt(index) === type) {
        output = types[index];
        break;
      }
    }
    return [output, types];
  }

  /**returns ID number of media type
   * @param id media type ID number
   */
  Id(id: number) {
    return id as number;
  }

  /**
   * returns "?api_key=(--the user API_KEY stored in ".env" file--)"
   */
  apikey() {
    const key: any = process.env.API_KEY;
    return ("?api_key=" + key) as string;
  }

  /**
   * @param page generalFeatures(0) page number
   */
  page(page: number = 1) {
    return ("&page=" + page) as string;
  }
}
