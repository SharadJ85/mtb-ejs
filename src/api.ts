import * as dotenv from "dotenv";

dotenv.config();

/**
 * TmdbUrl contains the default API url for 'The Movie DataBase' site
 * @URLmethods
 * @method baseURL: default URL
 * @method genre: type:- | 0: movie| 1: tv
 * @method mediatype: type:- | movie | tv_show | person
 * @method generalFeatures: type:- | popular | now_playing | top_rated | 3: upcoming | 4: airing_today | 5: on_the_air
 * @method movieID: movie ID number
 * @method apikey: user API ky to access the TMDB database
 * @method page: generalFeatures(0) page number
 */

export default class TbdbUrl<T> {
  /**
   * returns baseURL=https://api.themoviedb.org/3/
   */
  baseURL(): string {
    return "https://api.themoviedb.org/3/";
  }

  /**
   * returns imageURL="http://image.tmdb.org/t/p/{type}"
   * @param imageSize | 0: original | 1: w500
   */
  imageURL(imageSize: number): string {
    const size: string[] = ["original", "w500"];
    return `http://image.tmdb.org/t/p/${size[imageSize]}`;
  }

  /**
   * returns genre list
   * @param type | 0: genre/movie/list | 1: genre/tv/list
   */
  genres(type: number): string {
    const genre: string[] = ["genre/movie/list", "genre/tv/list"];
    return genre[type]
  }

  /**
   * returns type
   * @param type | 0: movie | 1: tv | 2: person
   */
  mediatype(type: number): string {
    const media: string[] = ["movie", "tv", "person"];
    return media[type]
  }

  /**
   * returns type
   * @param type | 0: popular | 1: now_playing | 2: top_rated | 3: upcoming | 4: airing_today | 5: on_the_air
   */
  generalFeatures(type: number): string {
    const feature: string[] = ["upcoming", "now_playing", "top_rated", "popular", "airing_today", "on_the_air"];
    return feature[type];
  }

  /**returns ID number of media type
   * @param id media type ID number
   */
  id(id: number): number {
    return id;
  }

  /**
   * returns "?api_key=(--the user API_KEY stored in ".env" file--)"
   */
  apikey(): string {
    const key: any = process.env.API_KEY;
    return ("?api_key=" + key);
  }

  /**
   * @param page generalFeatures(0) page number
   */
  page(page: number = 1): string {
    return ("&page=" + page);
  }
}
